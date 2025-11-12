import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../services/book-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './book-create.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BookCreate {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private router = inject(Router);
  public bookForm: FormGroup;
  public isSubmitting = false;

  constructor() {
    this.bookForm = this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
      pages: [0, [Validators.required, Validators.minLength(2)]],
      available: [true, [Validators.required]]
    })
  }

    setNextId(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bookService.getBooks().subscribe({
        next: (books) => {
          const newId = books.length ? Math.max(...books.map(book => Number(book.id))) + 1 : 1;
          this.bookForm.patchValue({ id: newId.toString() });
          resolve();
        },
        error: (err) => {
          console.error('Error al obtener nuevo ID', err);
          reject(err);
        }
      });
    });
  }

  async submitWithId() {
    try {
      await this.setNextId();
      this.onSubmit();
    } catch (error) {
      console.error('No se pudo obtener nuevo ID');
    }
  }

  onSubmit(): void {
    if(this.bookForm.valid){
      this.isSubmitting = true;

      this.bookService
        .createBook(this.bookForm.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/books']);
          },
          error: (err) => {
            console.log('Error al crear categoría', err);
            this.isSubmitting = false;
          }
        })
    }
  }

  onCancel(): void{
    this.router.navigate(['/books']);
  }

  getErrorMessage(fieldname: string): string{
    const control = this.bookForm.get(fieldname);

    if(control?.hasError('required')){
      return `${fieldname} es requerido`
    }

    if (control?.hasError('minLength')){
      const minLength = control.errors?.['minLength'].requiredLength;
      return `${fieldname} debe tener al menos ${minLength} caracteres`;
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean{
    const control = this.bookForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}