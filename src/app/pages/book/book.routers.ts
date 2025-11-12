import { Routes } from '@angular/router';

export const bookRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/book-list/book-list')
    },

    {
        path: 'create-book',
        loadComponent: () => import('./components/book-create/book-create')
    },

    {
        path: ':id',
        loadComponent: () => import('./components/book-by-id/book-by-id')
    },
   
   {
    path: '**',
    redirectTo: ''
   }
];

export default bookRoutes;