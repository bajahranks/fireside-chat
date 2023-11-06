import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBnPa5LmKXKQDEt6bA1dx2qP36wJHTDrIQ',
  authDomain: 'fireside-chat-32ae9.firebaseapp.com',
  projectId: 'fireside-chat-32ae9',
  storageBucket: 'fireside-chat-32ae9.appspot.com',
  messagingSenderId: '1073641899258',
  appId: '1:1073641899258:web:6ad14486e11a635faab543',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (user) => {
    user !== null ? console.log('logged in!') : console.log('No user');
  });

  await app.listen(3000);
}

bootstrap();
