import { Routes } from '@angular/router';

export const categoryRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/category-list/category-list')
    },

    {
        path: 'create-category',
        loadComponent: () => import('./components/category-create/category-create')
    },

    {
        path: ':id',
        loadComponent: () => import('./components/category-by-id/category-by-id')
    },
   
   {
    path: '**',
    redirectTo: ''
   }
];

export default categoryRoutes;