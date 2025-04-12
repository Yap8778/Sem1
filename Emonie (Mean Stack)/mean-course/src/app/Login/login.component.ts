import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        <div class="login-container">
            <h2>Login</h2>
            <p>Login component will be implemented here</p>
            <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </div>
    `,
    styles: [`
        .login-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    `]
})
export class LoginComponent {} 