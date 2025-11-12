import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book-service'

@Component({
  selector: 'app-book-by-id',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-by-id.html',
})
export default class BookById implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private router = inject(Router); 
  private route = inject(ActivatedRoute);

  public bookForm: FormGroup;
  public isSubmitting = false;
  public isLoading = true;
  public bookId: number = 0;

  constructor() {
    this.bookForm = this.fb.group({
      id: [0],
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
      pages: [0, [Validators.required, Validators.minLength(2)]],
      available: [true, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.bookId) {
      this.loadBook();
    }
  }

  loadBook(): void {
    this.bookService.getBookById(this.bookId).subscribe({
      next: (book) => {
        if (book) {
          this.bookForm.patchValue(book);
          this.isLoading = false;
        } else {
          this.router.navigate(['/books']);
        }
      },
      error: (error) => {
        console.error('Error loading book:', error);
        this.router.navigate(['/books']);
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.isSubmitting = true;

      this.bookService.updateBook(this.bookId, this.bookForm.value).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (error) => {
          console.error('Error updating book:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.bookForm.controls).forEach(key => {
        this.bookForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/books']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.bookForm.get(fieldName);

    if (control?.hasError('required')) {
      return `${fieldName} es requerido`;
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${fieldName} debe tener al menos ${minLength} caracteres`;
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.bookForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}