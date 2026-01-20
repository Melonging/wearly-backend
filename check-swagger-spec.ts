import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wearly API",
      version: "1.0.0",
      description: "Wearly 서비스의 API 문서입니다.",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "로컬 서버",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT 토큰을 입력하세요 (Bearer 제외)",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "./src/routes/*.ts"),
    path.join(__dirname, "./src/routes/**/*.ts")
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

console.log('Available paths:');
Object.keys(swaggerDocs.paths || {}).forEach(path => {
  console.log('  ' + path);
  Object.keys(swaggerDocs.paths[path]).forEach(method => {
    console.log('    ' + method.toUpperCase() + ': ' + (swaggerDocs.paths[path][method].summary || 'No summary'));
  });
});

console.log('\nTotal paths:', Object.keys(swaggerDocs.paths || {}).length);
