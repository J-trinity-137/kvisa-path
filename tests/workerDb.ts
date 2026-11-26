import type { Db, Prepared } from '../worker/src/index';

interface Counter {
  period: string;
  dim: string;
  value: string;
  n: number;
}

interface Question {
  id: string;
  week: string;
  lang: string;
  topic: string;
  submitter_kind: string;
  body_redacted: string;
  redaction_flags: string;
  status: string;
  faq_id: string | null;
  delete_token_hash: string;
  delete_after: string;
}

export class MemoryDb implements Db {
  counters: Counter[] = [];
  questions: Question[] = [];
  faqs: Record<string, string>[] = [];
  logs: { question_id: string; action: string; week: string }[] = [];

  prepare(sql: string): Prepared {
    const db = this;
    let args: unknown[] = [];
    const statement: Prepared = {
      bind(...values: unknown[]) {
        args = values;
        return statement;
      },
      async run() {
        db.apply(sql, args);
        return { success: true };
      },
      async all<T>() {
        return { results: db.query(sql, args) as T[] };
      },
      async first<T>() {
        return (db.query(sql, args)[0] as T) ?? null;
      },
    };
    return statement;
  }

  async batch(statements: Prepared[]): Promise<unknown> {
    for (const statement of statements) await statement.run();
    return [];
  }

  private key(row: Counter): string {
    return `${row.period}\u0000${row.dim}\u0000${row.value}`;
  }

  private apply(sql: string, args: unknown[]) {
    if (sql.startsWith('INSERT INTO stat_counter')) {
      const row = { period: String(args[0]), dim: String(args[1]), value: String(args[2]), n: Number(args[3] ?? 1) };
      const found = this.counters.find((item) => this.key(item) === this.key(row));
      if (found) found.n += row.n;
      else this.counters.push(row);
      return;
    }
    if (sql.startsWith('INSERT INTO question')) {
      this.questions.push({
        id: String(args[0]),
        week: String(args[1]),
        lang: String(args[2]),
        topic: String(args[3]),
        submitter_kind: String(args[4]),
        body_redacted: String(args[5]),
        redaction_flags: String(args[6]),
        status: String(args[7]),
        faq_id: null,
        delete_token_hash: String(args[8]),
        delete_after: String(args[9]),
      });
      return;
    }
    if (sql.startsWith('UPDATE question')) {
      const row = this.questions.find((item) => item.id === args[3]);
      if (!row) return;
      row.status = String(args[0]);
      row.faq_id = args[1] == null ? null : String(args[1]);
      row.delete_after = String(args[2]);
      return;
    }
    if (sql.startsWith('DELETE FROM question WHERE id')) {
      this.questions = this.questions.filter((item) => item.id !== args[0]);
      return;
    }
    if (sql.startsWith('DELETE FROM question WHERE delete_after')) {
      this.questions = this.questions.filter((item) => item.delete_after >= String(args[0]));
      return;
    }
    if (sql.startsWith('DELETE FROM stat_counter')) {
      this.counters = this.counters.filter((item) => !(item.period === args[0] && item.dim === args[1] && item.value === args[2]));
      return;
    }
    if (sql.startsWith('INSERT INTO moderation_log')) {
      this.logs.push({ question_id: String(args[0]), action: String(args[1]), week: String(args[2]) });
    }
  }

  private query(sql: string, args: unknown[]): unknown[] {
    if (sql.includes('FROM stat_counter WHERE dim')) {
      return this.counters
        .filter((item) => item.dim === args[0] && item.period >= String(args[1]))
        .map((item) => ({ value: item.value, n: item.n }));
    }
    if (sql.includes('FROM stat_counter WHERE period LIKE')) return this.counters.filter((item) => item.period.includes('-W'));
    if (sql.includes('delete_token_hash')) {
      const row = this.questions.find((item) => item.id === args[0]);
      return row ? [{ delete_token_hash: row.delete_token_hash, week: row.week }] : [];
    }
    if (sql.includes('FROM question WHERE delete_after')) {
      return this.questions.filter((item) => item.delete_after < String(args[0])).map((item) => ({ id: item.id }));
    }
    if (sql.includes('FROM question WHERE status')) {
      return this.questions
        .filter((item) => item.status === args[0])
        .map((item) => ({ id: item.id, lang: item.lang, topic: item.topic, body_redacted: item.body_redacted, status: item.status }));
    }
    if (sql.includes('FROM faq_draft')) return this.faqs;
    return [];
  }
}
