import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = 'http://127.0.0.1:3000/api/reviews';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getReviewsByProduct(productId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}`);
  }

  addReview(review: { productId: number; rating: number; comment: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(this.apiUrl, review, { headers });
  }
}