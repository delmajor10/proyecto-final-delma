import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private httprequest = inject(HttpClient);

  public url: string = 'http://localhost:3000/categories';

  getCategories(): Observable<Category[]> {
    return this.httprequest.get<Category[]>(this.url);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.httprequest.get<Category>(`${this.url}/${id}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.httprequest.post<Category>(this.url, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.httprequest.put<Category>(`${this.url}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.httprequest.delete<void>(`${this.url}/${id}`);
  }

}

