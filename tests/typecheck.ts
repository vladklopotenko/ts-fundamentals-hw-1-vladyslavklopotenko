// tests/typecheck.ts
// 🧪 Перевірки ТИПІВ (без рантайму). Запуск: `npm run typecheck`
// Ідея: якщо типи неправильні — TypeScript має впасти. Рядки з `@ts-expect-error`
// спеціально містять помилки типів: якщо помилки НЕ буде — tsc теж впаде.

import { Book } from "../src/book";
import { Library } from "../src/library";
import type { BookId, Genre, LoanStatus } from "../src/types";

/** Допоміжна утиліта: перевіряємо, що фактичний тип збігається з очікуваним */
function assertType<T>(_v: T) {
  /* no-op, важливий лише для типів */
}

// ---------- Book: конструктор та публічні поля ----------

// ✅ Валідний приклад створення книги
const goodBook = new Book({
  id: "b1" as BookId,
  title: "The Hobbit",
  author: "J.R.R. Tolkien",
  year: 1937,
  genre: "fantasy" as Genre,
});

// ❌ Невалідні приклади (мають впасти на типах)

// @ts-expect-error id має бути рядком (BookId)
new Book({ id: 123, title: "t", author: "a", year: 2000, genre: "fiction" });

// @ts-expect-error year має бути number
new Book({ id: "b2", title: "t", author: "a", year: "2000", genre: "fiction" });

// @ts-expect-error genre має бути одним із літералів Genre
new Book({ id: "b3", title: "t", author: "a", year: 2000, genre: "sci-fi" });

// ✅ Перевіряємо типи публічних властивостей
assertType<BookId>(goodBook.id);
assertType<string>(goodBook.title);
assertType<string>(goodBook.author);
assertType<number>(goodBook.year);
assertType<Genre>(goodBook.genre);

// ---------- Book: методи та їхні сигнатури ----------

// ✅ getStatus повертає LoanStatus
const status = goodBook.getStatus();
assertType<LoanStatus>(status);

// ❌ markBorrowed має приймати лише рядок
// @ts-expect-error тільки string дозволено
goodBook.markBorrowed(42);
goodBook.markBorrowed("Alice");

// ❌ markReturned не приймає аргументів
// @ts-expect-error метод не приймає аргументи
goodBook.markReturned("extra");

// ✅ getInfo повертає рядок
assertType<string>(goodBook.getInfo());

// ---------- Library: публічний API та типи аргументів/повернень ----------

const lib = new Library();

// ❌ add приймає лише екземпляр Book
// @ts-expect-error не приймає plain-об’єкт
lib.add({});
lib.add(goodBook);

// ❌ borrow: перший аргумент — BookId (string), другий — string
// @ts-expect-error id має бути string
lib.borrow(123, "Alice");
// @ts-expect-error name має бути string
lib.borrow("b1", 123);
// ✅ валідний виклик
lib.borrow("b1", "Alice");

// ❌ return: приймає лише BookId (string)
// @ts-expect-error id має бути string
lib.return(456);
// ✅ валідний виклик
lib.return("b1");

// ✅ listAll / listAvailable повертають масиви Book
assertType<Book[]>(lib.listAll());
assertType<Book[]>(lib.listAvailable());

// ❌ remove: приймає лише BookId (string)
// @ts-expect-error id має бути string
lib.remove(789);
// ✅ валідний виклик
lib.remove("b1");

// ---------- Додатково: гарантія, що в публічному API Book немає any ----------

// Перевірка на `any`
type IsAny<T> = 0 extends 1 & T ? true : false;

// Витягуємо типи з полів/методів, які є публічними
type PublicBookApi =
  | (typeof goodBook)["id"]
  | (typeof goodBook)["title"]
  | (typeof goodBook)["author"]
  | (typeof goodBook)["year"]
  | (typeof goodBook)["genre"]
  | ReturnType<typeof goodBook.getStatus>
  | ReturnType<typeof goodBook.getInfo>;

// ❌ Якщо десь просочиться any — цей рядок спричинить помилку компіляції
// @ts-expect-error Публічний API Book не повинен містити any
type _NoAnyInBookApi = IsAny<PublicBookApi> extends true ? "has-any" : "ok";
