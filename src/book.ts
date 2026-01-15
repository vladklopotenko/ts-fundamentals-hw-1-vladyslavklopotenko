import type { BookId, Genre, LoanStatus } from "./types";

type BookInit = {
  id: BookId;
  title: string;
  author: string;
  year: number;
  genre: Genre;
};

export class Book {
  public id: BookId;
  public title: string;
  public author: string;
  public year: number;
  public genre: Genre;

  private status: LoanStatus = "available";
  private borrowedBy: string | null = null;

  // overloads
  constructor(init: BookInit);
  constructor(id: BookId, title: string, author: string, year: number, genre: Genre);

  constructor(
    a: BookInit | BookId,
    title?: string,
    author?: string,
    year?: number,
    genre?: Genre
  ) {
    if (typeof a === "object") {
      this.id = a.id;
      this.title = a.title;
      this.author = a.author;
      this.year = a.year;
      this.genre = a.genre;
    } else {
      this.id = a;
      this.title = title as string;
      this.author = author as string;
      this.year = year as number;
      this.genre = genre as Genre;
    }
  }

  public getStatus(): LoanStatus {
    return this.status;
  }

  public markBorrowed(personName: string): void {
    if (this.status === "borrowed") {
      throw new Error(`Already borrowed by ${this.borrowedBy}`);
    }
    this.status = "borrowed";
    this.borrowedBy = personName;
  }

  public markReturned(): void {
    if (this.status === "available") {
      throw new Error("Already available");
    }
    this.status = "available";
    this.borrowedBy = null;
  }

  public getInfo(): string {
    const base = `${this.title} – ${this.author} (${this.year}), ${this.genre}`;
    if (this.status === "available") return `${base} [Available]`;
    return `${base} [Borrowed by ${this.borrowedBy}]`;
  }
}
