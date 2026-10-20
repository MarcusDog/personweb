import { useEffect, useRef, useState } from "react";
import { X, History, RotateCcw } from "lucide-react";
import { api } from "./context";
import { Prose, textFor } from "./components";
import type { CmsItem, Kind } from "./types";

type Revision = {
  id: string;
  action: string;
  createdAt: string;
  title: { zh: string; en: string };
  characters: number;
};
export function RevisionHistory({
  kind,
  id,
  onRestore,
  onClose,
}: {
  kind: Kind;
  id: string;
  onRestore: (revisionId: string) => Promise<void>;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<Revision[]>([]),
    [selected, setSelected] = useState(""),
    [snapshot, setSnapshot] = useState<CmsItem | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [confirm, setConfirm] = useState(false),
    [retry, setRetry] = useState(0);
  const sequence = useRef(0);
  const base = `/api/admin/content/${kind}/${encodeURIComponent(id)}/revisions`;
  useEffect(() => {
    const panel = dialog.current,
      focus = document.activeElement as HTMLElement;
    panel?.showModal();
    return () => {
      panel?.close();
      focus?.focus();
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    api<Revision[]>(base, { signal: controller.signal })
      .then(setItems)
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, [base, retry]);
  async function preview(revisionId: string) {
    const version = ++sequence.current;
    setSelected(revisionId);
    setSnapshot(null);
    setConfirm(false);
    setError("");
    try {
      const value = await api<CmsItem>(`${base}/${revisionId}`);
      if (sequence.current === version) setSnapshot(value);
    } catch (e) {
      if (sequence.current === version) setError((e as Error).message);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="revision-dialog"
      aria-labelledby="revision-heading"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <header>
        <div>
          <p className="eyebrow">DRAFT HISTORY</p>
          <h2 id="revision-heading">
            <History size={22} />
            版本历史
          </h2>
          <p>保留最近 60 个变化版本。恢复仅写入草稿，不改变前台。</p>
        </div>
        <button
          className="icon-button"
          aria-label="关闭版本历史"
          disabled={busy}
          onClick={onClose}
        >
          <X size={21} />
        </button>
      </header>
      {error && (
        <div className="error-message" role="alert">
          {error}
          <button
            className="text-link"
            onClick={() => {
              setError("");
              setRetry((n) => n + 1);
            }}
          >
            重试读取
          </button>
        </div>
      )}
      <div className="revision-layout">
        <nav aria-label="历史版本">
          {items.length ? (
            items.map((item) => (
              <button
                key={item.id}
                aria-pressed={selected === item.id}
                disabled={busy}
                onClick={() => void preview(item.id)}
              >
                <strong>
                  {{
                    draft: "草稿保存",
                    publish: "发布版本",
                    unpublish: "撤回发布",
                  }[item.action] || "历史版本"}
                </strong>
                <time>{new Date(item.createdAt).toLocaleString("zh-CN")}</time>
                <span>
                  {textFor(item.title, "zh")} · {item.characters} 字符
                </span>
              </button>
            ))
          ) : (
            <p>还没有版本。正文有变化并保存后，会记录在这里。</p>
          )}
        </nav>
        <section className="revision-preview">
          {snapshot ? (
            <>
              <p className="eyebrow">READ ONLY PREVIEW</p>
              <h3>{textFor(snapshot.title, "zh") || "随想"}</h3>
              <Prose
                body={
                  textFor(snapshot.body || snapshot.summary, "zh") ||
                  "这个版本没有正文。"
                }
              />
            </>
          ) : (
            <p>选择左侧版本，先看看当时写了什么。</p>
          )}
        </section>
      </div>
      <footer>
        {confirm ? (
          <>
            <p>会先保存当前草稿，再恢复选中的版本。已发布内容保持不变。</p>
            <button
              className="button"
              disabled={busy}
              onClick={() => setConfirm(false)}
            >
              取消
            </button>
            <button
              className="button primary"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError("");
                try {
                  await onRestore(selected);
                  onClose();
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "正在恢复…" : "确认恢复为草稿"}
            </button>
          </>
        ) : (
          <button
            className="button primary"
            disabled={!snapshot || busy}
            onClick={() => setConfirm(true)}
          >
            <RotateCcw size={16} />
            恢复这个版本
          </button>
        )}
      </footer>
    </dialog>
  );
}
