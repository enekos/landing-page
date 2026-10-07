-- SQLite cannot alter a CHECK constraint, so the table is rebuilt with bikote allowed.
CREATE TABLE signups_new (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT NOT NULL,
  app         TEXT NOT NULL CHECK (app IN ('lemazain', 'taula', 'adar', 'bidali', 'bikote')),
  source      TEXT,
  country     TEXT,
  ip_hash     TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE (email, app)
);
INSERT INTO signups_new (id, email, app, source, country, ip_hash, created_at)
  SELECT id, email, app, source, country, ip_hash, created_at FROM signups;
DROP TABLE signups;
ALTER TABLE signups_new RENAME TO signups;
CREATE INDEX IF NOT EXISTS signups_ip_time ON signups (ip_hash, created_at);
