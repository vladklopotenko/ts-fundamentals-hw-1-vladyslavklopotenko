// TODO: імпортуй потрібні типи з ./types
// import type { BookId, Genre, LoanStatus } from "./types";

export class Book {
  // TODO: додай типи до властивостей
  id;
  title;
  author;
  year;
  genre;

  status;
  borrowedBy;

  // TODO: реалізуй конструктор з параметром opts
  constructor(opts) {}

  // TODO: методи відповідно до ТЗ
  getStatus() {}

  markBorrowed(personName) {}

  markReturned() {}

  getInfo() {}
}
