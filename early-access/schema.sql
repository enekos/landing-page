CREATE TABLE IF NOT EXISTS signups (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT NOT NULL,
  app         TEXT NOT NULL CHECK (app IN ('lemazain', 'taula', 'adar')),
  source      TEXT,
  country     TEXT,
  ip_hash     TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE (email, app)
);
CREATE INDEX IF NOT EXISTS signups_ip_time ON signups (ip_hash, created_at);
