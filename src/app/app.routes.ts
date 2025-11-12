import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
   
   {
      path: '',
      loadComponent: () => import('./pages/main-layout/main-layout.component'),
      children: [
         {
            path: '',
            loadComponent: () => import('./pages/home/home'),
            canActivate: [authGuard]
         },

         {
            path: 'books',
            loadChildren: () => import('./pages/book/book.routers'),
            canActivate: [authGuard, adminGuard]
         },

         {
            path: 'categories',
            loadChildren: () => import('./pages/category/category.routers'),
            canActivate: [authGuard, adminGuard]
         },

         {
            path: 'users',
            loadChildren: () => import('./pages/user/user.routers'),
            canActivate: [authGuard, adminGuard]
         },

         {
            path: 'login',
            loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
         }

      ]
   },
   {
      path: '**',
      redirectTo: ''
   }
];
