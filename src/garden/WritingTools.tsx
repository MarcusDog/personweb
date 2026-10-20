import { useEffect, useRef, useState } from "react";
import { Search, Undo2, Check, Target } from "lucide-react";
import { matchCount, replaceLiteral, writingChecks } from "./writing-tools";
import { writingStats } from "./writing";

export function WritingTools({
  body,
  goal = 0,
  onChange,
  onGoal,
}: {
  body: string;
  goal?: number;
  onChange: (body: string) => void;
  onGoal: (goal: number) => void;
}) {
  const [open, setOpen] = useState(false),
    [find, setFind] = useState(""),
    [replacement, setReplacement] = useState(""),
    [sensitive, setSensitive] = useState(false);
  const [undo, setUndo] = useState<{ before: string; after: string } | null>(
      null,
    ),
    [notice, setNotice] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const count = matchCount(body, find, sensitive),
    stats = writingStats(body),
    issues = writingChecks(body);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "f"
      ) {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => search.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  function replace(all: boolean) {
    const after = replaceLiteral(body, find, replacement, sensitive, all);
    if (after === body) {
      setNotice("没有需要替换的内容。");
      return;
    }
    setUndo({ before: body, after });
    onChange(after);
    setNotice(`已替换 ${all ? count : 1} 处，可撤销。`);
  }
  return (
    <details
      className="studio-writing-tools"
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>
        <Search size={16} />
        查找替换与写作目标<span>Ctrl / ⌘ Shift F</span>
      </summary>
      <div className="writing-tools-content">
        <div className="writing-find-grid">
          <label>
            查找文字
            <input
              ref={search}
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder="按原样查找，不使用正则表达式"
            />
          </label>
          <label>
            替换为
            <input
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="留空可删除匹配文字"
            />
          </label>
        </div>
        <div className="writing-find-actions">
          <label className="inline-choice">
            <input
              type="checkbox"
              checked={sensitive}
              onChange={(e) => setSensitive(e.target.checked)}
            />
            区分大小写
          </label>
          <span>{find ? `找到 ${count} 处` : "仅处理当前语言的正文"}</span>
          <button
            type="button"
            className="button"
            disabled={!count}
            onClick={() => replace(false)}
          >
            替换一处
          </button>
          <button
            type="button"
            className="button"
            disabled={!count}
            onClick={() => replace(true)}
          >
            全部替换
          </button>
          {undo && (
            <button
              type="button"
              className="text-link"
              disabled={body !== undo.after}
              title={
                body !== undo.after ? "正文已有新修改，不覆盖后续写作" : ""
              }
              onClick={() => {
                onChange(undo.before);
                setUndo(null);
                setNotice("已撤销替换。");
              }}
            >
              <Undo2 size={15} />
              撤销替换
            </button>
          )}
        </div>
        <p role="status" className="metadata">
          {notice}
        </p>
        <div className="writing-goal">
          <label>
            <Target size={16} />
            本篇目标（字 / 词）
            <input
              type="number"
              min={0}
              max={100000}
              step={100}
              value={goal}
              onChange={(e) =>
                onGoal(
                  Math.max(0, Math.min(100000, Number(e.target.value) || 0)),
                )
              }
            />
          </label>
          {goal > 0 ? (
            <div>
              <progress
                max={goal}
                value={Math.min(goal, stats.count)}
                aria-label="写作目标进度"
              />
              <span>
                {stats.count >= goal
                  ? "已达到目标"
                  : `还差 ${goal - stats.count} 字 / 词`}{" "}
                · {Math.min(100, Math.round((stats.count / goal) * 100))}%
              </span>
            </div>
          ) : (
            <p>设为 0 即不设置目标。目标只用于提醒，不影响发布。</p>
          )}
        </div>
        <div className="writing-review">
          <strong>发布前检查</strong>
          {issues.length ? (
            issues.map((issue) => <p key={issue}>{issue}</p>)
          ) : (
            <p>
              <Check size={14} />
              未发现占位链接或未闭合代码块。内容与事实仍需要你核对。
            </p>
          )}
        </div>
      </div>
    </details>
  );
}
