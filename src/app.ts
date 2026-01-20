import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth";
import closetRoutes from "./routes/closet";
import uploadRoutes from "./routes/upload";

const app = express();

app.use(cors());
app.use(express.json());

// 스웨거 설정
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
      schemas: {
        // 에러 객체
        ErrorObject: {
          type: "object",
          properties: {
            code: {
              type: "string",
              example: "400",
            },
            message: {
              type: "string",
              example: "에러 메시지",
            },
            field: {
              type: "string",
              example: "fieldName",
            },
          },
        },
        // 공통 에러 응답
        ApiError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              $ref: "#/components/schemas/ErrorObject",
            },
          },
        },
        // 400 에러 응답
        BadRequestError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "400",
                },
                message: {
                  type: "string",
                  example: "필수 항목이 누락되었습니다.",
                },
                field: {
                  type: "string",
                  example: "userPassword",
                },
              },
            },
          },
        },
        // 401 에러 응답
        UnauthorizedError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "401",
                },
                message: {
                  type: "string",
                  example: "인증이 필요합니다.",
                },
              },
            },
          },
        },
        // 403 에러 응답
        ForbiddenError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "403",
                },
                message: {
                  type: "string",
                  example: "접근 권한이 없습니다.",
                },
              },
            },
          },
        },
        // 404 에러 응답
        NotFoundError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "404",
                },
                message: {
                  type: "string",
                  example: "요청한 리소스를 찾을 수 없습니다.",
                },
              },
            },
          },
        },
        // 409 에러 응답
        ConflictError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "409",
                },
                message: {
                  type: "string",
                  example: "이미 사용중인 아이디입니다.",
                },
                field: {
                  type: "string",
                  example: "userid",
                },
              },
            },
          },
        },
        // 500 에러 응답
        ServerError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "500",
                },
                message: {
                  type: "string",
                  example: "서버 오류가 발생했습니다.",
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "./routes/*.ts"),
    path.join(__dirname, "./routes/**/*.ts"),
  ], // 절대 경로로 수정함.
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 라우터 연결
app.use("/api/auth", authRoutes); // 모든 auth 관련 API는 /api/auth로 시작함
app.use("/api/closet", closetRoutes); // 모든 closet 관련 API는 /api/closet로 시작함
app.use("/api/upload", uploadRoutes); // 모든 upload 관련 API는 /api/upload로 시작함

app.listen(4000, () =>
  console.log("🚀 Server running on http://localhost:4000"),
);
