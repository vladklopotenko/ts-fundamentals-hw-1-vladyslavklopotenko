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

  constructor(init: BookInit);
  constructor(id: BookId, title: string, author: string, year: number, genre: Genre);

  constructor(
    initOrId: BookInit | BookId,
    title?: string,
    author?: string,
    year?: number,
    genre?: Genre
  ) {
    if (typeof initOrId === "string") {
      this.id = initOrId;
      this.title = title as string;
      this.author = author as string;
      this.year = year as number;
      this.genre = genre as Genre;
    } else {
      this.id = initOrId.id;
      this.title = initOrId.title;
      this.author = initOrId.author;
      this.year = initOrId.year;
      this.genre = initOrId.genre;
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
    if (this.status === "available") {
      return `${base} [Available]`;
    }
    return `${base} [Borrowed by ${this.borrowedBy}]`;
  }
}
