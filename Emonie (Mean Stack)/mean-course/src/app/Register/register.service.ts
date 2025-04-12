import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from './register.model';

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    private apiUrl = 'http://localhost:3000/api/users';

    constructor(private http: HttpClient) { }

    // Create new user
    createUser(user: User): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, user)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Get all users
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Get user by ID
    getUserById(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Update user
    updateUser(id: string, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Delete user
    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Validate email uniqueness
    checkEmailExists(email: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/check-email/${email}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Error handling
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
            errorMessage = error.error.message || error.statusText;
        }
        
        return throwError(() => new Error(errorMessage));
    }
}
