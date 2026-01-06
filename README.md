# wearly-backend
Wearly 프로젝트 백엔드(API 서버) 레포지토리입니다. 
(서버 로직, 데이터베이스, API 제공을 담당합니다.)


---

## 기술 스택
- Language: Typescript
- Framework: Express
- Database: PostgresSQL
- ORM: Prisma
- Auth: kakao 
- Deploy: Render / Vercel / Supabase

---

## 아키텍처 개요
- Controller → Service → Repository(Prisma) 구조 
- 데이터는 PostgreSQL에 저장하며 Prisma 를 통해 접근함
- 이미지는 S3에 업로드함
- 인증은 JWT 기반

---

## 폴더 구조
src/routes
src/controller
src/service
src/repository
src/dto

---

## 주요 기능 (API)
- 옷장 조회 API
- 이미지 업로드 API
- 로그인 API (JWT)
- 통계 집계 API
- 날씨 API 연동
- 착용 이력 저장 API

---

## 실행 방법
추후 결정

---

## 환경 변수
추후 결정

---

## 협업 규칙
- 기본 브랜치: main
- 개발 브랜치: dev
- 브랜치 네이밍 /  커밋 메시지 규칙: <img width="611" height="618" alt="image" src="https://github.com/user-attachments/assets/b05f8084-3f8f-496d-9489-9d8422034646" />

---

## 참고
- API 문서:
- 배포 주소:


