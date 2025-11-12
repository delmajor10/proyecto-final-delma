import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CategoryService } from '../../services/category-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from '../../interfaces/category.interface';
import { AsyncPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-category-list',
  imports: [AsyncPipe, TitleCasePipe],
  templateUrl: './category-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoryList {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  public categories$: Observable<Category[]> = this.categoryService.getCategories();
  public isDeleting = signal<number | null>(null);

  onAddCategory(): void {
    this.router.navigate(['/categories/create-category']);
  }

  onEditCategory(id: number): void {
    this.router.navigate(['/categories', id]);
  }

  onDeleteCategory(id: number): void {
    if (confirm('¿Está seguro que desea eliminar esta categoría?')) {
      this.isDeleting.set(id);

      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categories$ = this.categoryService.getCategories();
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
}
