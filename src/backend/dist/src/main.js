"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Orbix OEMS App')
        .setDescription('This is the backend of the Orbix OEMS App')
        .setVersion('1.0')
        .addBearerAuth()
        .addServer('http://localhost:3000/', 'Local environment')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(process.env.PORT || 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map