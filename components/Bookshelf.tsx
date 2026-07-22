"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

type Book = {
  title: string;
  spineTitle: string;
  author: string;
  spineAuthor: string;
  cover: string;
  coverWidth: number;
  coverHeight: number;
  spineColor: string;
  spineInk: string;
  url: string;
};

const books: Book[] = [
  {
    title: "Homo Deus",
    spineTitle: "Homo Deus",
    author: "Yuval Noah Harari",
    spineAuthor: "YNH",
    cover: "/books/homo-deus.jpg",
    coverWidth: 329,
    coverHeight: 500,
    spineColor: "#303033",
    spineInk: "#f4eee5",
    url: "https://openlibrary.org/books/OL27226513M/Homo_deus",
  },
  {
    title: "Zero to One",
    spineTitle: "Zero to One",
    author: "Peter Thiel with Blake Masters",
    spineAuthor: "PT",
    cover: "/books/zero-to-one.jpg",
    coverWidth: 332,
    coverHeight: 500,
    spineColor: "#7899ba",
    spineInk: "#171717",
    url: "https://www.penguinrandomhouse.com/books/234730/zero-to-one-by-peter-thiel-with-blake-masters/",
  },
  {
    title: "The Intelligent Investor",
    spineTitle: "Intelligent Investor",
    author: "Benjamin Graham",
    spineAuthor: "BG",
    cover: "/books/intelligent-investor.jpg",
    coverWidth: 325,
    coverHeight: 500,
    spineColor: "#8c281c",
    spineInk: "#fff8e8",
    url: "https://www.overdrive.com/media/37031/the-intelligent-investor-revised-edition",
  },
  {
    title: "The Inequality Paradox",
    spineTitle: "Inequality Paradox",
    author: "Douglas McWilliams",
    spineAuthor: "DM",
    cover: "/books/inequality-paradox.jpg",
    coverWidth: 920,
    coverHeight: 1389,
    spineColor: "#75b844",
    spineInk: "#17210f",
    url: "https://www.abramsbooks.com/product/inequality-paradox_9781468314984/",
  },
  {
    title: "Atomic Habits",
    spineTitle: "Atomic Habits",
    author: "James Clear",
    spineAuthor: "JC",
    cover: "/books/atomic-habits.jpg",
    coverWidth: 331,
    coverHeight: 500,
    spineColor: "#e7d8bd",
    spineInk: "#201c17",
    url: "https://www.penguinrandomhouse.com/books/543993/atomic-habits-by-james-clear/9780735211292/",
  },
  {
    title: "A Little History of Economics",
    spineTitle: "Little History of Economics",
    author: "Niall Kishtainy",
    spineAuthor: "NK",
    cover: "/books/little-history-economics.jpg",
    coverWidth: 320,
    coverHeight: 500,
    spineColor: "#b32620",
    spineInk: "#fff8e8",
    url: "https://yalebooks.yale.edu/book/9780300226317/a-little-history-of-economics/",
  },
  {
    title: "The Power of Habit",
    spineTitle: "Power of Habit",
    author: "Charles Duhigg",
    spineAuthor: "CD",
    cover: "/books/power-of-habit.jpg",
    coverWidth: 290,
    coverHeight: 450,
    spineColor: "#f2d813",
    spineInk: "#1d1b16",
    url: "https://www.penguinrandomhouse.com/books/202855/the-power-of-habit-by-charles-duhigg/9780812981605/",
  },
  {
    title: "Becoming Supernatural",
    spineTitle: "Becoming Supernatural",
    author: "Dr Joe Dispenza",
    spineAuthor: "JD",
    cover: "/books/becoming-supernatural.jpg",
    coverWidth: 333,
    coverHeight: 500,
    spineColor: "#a8c5bd",
    spineInk: "#17201d",
    url: "https://www.penguinrandomhouse.com/books/598767/becoming-supernatural-by-dr-joe-dispenza/",
  },
];

export default function Bookshelf() {
  const [open, setOpen] = useState(0);
  const controls = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedBook = books[open];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowLeft") next = (index - 1 + books.length) % books.length;
    if (event.key === "ArrowRight") next = (index + 1) % books.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = books.length - 1;
    if (next === null) return;

    event.preventDefault();
    setOpen(next);
    controls.current[next]?.focus();
  };

  return (
    <section className="about-bookshelf" aria-labelledby="bookshelf-title">
      <div className="about-bookshelf-head">
        <h2 className="about-block-label" id="bookshelf-title">On my shelf</h2>
        <p>Choose a spine to pull a book forward.</p>
      </div>

      <div className="bookshelf-viewport">
        <ul className="bookshelf-list" aria-label="Bookshelf">
          {books.map((book, index) => {
            const isOpen = index === open;
            const lean = index % 2 === 0 ? 1.4 + index * 0.08 : -1.25 - index * 0.07;
            return (
              <li
                className="bookshelf-book"
                data-open={isOpen ? "" : undefined}
                key={book.title}
                style={
                  {
                    "--book-ratio": book.coverWidth / book.coverHeight,
                    "--book-lean": `${lean}deg`,
                    "--spine-color": book.spineColor,
                    "--spine-ink": book.spineInk,
                  } as CSSProperties
                }
              >
                <button
                  className="bookshelf-trigger"
                  type="button"
                  ref={(node) => { controls.current[index] = node; }}
                  aria-pressed={isOpen}
                  aria-label={`${book.title} by ${book.author}${isOpen ? ", currently shown" : ", select"}`}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => setOpen(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  <span className="bookshelf-book-inner">
                    <span className="bookshelf-cover">
                      <Image
                        src={book.cover}
                        alt=""
                        width={book.coverWidth}
                        height={book.coverHeight}
                        sizes="150px"
                      />
                    </span>
                    <span className="bookshelf-spine">
                      <span className="bookshelf-spine-title">{book.spineTitle}</span>
                      <span className="bookshelf-spine-author">{book.spineAuthor}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <span className="bookshelf-plank" aria-hidden="true" />
      </div>

      <a
        className="bookshelf-annotation"
        href={selectedBook.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>{selectedBook.title}</span>
        <span className="bookshelf-annotation-author">{selectedBook.author}</span>
        <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
