function literalPattern(find: string, sensitive = false) {
  const escaped = [...find]
    .map((c) => ("\\^$.*+?()[]{}|".includes(c) ? "\\" + c : c))
    .join("");
  return new RegExp(escaped, sensitive ? "gu" : "giu");
}
export function matchCount(body: string, find: string, sensitive = false) {
  return find ? [...body.matchAll(literalPattern(find, sensitive))].length : 0;
}
export function replaceLiteral(
  body: string,
  find: string,
  replacement: string,
  sensitive = false,
  all = true,
) {
  if (!find) return body;
  let changed = false;
  return body.replace(literalPattern(find, sensitive), (match) => {
    if (!all && changed) return match;
    changed = true;
    return replacement;
  });
}
export function writingChecks(body: string) {
  const issues: string[] = [];
  if (/\]\(https?:\/\/\s*\)/i.test(body)) issues.push("有未填写完整的网址");
  if (/^#\s+/m.test(body))
    issues.push("正文使用了一级标题，通常从二级标题开始更清楚");
  if (/\b(?:TODO|FIXME)\b|待补充|此处填写/.test(body))
    issues.push("有待补充的标记，发布前再看一眼");
  if ((body.match(/^```/gm) || []).length % 2) issues.push("有代码块没有闭合");
  return issues;
}
