export const writingTemplates = [
  {
    id: "technical",
    label: "技术深思 · 从问题到判断",
    kinds: ["posts"],
    body: "## 我想弄清楚的问题\n\n先写清楚问题发生在什么场景，为什么值得花时间。\n\n## 资料与事实\n\n哪些是已经核对过的事实？为关键说法补上原始链接。\n\n## 我的判断\n\n把推论和资料结论分开，说明取舍与适用范围。\n\n## 反例与限制\n\n什么情况下这个判断不成立？还缺哪些证据？\n\n## 下一步验证\n\n写下一个可以执行的小测试。\n\n## 参考资料\n\n- [来源标题](https://)\n",
  },
  {
    id: "review",
    label: "项目复盘 · 记录真实过程",
    kinds: ["posts"],
    body: "## 当时遇到的问题\n\n## 第一版做了什么\n\n## 卡住的地方\n\n## 关键取舍\n\n## 结果与未完成的事\n\n只写能核对的结果，没有测试过的地方直接说明。\n\n## 如果再做一次\n",
  },
  {
    id: "reading",
    label: "读书笔记 · 带着问题读",
    kinds: ["posts", "books"],
    body: "## 带着什么问题开始读\n\n## 值得留下的观点\n\n引用时记录原文与页码，避免把自己的转述当成作者原话。\n\n## 我赞同与犹豫的地方\n\n## 与手头事情的联系\n\n## 还想继续读什么\n",
  },
  {
    id: "note",
    label: "随想 · 留住一个念头",
    kinds: ["notes", "posts"],
    body: "今天注意到一件事：\n\n它让我想到：\n\n还没想清楚的是：\n",
  },
];
export function writingStats(markdown: string) {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`#>*_~|]/g, "");
  const han = (text.match(/\p{Script=Han}/gu) || []).length;
  const words = (text.match(/[\p{L}\p{N}]+/gu) || []).filter(
    (word) => !/\p{Script=Han}/u.test(word),
  ).length;
  return {
    count: han + words,
    minutes: Math.max(1, Math.ceil(han / 350 + words / 200)),
    images: (markdown.match(/!\[[^\]]*\]\([^)]*\)/g) || []).length,
  };
}
