const crypto = require("node:crypto");

function createHistory(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS garden_revisions(
    seq INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT UNIQUE NOT NULL,
    kind TEXT NOT NULL, content_id TEXT NOT NULL, snapshot TEXT NOT NULL,
    action TEXT NOT NULL, fingerprint TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS garden_revisions_item ON garden_revisions(kind,content_id,seq DESC);`);
  const capture = (kind, contentId, value, action) => {
    if (!value) return;
    const clean = { ...value };
    for (const key of ["updatedAt", "status", "hasDraft", "action", "id"])
      delete clean[key];
    const fingerprint = crypto
      .createHash("sha256")
      .update(JSON.stringify({ clean, action }))
      .digest("hex");
    const previous = db
      .prepare(
        "SELECT fingerprint FROM garden_revisions WHERE kind=? AND content_id=? ORDER BY seq DESC LIMIT 1",
      )
      .get(kind, contentId);
    if (previous?.fingerprint === fingerprint) return;
    db.prepare(
      "INSERT INTO garden_revisions(id,kind,content_id,snapshot,action,fingerprint,created_at) VALUES(?,?,?,?,?,?,?)",
    ).run(
      crypto.randomUUID(),
      kind,
      contentId,
      JSON.stringify(clean),
      action,
      fingerprint,
      new Date().toISOString(),
    );
    db.prepare(
      "DELETE FROM garden_revisions WHERE kind=? AND content_id=? AND seq NOT IN (SELECT seq FROM garden_revisions WHERE kind=? AND content_id=? ORDER BY seq DESC LIMIT 60)",
    ).run(kind, contentId, kind, contentId);
  };
  return {
    capture,
    list: (kind, id) =>
      db
        .prepare(
          "SELECT id,action,created_at,snapshot FROM garden_revisions WHERE kind=? AND content_id=? ORDER BY seq DESC LIMIT 60",
        )
        .all(kind, id)
        .map((row) => {
          const value = JSON.parse(row.snapshot);
          return {
            id: row.id,
            action: row.action,
            createdAt: row.created_at,
            title: value.title || { zh: "随想", en: "" },
            characters: String(value.body?.zh || value.summary?.zh || "")
              .length,
          };
        }),
    get: (kind, id, revisionId) => {
      const row = db
        .prepare(
          "SELECT snapshot FROM garden_revisions WHERE kind=? AND content_id=? AND id=?",
        )
        .get(kind, id, revisionId);
      return row ? JSON.parse(row.snapshot) : null;
    },
    remove: (kind, id) =>
      db
        .prepare("DELETE FROM garden_revisions WHERE kind=? AND content_id=?")
        .run(kind, id),
  };
}
module.exports = { createHistory };
