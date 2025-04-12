import { Routes } from '@angular/router';
import { RegisterComponent } from './Register/register.component';
import { LoginComponent } from './Login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: '/register', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent }
];
