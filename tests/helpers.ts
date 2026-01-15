import { Book } from "../src/book";

export const makeBook = (
  over: Partial<ConstructorParameters<typeof Book>[0]> = {}
) =>
  new Book({
    id: over.id ?? "id-" + cryptoRandom(),
    title: over.title ?? "Title",
    author: over.author ?? "Author",
    year: over.year ?? 2000,
    genre: over.genre ?? "fiction",
  });

const cryptoRandom = () => Math.random().toString(36).slice(2, 8);

// Допоміжна функція для пошуку книги за id у масиві
export const byId = (arr: { id: string }[], id: string) =>
  arr.find((x) => x.id === id);
