import type { BookId } from "./types";
import { Book } from "./book";

export class Library {
  private items: Map<BookId, Book> = new Map();

  public add(item: Book): void {
    if (this.items.has(item.id)) throw new Error("Item already exists");
    this.items.set(item.id, item);
  }

  public remove(id: BookId): void {
    const book = this.getBookOrThrow(id);
    if (book.getStatus() === "borrowed") throw new Error("Cannot remove borrowed item");
    this.items.delete(id);
  }

  public listAll(): Book[] {
    return Array.from(this.items.values());
  }

  public listAvailable(): Book[] {
    return this.listAll().filter((b) => b.getStatus() === "available");
  }

  public borrow(bookId: BookId, personName: string): void {
    const book = this.getBookOrThrow(bookId);
    book.markBorrowed(personName);
  }

  public return(bookId: BookId): void {
    const book = this.getBookOrThrow(bookId);
    book.markReturned();
  }

  private getBookOrThrow(id: BookId): Book {
    const book = this.items.get(id);
    if (!book) throw new Error("Book not found");
    return book;
  }
}
