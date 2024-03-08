import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp} from '@angular/fire/app';
import { provideFirestore, getFirestore} from '@angular/fire/firestore';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyCXMEYCVyGJMf5kvo7cpk9UUdoCEiLmhh0",
  authDomain: "pricelist-437df.firebaseapp.com",
  projectId: "pricelist-437df",
  storageBucket: "pricelist-437df.appspot.com",
  messagingSenderId: "167838677966",
  appId: "1:167838677966:web:eb9c1543ca5334477b499f"
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),importProvidersFrom([
    provideFirebaseApp(()=>initializeApp(firebaseConfig)),
    provideFirestore(()=>getFirestore()),
  ])]
};
