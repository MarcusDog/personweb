import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "../hooks/useLanguage";
import { ScrollToTop } from "../components/ScrollToTop";
import { GardenProvider } from "./context";
import { Shell } from "./Shell";
const pages = () => import("./PublicPages");
const Home = lazy(() => pages().then((m) => ({ default: m.Home })));
const Journal = lazy(() => pages().then((m) => ({ default: m.Journal })));
const Article = lazy(() => pages().then((m) => ({ default: m.Article })));
const Projects = lazy(() => pages().then((m) => ({ default: m.Projects })));
const ProjectDetail = lazy(() =>
  pages().then((m) => ({ default: m.ProjectDetail })),
);
const Notes = lazy(() => pages().then((m) => ({ default: m.Notes })));
const Reading = lazy(() => pages().then((m) => ({ default: m.Reading })));
const About = lazy(() => pages().then((m) => ({ default: m.About })));
const Commercial = lazy(() => pages().then((m) => ({ default: m.Commercial })));
const Contact = lazy(() => import('./ConnectPages').then((m) => ({ default: m.Contact })));
const Subscribe = lazy(() => import('./ConnectPages').then((m) => ({ default: m.Subscribe })));
const Missing = lazy(() => pages().then((m) => ({ default: m.Missing })));
const Studio = lazy(() =>
  import("./Studio").then((m) => ({ default: m.Studio })),
);
export default function GardenApp() {
  return (
    <LanguageProvider>
      <GardenProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense
            fallback={
              <div className="container loading-state" role="status">
                正在打开…
              </div>
            }
          >
            <Routes>
              <Route element={<Shell />}>
                <Route index element={<Home />} />
                <Route path="journal" element={<Journal />} />
                <Route path="journal/:slug" element={<Article />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:slug" element={<ProjectDetail />} />
                <Route path="notes" element={<Notes />} />
                <Route path="reading" element={<Reading />} />
                <Route path="about" element={<About />} />
                <Route path="commercial" element={<Commercial />} />
                <Route path="contact" element={<Contact />} />
                <Route path="subscribe" element={<Subscribe />} />
                <Route path="*" element={<Missing />} />
              </Route>
              <Route path="studio" element={<Studio />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </GardenProvider>
    </LanguageProvider>
  );
}
