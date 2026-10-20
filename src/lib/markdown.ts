import type {
  JournalEntryFrontmatter,
  MarkdownHeading,
} from "../types/content";

export function parseBilingualMarkdown(source: string) {
  const normalizedSource = source.replace(/\r\n?/g, "\n");
  const frontmatterMatch = normalizedSource.match(
    /^---\n([\s\S]*?)\n---\n([\s\S]*)$/,
  );
  const frontmatter = (frontmatterMatch?.[1] ?? "")
    .split("\n")
    .filter(Boolean)
    .reduce<Record<string, string>>((accumulator, line) => {
      const separatorIndex = line.indexOf(":");
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      accumulator[key] = value;
      return accumulator;
    }, {});
  const content = frontmatterMatch?.[2] ?? normalizedSource;
  const [zhBlock = "", enBlock = ""] = content.split(/<!--lang:en-->/);
  const zh = zhBlock.replace(/<!--lang:zh-->/, "").trim();
  const en = enBlock.trim();

  return {
    frontmatter: frontmatter as unknown as JournalEntryFrontmatter,
    zh,
    en,
  };
}

export function makeHeadingId(text: string) {
  const normalized = text
    .trim()
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "");
  const englishStyle = normalized.toLowerCase().replace(/\s+/g, "-");
  return /[a-z0-9-]/.test(englishStyle) ? englishStyle : normalized;
}

export function extractMarkdownHeadings(source: string): MarkdownHeading[] {
  let fenced = false;
  const counts = new Map<string, number>();
  return source
    .split("\n")
    .filter((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fenced = !fenced;
        return false;
      }
      return !fenced;
    })
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => {
      const base = makeHeadingId(match[2]);
      const count = counts.get(base) || 0;
      counts.set(base, count + 1);
      return {
        depth: match[1].length,
        text: match[2].trim(),
        id: count ? `${base}-${count}` : base,
      };
    });
}
