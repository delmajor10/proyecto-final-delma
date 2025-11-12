import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book.interface';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private httprequest = inject(HttpClient);

  public url: string = 'http://localhost:3000/books';

  getBooks(): Observable<Book[]> {
    return this.httprequest.get<Book[]>(this.url);
  }

  getBookById(id: number): Observable<Book> {
    return this.httprequest.get<Book>(`${this.url}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.httprequest.post<Book>(this.url, book);
  }

  updateBook(id: number, Book: Book): Observable<Book> {
    return this.httprequest.put<Book>(`${this.url}/${id}`, Book);
  }

  deleteBook(id: number): Observable<void> {
    return this.httprequest.delete<void>(`${this.url}/${id}`);
  }

}
