export const TEACHER_FIELDS = ['id', 'label', 'grade', 'studentType', 'region', 'topics', 'notes', 'nextSteps', 'followUpOn'] as const;

export interface TeacherNote {
  id: string;
  label: string;
  grade: 'ms' | 'hs' | 'other';
  studentType: 'foreign_family' | 'mid_entry' | 'domestic_multicultural' | 'unsure';
  region: string;
  topics: string[];
  notes: string;
  nextSteps: string[];
  followUpOn: string;
}

interface StoredRow {
  id: string;
  iv: string;
  ciphertext: string;
}

export interface VaultStore {
  getSalt(): Promise<string | null>;
  setSalt(salt: string): Promise<void>;
  put(row: StoredRow): Promise<void>;
  all(): Promise<StoredRow[]>;
  clear(): Promise<void>;
}

export interface KvrecFile {
  v: 1;
  salt: string;
  iv: string;
  ciphertext: string;
}

const IDLE_MS = 10 * 60 * 1000;

function bytesToB64(bytes: Uint8Array): string {
  let text = '';
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
}

function b64ToBytes(value: string): Uint8Array {
  const text = atob(value);
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i += 1) bytes[i] = text.charCodeAt(i);
  return bytes;
}

export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 600_000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encrypt(key: CryptoKey, value: string): Promise<{ iv: string; ciphertext: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(value);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return { iv: bytesToB64(iv), ciphertext: bytesToB64(new Uint8Array(cipher)) };
}

async function decrypt(key: CryptoKey, iv: string, ciphertext: string): Promise<string> {
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: b64ToBytes(iv) as BufferSource },
    key,
    b64ToBytes(ciphertext) as BufferSource,
  );
  return new TextDecoder().decode(plain);
}

export function createMemoryStore(): VaultStore {
  let salt: string | null = null;
  const rows = new Map<string, StoredRow>();
  return {
    async getSalt() {
      return salt;
    },
    async setSalt(next) {
      salt = next;
    },
    async put(row) {
      rows.set(row.id, row);
    },
    async all() {
      return [...rows.values()];
    },
    async clear() {
      salt = null;
      rows.clear();
    },
  };
}

export function createIdbStore(): VaultStore {
  const open = () =>
    new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('kvisa-teacher', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('records')) db.createObjectStore('records', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'id' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  return {
    async getSalt() {
      const db = await open();
      return new Promise((resolve) => {
        const tx = db.transaction('meta', 'readonly');
        const req = tx.objectStore('meta').get('salt');
        req.onsuccess = () => resolve((req.result?.salt as string) ?? null);
      });
    },
    async setSalt(salt) {
      const db = await open();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('meta', 'readwrite');
        tx.objectStore('meta').put({ id: 'salt', salt });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    },
    async put(row) {
      const db = await open();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('records', 'readwrite');
        tx.objectStore('records').put(row);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    },
    async all() {
      const db = await open();
      return new Promise((resolve) => {
        const tx = db.transaction('records', 'readonly');
        const req = tx.objectStore('records').getAll();
        req.onsuccess = () => resolve(req.result as StoredRow[]);
      });
    },
    async clear() {
      const db = await open();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(['records', 'meta'], 'readwrite');
        tx.objectStore('records').clear();
        tx.objectStore('meta').clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    },
  };
}

export class TeacherVault {
  private key: CryptoKey | null = null;
  private salt = '';
  private touched = 0;

  constructor(
    private readonly store: VaultStore,
    private readonly now: () => number = () => Date.now(),
  ) {}

  private awake(): boolean {
    if (!this.key) return false;
    if (this.now() - this.touched > IDLE_MS) {
      this.key = null;
      return false;
    }
    this.touched = this.now();
    return true;
  }

  async unlock(password: string): Promise<void> {
    const existing = await this.store.getSalt();
    const saltBytes = existing ? b64ToBytes(existing) : crypto.getRandomValues(new Uint8Array(16));
    if (!existing) await this.store.setSalt(bytesToB64(saltBytes));
    this.salt = existing ?? bytesToB64(saltBytes);
    this.key = await deriveKey(password, saltBytes);
    this.touched = this.now();
    const rows = await this.store.all();
    if (rows[0]) await decrypt(this.key, rows[0].iv, rows[0].ciphertext);
  }

  lock(): void {
    this.key = null;
  }

  async save(note: TeacherNote): Promise<void> {
    if (!this.awake() || !this.key) throw new Error('locked');
    const clean: TeacherNote = {
      id: note.id,
      label: note.label.slice(0, 20),
      grade: note.grade,
      studentType: note.studentType,
      region: note.region,
      topics: note.topics,
      notes: note.notes.slice(0, 2000),
      nextSteps: note.nextSteps,
      followUpOn: note.followUpOn,
    };
    const packed = await encrypt(this.key, JSON.stringify(clean));
    await this.store.put({ id: clean.id, ...packed });
  }

  async list(): Promise<TeacherNote[]> {
    if (!this.awake() || !this.key) throw new Error('locked');
    const rows = await this.store.all();
    const notes: TeacherNote[] = [];
    for (const row of rows) notes.push(JSON.parse(await decrypt(this.key, row.iv, row.ciphertext)) as TeacherNote);
    return notes;
  }

  async exportFile(): Promise<KvrecFile> {
    const notes = await this.list();
    if (!this.key) throw new Error('locked');
    const packed = await encrypt(this.key, JSON.stringify(notes));
    return { v: 1, salt: this.salt, iv: packed.iv, ciphertext: packed.ciphertext };
  }

  async importFile(file: KvrecFile, password: string): Promise<void> {
    const key = await deriveKey(password, b64ToBytes(file.salt));
    const notes = JSON.parse(await decrypt(key, file.iv, file.ciphertext)) as TeacherNote[];
    await this.store.setSalt(file.salt);
    this.salt = file.salt;
    this.key = key;
    this.touched = this.now();
    for (const note of notes) await this.save(note);
  }

  async clearAll(): Promise<void> {
    this.key = null;
    await this.store.clear();
  }
}
