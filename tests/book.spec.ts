import { describe, it, expect } from "vitest";
import { makeBook } from "./helpers";

describe("Book", () => {
  // ✅ Перевіряємо початковий стан книги одразу після створення
  // Очікується статус "available" і правильний формат опису в getInfo()
  it("початковий стан: available + правильний формат опису", () => {
    const b = makeBook({
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      year: 1937,
      genre: "fantasy",
    });
    expect(b.getStatus()).toBe("available");
    expect(b.getInfo()).toBe(
      "The Hobbit — J.R.R. Tolkien (1937), fantasy [Available]"
    );
  });

  // ✅ Перевіряємо, що після позики статус змінюється на "borrowed",
  // а в описі зʼявляється ім'я людини, яка взяла книгу
  it("після позики статус змінюється, а імʼя позичальника відображається", () => {
    const b = makeBook({ title: "The Hobbit" });
    b.markBorrowed("Alice");
    expect(b.getStatus()).toBe("borrowed");
    expect(b.getInfo()).toContain("Borrowed by Alice");
  });

  // ✅ Якщо спробувати позичити книгу вдруге, має бути помилка
  // Текст помилки має точно збігатися з "Already borrowed by <name>"
  it('повторна позика кидає помилку "Already borrowed by <name>"', () => {
    const b = makeBook({ title: "The Hobbit" });
    b.markBorrowed("Alice");
    expect(() => b.markBorrowed("Bob")).toThrowError(
      "Already borrowed by Alice"
    );
  });

  // ✅ Перевіряємо, що після повернення книга знову стає "available",
  // а borrowedBy очищується
  it("після повернення статус знову available, позичальник очищується", () => {
    const b = makeBook();
    b.markBorrowed("Alice");
    b.markReturned();
    expect(b.getStatus()).toBe("available");
    expect(b.getInfo()).toContain("[Available]");
  });

  // ✅ Якщо спробувати повернути книгу, яка вже доступна,
  // має бути помилка з текстом "Already available"
  it('повторне повернення кидає помилку "Already available"', () => {
    const b = makeBook();
    expect(() => b.markReturned()).toThrowError("Already available");
  });

  // ✅ Перевіряємо, що після повернення книгу можна позичити знову
  // і текст помилки оновлюється відповідно до нового позичальника
  it("книгу можна позичити знову після повернення; помилка показує актуального позичальника", () => {
    const b = makeBook();
    b.markBorrowed("Alice");
    b.markReturned();
    b.markBorrowed("Charlie");
    expect(b.getStatus()).toBe("borrowed");
    expect(b.getInfo()).toContain("Borrowed by Charlie");
    expect(() => b.markBorrowed("Dave")).toThrowError(
      "Already borrowed by Charlie"
    );
  });
});
