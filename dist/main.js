"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const admin = require("firebase-admin");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    console.log('Loaded configuration:', {
        FIREBASE_PROJECT_ID: configService.get('FIREBASE_PROJECT_ID'),
        FIREBASE_PRIVATE_KEY: configService.get('FIREBASE_PRIVATE_KEY'),
        FIREBASE_CLIENT_EMAIL: configService.get('FIREBASE_CLIENT_EMAIL'),
        API_PORT: configService.get('API_PORT'),
    });
    const adminConfig = {
        projectId: configService.get('FIREBASE_PROJECT_ID'),
        privateKey: configService.get('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
        clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
    };
    admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
    });
    await app.listen(configService.get('API_PORT') || 4000);
}
bootstrap();
//# sourceMappingURL=main.js.map