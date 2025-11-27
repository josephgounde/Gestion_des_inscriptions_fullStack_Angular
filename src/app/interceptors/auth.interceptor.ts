// src/app/interceptors/auth.interceptor.ts
// FUNCTIONAL INTERCEPTOR (Modern Angular 17+ way)
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🔥 INTERCEPTOR IS RUNNING! 🔥');
  console.log('📍 Request URL:', req.url);
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  if (token) {
    console.log('✅ Token found:', token.substring(0, 20) + '...');
    
    // Clone request and add Authorization header
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Authorization header added to request');
    return next(clonedReq);
  } else {
    console.warn('⚠️ NO TOKEN FOUND - Request will fail with 401');
    return next(req);
  }
};