import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category-service'

@Component({
  selector: 'app-category-by-id',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-by-id.html',
})
export default class CategoryById implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public categoryForm: FormGroup;
  public isSubmitting = false;
  public isLoading = true;
  public categoryId: number = 0; 

  constructor() {
    this.categoryForm = this.fb.group({
      id: [0],
      categoryname: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.categoryId) {
      this.loadCategory();
    }
  }

  loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        if (category) {
          this.categoryForm.patchValue(category);
          this.isLoading = false;
        } else {
          this.router.navigate(['/categories']);
        }
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.router.navigate(['/categories']);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;

      this.categoryService.updateCategory(this.categoryId, this.categoryForm.value).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.categoryForm.get(fieldName);

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
    const control = this.categoryForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}

