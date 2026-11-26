import { describe, expect, it, vi } from 'vitest';
import { createMemoryStore, TEACHER_FIELDS, TeacherVault, type TeacherNote } from '../src/teacher/vault';

const note = {
  id: 'note-1',
  label: '2-3 A',
  grade: 'hs',
  studentType: 'mid_entry',
  region: 'seoul',
  topics: ['documents'],
  notes: '다음 주에 서류 목록을 다시 본다',
  nextSteps: ['docs'],
  followUpOn: '2026-12-01',
} satisfies TeacherNote;

describe('teacher vault', () => {
  it('encrypts notes, rejects the wrong password, and round-trips a kvrec file', async () => {
    vi.spyOn(globalThis, 'fetch');
    const store = createMemoryStore();
    let clock = 1_000;
    const vault = new TeacherVault(store, () => clock);
    await vault.unlock('correct horse');
    await vault.save(note);
    const stored = JSON.stringify(await store.all());
    expect(stored).not.toContain(note.notes);
    expect(stored).not.toContain('visa');
    expect(TEACHER_FIELDS).not.toContain('visa');

    const locked = new TeacherVault(store, () => clock);
    await expect(locked.unlock('wrong password')).rejects.toThrow();
    await locked.unlock('correct horse');
    expect((await locked.list())[0]?.notes).toBe(note.notes);

    const file = await locked.exportFile();
    expect(file.v).toBe(1);
    expect(file.ciphertext).not.toContain(note.notes);
    const imported = new TeacherVault(createMemoryStore(), () => clock);
    await expect(imported.importFile(file, 'wrong password')).rejects.toThrow();
    await imported.importFile(file, 'correct horse');
    expect((await imported.list())[0]?.label).toBe('2-3 A');

    clock += 11 * 60 * 1000;
    await expect(imported.list()).rejects.toThrow('locked');
    expect(globalThis.fetch).not.toHaveBeenCalled();
  }, 30_000);
});
