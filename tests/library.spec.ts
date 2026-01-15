// tests/library.spec.ts
import { describe, it, expect } from "vitest";
import { Library } from "../src/library";
import { makeBook, byId } from "./helpers";

describe("Library", () => {
  // ✅ Перевіряємо, що додавання книги працює
  // Якщо спробувати додати книгу з тим самим id — очікуємо помилку "Item already exists"
  it("add додає книгу; дубльований id кидає помилку 'Item already exists'", () => {
    const lib = new Library();
    const b1 = makeBook({ id: "id-1" });

    lib.add(b1);
    expect(lib.listAll().length).toBe(1);
    expect(byId(lib.listAll(), "id-1")).toBeTruthy();

    expect(() => lib.add(b1)).toThrowError("Item already exists");
  });

  // ✅ Перевіряємо, що видалення книги працює
  // Якщо видалити книгу, якої вже немає — очікується помилка "Book not found"
  it("remove видаляє книгу; якщо id відсутній — помилка 'Book not found'", () => {
    const lib = new Library();
    const b1 = makeBook({ id: "id-2" });

    lib.add(b1);
    expect(lib.listAll().length).toBe(1);

    lib.remove("id-2");
    expect(lib.listAll().length).toBe(0);

    expect(() => lib.remove("id-2")).toThrowError("Book not found");
    expect(() => lib.remove("does-not-exist")).toThrowError("Book not found");
  });

  // ✅ Якщо спробувати видалити книгу, яка зараз позичена — очікуємо помилку
  // Текст помилки має бути "Cannot remove borrowed item"
  it("не можна видалити позичену книгу → 'Cannot remove borrowed item'", () => {
    const lib = new Library();
    lib.add(makeBook({ id: "id-3" }));

    lib.borrow("id-3", "Alice");
    expect(() => lib.remove("id-3")).toThrowError(
      "Cannot remove borrowed item"
    );
  });

  // ✅ Перевіряємо, що listAvailable не показує позичені книги,
  // а listAll завжди повертає всі книги
  it("listAvailable не включає позичені книги; listAll показує всі", () => {
    const lib = new Library();
    lib.add(makeBook({ id: "a" }));
    lib.add(makeBook({ id: "b" }));

    // Спочатку обидві книги доступні
    expect(
      lib
        .listAll()
        .map((b) => b.id)
        .sort()
    ).toEqual(["a", "b"]);
    expect(
      lib
        .listAvailable()
        .map((b) => b.id)
        .sort()
    ).toEqual(["a", "b"]);

    // Після позики книги "a" вона зникає зі списку доступних
    lib.borrow("a", "Alice");

    expect(
      lib
        .listAll()
        .map((b) => b.id)
        .sort()
    ).toEqual(["a", "b"]);
    expect(lib.listAvailable().map((b) => b.id)).toEqual(["b"]);
  });

  // ✅ Перевіряємо делегування помилок з класу Book:
  //  - повторна позика → "Already borrowed by <name>"
  //  - повторне повернення → "Already available"
  it("borrow/return делегують помилки з Book і передають точні повідомлення", () => {
    const lib = new Library();
    lib.add(makeBook({ id: "id-4" }));

    // Перше позичення — успішне
    lib.borrow("id-4", "Alice");

    // Повторна позика тієї ж книги → помилка
    expect(() => lib.borrow("id-4", "Bob")).toThrowError(
      "Already borrowed by Alice"
    );

    // Повернення — успішне
    lib.return("id-4");

    // Повторне повернення → помилка
    expect(() => lib.return("id-4")).toThrowError("Already available");
  });

  // ✅ Якщо спробувати позичити або повернути книгу, якої немає в бібліотеці,
  // очікується помилка "Book not found"
  it("borrow/return з неіснуючим id → помилка 'Book not found'", () => {
    const lib = new Library();

    expect(() => lib.borrow("missing", "Alice")).toThrowError("Book not found");
    expect(() => lib.return("missing")).toThrowError("Book not found");
  });
});
