import type { LocalizedText } from "../types/content";
export const textFor = (value: LocalizedText | undefined, lang: string) =>
  value?.[lang === "en" ? "en" : "zh"] || value?.zh || value?.en || "";
