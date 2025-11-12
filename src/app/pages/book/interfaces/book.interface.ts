export interface BookResponse {
  books: Book[];
}

export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  available: boolean;
}