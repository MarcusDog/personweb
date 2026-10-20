import { useEffect, useRef, useState } from "react";
import { RefreshCw, Check, ExternalLink } from "lucide-react";
import { api } from "./context";
import type { CmsItem } from "./types";

type Candidate = Pick<
  CmsItem,
  | "coverImage"
  | "coverSource"
  | "coverSourceUrl"
  | "coverEdition"
  | "coverMatch"
  | "coverOrigin"
> & { title: string; author: string; isbn?: string };
type Result = {
  status: "matched" | "ambiguous" | "missing";
  candidates: Candidate[];
};
export function BookCoverLookup({
  value,
  onChange,
}: {
  value: CmsItem;
  onChange: (patch: Partial<CmsItem>) => void;
}) {
  const [result, setResult] = useState<Result | null>(null),
    [status, setStatus] = useState(""),
    [retry, setRetry] = useState(0);
  const title = value.title?.zh || value.title?.en || "";
  const identity = JSON.stringify([
    title,
    value.originalTitle || "",
    value.author || "",
    value.isbn || "",
  ]);
  const previous = useRef(identity);
  useEffect(() => {
    const changed = previous.current !== identity;
    previous.current = identity;
    if (changed && value.coverOrigin === "lookup" && value.coverImage) {
      onChange({
        coverImage: "",
        coverMatch: "missing",
        coverSource: "",
        coverSourceUrl: "",
        coverEdition: "",
      });
      return;
    }
    if (
      value.coverOrigin === "manual" ||
      (value.coverImage && value.coverMatch === "confirmed")
    )
      return;
    if (!value.isbn && (!title.trim() || !value.author?.trim())) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus("正在匹配真实书封…");
      setResult(null);
      try {
        const found = await api<Result>("/api/admin/books/cover-lookup", {
          method: "POST",
          body: JSON.stringify({
            title,
            originalTitle: value.originalTitle,
            author: value.author,
            isbn: value.isbn,
          }),
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setResult(found);
        if (found.status === "matched" && found.candidates.length === 1) {
          const {
            title: matchedTitle,
            author: matchedAuthor,
            ...cover
          } = found.candidates[0];
          void matchedTitle;
          void matchedAuthor;
          onChange({
            ...cover,
            coverOrigin: "lookup",
            coverMatch: "confirmed",
          });
          setStatus("已匹配真实版本。仅保存至当前草稿，发布后前台才更新。");
        } else
          setStatus(
            found.status === "ambiguous"
              ? "找到多个可能的版本，请对照书名、作者和版本后选择，或补充 ISBN。"
              : "没有找到可确认的书封。可以补充 ISBN、重试，或在发布设置中上传。",
          );
      } catch (error) {
        if (!controller.signal.aborted) setStatus((error as Error).message);
      }
    }, 900);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    identity,
    title,
    value.originalTitle,
    value.author,
    value.isbn,
    value.coverImage,
    value.coverOrigin,
    value.coverMatch,
    onChange,
    retry,
  ]);
  return (
    <section className="cover-lookup" aria-label="真实书封匹配">
      <label>
        ISBN（可选，优先精确匹配）
        <input
          value={value.isbn || ""}
          onChange={(e) => onChange({ isbn: e.target.value })}
          placeholder="978…，支持 10 或 13 位"
        />
      </label>
      <label>
        原文书名（可选）
        <input
          value={value.originalTitle || ""}
          onChange={(e) => onChange({ originalTitle: e.target.value })}
          placeholder="帮助匹配对应的外文版本"
        />
      </label>
      <p role="status">
        {(value.coverOrigin === "manual" && value.coverMatch === "confirmed"
          ? "已采用你上传或确认的书封，自动查询不会覆盖。"
          : status) ||
          (value.coverMatch === "confirmed"
            ? "真实书封已确认。手动选择或上传优先，不会被自动查询替换。"
            : "填写书名与作者后自动查询。版本不明确时由你确认；草稿随时可保存。")}
      </p>
      {value.coverImage && (
        <div className="lookup-current">
          <img src={value.coverImage} alt="当前书封" width="90" height="135" />
          <span>
            <Check size={15} />{" "}
            {value.coverMatch === "confirmed" ? "封面已确认" : "待确认"}
            <p>{value.coverEdition}</p>
            {value.coverSourceUrl && (
              <a
                className="text-link"
                href={value.coverSourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                {value.coverSource}
                <ExternalLink size={14} />
              </a>
            )}
          </span>
        </div>
      )}
      {result?.status === "ambiguous" &&
        value.coverOrigin !== "manual" &&
        !value.coverImage && (
          <div className="cover-candidates">
            {result.candidates.map((c) => (
              <button
                type="button"
                key={c.coverImage}
                onClick={() => {
                  const {
                    title: ignoredTitle,
                    author: ignoredAuthor,
                    ...cover
                  } = c;
                  void ignoredTitle;
                  void ignoredAuthor;
                  onChange({
                    ...cover,
                    coverMatch: "confirmed",
                    coverOrigin: "manual",
                  });
                  setResult(null);
                  setStatus("已采用你确认的版本。");
                }}
              >
                <img src={c.coverImage} alt={`${c.title} 书封候选`} />
                <strong>{c.title}</strong>
                <p>{c.author}</p>
                <p>{c.coverEdition}</p>
                <span>确认这个版本</span>
              </button>
            ))}
          </div>
        )}
      <button
        type="button"
        className="text-link"
        onClick={() => {
          onChange({
            coverOrigin: "lookup",
            coverMatch: "missing",
            coverImage: "",
          });
          setRetry((n) => n + 1);
        }}
      >
        <RefreshCw size={15} />
        重新查找封面
      </button>
      <p>
        来源：Open Library。查找失败不影响保存草稿；上传入口在“发布设置 →
        封面”。
      </p>
    </section>
  );
}
