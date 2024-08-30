import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { authReducer } from './ngrx/auth/auth.reducer';
import { userReducer } from './ngrx/user/user.reducer';
import { wordsReducer } from './ngrx/word/words.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './ngrx/auth/auth.effects';
import { UserEffects } from './ngrx/user/user.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideStore({auth:authReducer,user:userReducer,word:wordsReducer}),
    provideEffects([AuthEffects,UserEffects])
  ],
};
