import type {
  JournalEntry,
  LocalizedText,
  ProjectEntry,
} from "../types/content";
export type Kind = "posts" | "projects" | "notes" | "books";
export interface Post extends JournalEntry {
  featured?: boolean;
  bodyDocuments?: Record<string, unknown>;
}
export interface GardenProject extends ProjectEntry {
  id: string;
  status?: string;
  order?: number;
  homeFeatured?: boolean;
  commercialFeatured?: boolean;
  projectStatus?: string;
  coverImage?: string;
  coverType?: string;
}
export interface Note {
  id: string;
  slug: string;
  date: string;
  body: LocalizedText;
  images?: string[];
  tags: string[];
  status?: string;
}
export interface Book {
  id: string;
  slug: string;
  title: LocalizedText;
  author: string;
  readingStatus: "reading" | "read" | "wish";
  progress: number;
  coverImage?: string;
  isbn?: string;
  originalTitle?: string;
  coverSource?: string;
  coverSourceUrl?: string;
  coverMatch?: "confirmed" | "ambiguous" | "missing";
  coverOrigin?: "lookup" | "manual";
  coverEdition?: string;
  body: LocalizedText;
  relatedSlug?: string;
  status?: string;
  tags?: string[];
}
export interface Settings {
  name: string;
  intro: LocalizedText;
  about: LocalizedText;
  homeProjects: string[];
}
export interface SiteData {
  posts: Post[];
  projects: GardenProject[];
  notes: Note[];
  books: Book[];
  settings: Settings;
}
export type CmsItem = Partial<GardenProject> &
  Partial<Note> &
  Partial<Book> & {
    bodyDocuments?: Record<string, unknown>;
    featured?: boolean;
    hasDraft?: boolean;
    updatedAt?: string;
    standfirst?: LocalizedText;
    writingGoal?: number;
  };
export interface Media {
  id: string;
  url: string;
  original?: string;
  width?: number;
  height?: number;
  type: string;
  caption: string;
  projectId?: string;
}
