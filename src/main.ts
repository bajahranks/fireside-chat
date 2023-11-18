// noinspection TypeScriptValidateTypes

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
//import { getAuth, onAuthStateChanged } from 'firebase/auth';

/*const firebaseConfig = {
  apiKey: 'AIzaSyBnPa5LmKXKQDEt6bA1dx2qP36wJHTDrIQ',
  authDomain: 'fireside-chat-32ae9.firebaseapp.com',
  projectId: 'fireside-chat-32ae9',
  storageBucket: 'fireside-chat-32ae9.appspot.com',
  messagingSenderId: '1073641899258',
  appId: '1:1073641899258:web:6ad14486e11a635faab543',
};*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  console.log('Loaded configuration:', {
    FIREBASE_PROJECT_ID: configService.get<string>('FIREBASE_PROJECT_ID'),
    FIREBASE_PRIVATE_KEY: configService.get<string>('FIREBASE_PRIVATE_KEY'),
    FIREBASE_CLIENT_EMAIL: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    API_PORT: configService.get<string>('API_PORT'),
  });

  // Set the config options
  const adminConfig: ServiceAccount = {
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    // eslint-disable-next-line prettier/prettier
    privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  };

  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    //databaseURL: "https://xxxxx.firebaseio.com",
  });

  // Initialize Firebase
  //const firebaseApp = initializeApp(firebaseConfig);
  /*const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (user) => {
    user !== null ? console.log('logged in!') : console.log('No user');
  });*/

  await app.listen(configService.get<string>('API_PORT') || 4000);
}

bootstrap();
