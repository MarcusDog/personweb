import { useState } from "react";
import { BookOpen } from "lucide-react";
import type { Book } from "./types";
import { textFor } from "./text";

export function BookCover({ book }: { book: Book }) {
  const [failedUrl, setFailedUrl] = useState("");
  return (
    <div className="real-book-cover">
      {book.coverImage && failedUrl !== book.coverImage ? (
        <img
          src={book.coverImage}
          alt={`${textFor(book.title, "zh")} · ${book.author}，真实书封`}
          loading="lazy"
          width="240"
          height="360"
          onError={() => setFailedUrl(book.coverImage || "")}
        />
      ) : (
        <div className="cover-unavailable">
          <BookOpen size={28} />
          <span>书封暂不可用</span>
        </div>
      )}
    </div>
  );
}
