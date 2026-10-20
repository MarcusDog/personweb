/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { PropsWithChildren } from "react";
import seed from "../data/project-snapshot.json";
import { getJournalEntries } from "../lib/content";
import type { GardenProject, SiteData } from "./types";

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const payload = await response.json();
  if (!response.ok || !payload.success)
    throw Error(payload.error || "请求失败，请稍后重试");
  return payload.data as T;
}
const initial: SiteData = {
  posts: getJournalEntries(),
  projects: seed as GardenProject[],
  notes: [],
  books: [],
  settings: {
    name: "小天Aya",
    intro: {
      zh: "喜欢研究 AI，也喜欢把脑海里的想法，做成真正能用的小东西。",
      en: "Exploring AI and turning ideas into useful little things.",
    },
    about: {
      zh: "我是小天，一个独立开发者。我做 AI 工具，也写下开发中遇到的问题和自己的判断。这里收着我的项目、读书笔记，以及一些还在慢慢想的事。",
      en: "I build AI tools and write about what I learn along the way.",
    },
    homeProjects: ["shizaolu", "voicedesk", "ainews-platform", "flow-socket"],
  },
};
type Theme = "light" | "dark" | "system";
const Context = createContext<{
  data: SiteData;
  username: string | null;
  refresh: () => Promise<void>;
  theme: Theme;
  setTheme: (t: Theme) => void;
  online: boolean;
}>({
  data: initial,
  username: null,
  refresh: async () => {},
  theme: "light",
  setTheme: () => {},
  online: false,
});
export function GardenProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState(initial);
  const [username, setUsername] = useState<string | null>(null);
  const [online, setOnline] = useState(false);
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = localStorage.getItem("aya-theme");
    return t === "dark" || t === "system" ? t : "light";
  });
  const refresh = useCallback(async () => {
    try {
      const [site, session] = await Promise.all([
        api<SiteData>("/api/site"),
        api<{ authenticated: boolean; username: string | null }>(
          "/api/admin/session",
        ),
      ]);
      setData(site);
      setUsername(session.authenticated ? session.username : null);
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, []);
  useEffect(() => {
    if (import.meta.env.MODE === "test") return;
    // Hydration is asynchronous: refresh sets state after the API resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    const update = () => void refresh();
    window.addEventListener("focus", update);
    return () => window.removeEventListener("focus", update);
  }, [refresh]);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme =
        theme === "system" ? (media?.matches ? "dark" : "light") : theme;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute(
          "content",
          document.documentElement.dataset.theme === "dark"
            ? "#191d21"
            : "#F8F7F3",
        );
    };
    apply();
    media?.addEventListener("change", apply);
    return () => media?.removeEventListener("change", apply);
  }, [theme]);
  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("aya-theme", t);
  }
  return (
    <Context.Provider
      value={{ data, username, refresh, theme, setTheme, online }}
    >
      {children}
    </Context.Provider>
  );
}
export const useGarden = () => useContext(Context);
