-- Person-level rows are not stored. Counters only.
CREATE TABLE stat_counter (
  period TEXT NOT NULL,
  dim    TEXT NOT NULL,
  value  TEXT NOT NULL,
  n      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (period, dim, value)
) WITHOUT ROWID;

CREATE TABLE question (
  id                TEXT PRIMARY KEY,
  week              TEXT NOT NULL,
  lang              TEXT NOT NULL CHECK (lang IN ('ko','en','zh-Hans','zh-Hant','vi','ru','mn','ar')),
  topic             TEXT NOT NULL,
  submitter_kind    TEXT NOT NULL CHECK (submitter_kind IN ('student14','guardian','teacher')),
  body_redacted     TEXT NOT NULL CHECK (length(body_redacted) BETWEEN 5 AND 1000),
  redaction_flags   TEXT NOT NULL DEFAULT '[]',
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','faq_candidate','answered_faq','rejected')),
  faq_id            TEXT,
  delete_token_hash TEXT NOT NULL,
  delete_after      TEXT NOT NULL
);
CREATE INDEX question_status ON question(status, week);
CREATE INDEX question_delete ON question(delete_after);

CREATE TABLE faq_draft (
  id           TEXT PRIMARY KEY,
  topic        TEXT NOT NULL,
  question_ko  TEXT NOT NULL,
  answer_ko    TEXT NOT NULL,
  source_url   TEXT NOT NULL,
  verified_on  TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','exported'))
);

CREATE TABLE moderation_log (
  id          INTEGER PRIMARY KEY,
  question_id TEXT NOT NULL,
  action      TEXT NOT NULL,
  week        TEXT NOT NULL
);
