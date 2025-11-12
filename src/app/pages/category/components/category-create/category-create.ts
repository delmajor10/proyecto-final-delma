import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-create.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoryCreate {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  public categoryForm: FormGroup;
  public isSubmitting = false;

  constructor() {
    this.categoryForm = this.fb.group({
      id: [0],
      categoryname: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  setNextId(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          const newId = categories.length ? Math.max(...categories.map(category => Number(category.id))) + 1 : 1;
          this.categoryForm.patchValue({ id: newId.toString() });
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
    if(this.categoryForm.valid){
      this.isSubmitting = true;

      this.categoryService
        .createCategory(this.categoryForm.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/categories']);
          },
          error: (err) => {
            console.log('Error al crear categoría', err);
            this.isSubmitting = false;
          }
        })
    }
  }

  onCancel(): void {
    this.router.navigate(['/categories']);
  }

  getErrorMessage(fieldname: string): string {
    const control = this.categoryForm.get(fieldname);

    if(control?.hasError('required')){
      return `${fieldname} es requerido`
    }

    if (control?.hasError('minLength')){
      const minLength = control.errors?.['minLength'].requiredLength;
      return `${fieldname} debe tener al menos ${minLength} caracteres`;
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.categoryForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}

