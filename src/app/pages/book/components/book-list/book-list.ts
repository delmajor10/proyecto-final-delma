import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BookService } from '../../services/book-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from '../../interfaces/book.interface';
import { AsyncPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-book-list',
  imports: [AsyncPipe, TitleCasePipe],
  templateUrl: './book-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BookList {
  private bookService = inject(BookService);
  private router = inject(Router);

  public books$: Observable<Book[]> = this.bookService.getBooks();
  public isDeleting = signal<number | null>(null);

  onAddBook(): void {
    this.router.navigate(['/books/create-book']);
  }

  onEditBook(id: number): void {
    this.router.navigate(['/books', id]);
  }

  onDeleteBook(id: number): void {
    if (confirm('¿Está seguro que desea eliminar esta categoría?')) {
      this.isDeleting.set(id);

      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books$ = this.bookService.getBooks();
          this.isDeleting.set(null);
        },
        error: (error) => {
          console.error('Error eliminando la categoría:', error);
          this.isDeleting.set(null);
          alert('Error al eliminar la categoría');
        }
      });
    }
  }

displayAvailability(available: boolean): string {
    return available ? 'Disponible' : 'No disponible';
}

}