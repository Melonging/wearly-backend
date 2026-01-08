# wearly-backend
Wearly 프로젝트 백엔드(API 서버) 레포지토리입니다. 
(서버 로직, 데이터베이스, API 제공을 담당합니다.)


---

## 기술 스택
- Language: Typescript
- Framework: Express
- Database: Postgres
- ORM: Prisma
- Auth: kakao 
- Deploy: Render / Vercel / Supabase

---

## 아키텍처 개요
본 프로젝트는 사용자가 옷장 사진을 업로드하면, 백엔드가 OpenAI API로 이미지를 분석해 의류 아이템을 인식/분류하고 결과를 Supabase(Postgres)에 저장한 뒤, 프론트에서 옷장 목록을 조회/필터링 추천까지 할 수 있도록 제공하는 시스템입니다.

### Core Components
- **React (Frontend)**: 사진 업로드, 분류 결과 확인, 옷장 목록/필터 UI 제공
- **Node.js + Express (Backend)**: 업로드 요청 처리, OpenAI API 호출, 분류 결과 검증 및 DB 저장/조회 API 제공
- **Supabase (Postgres / Storage)**: 의류 메타데이터 저장(Postgres), 이미지 파일 저장(Storage)
- **Render (Deployment)**: 프론트/백엔드 서비스 배포 및 운영

### Main Flow (Upload → Analyze → Save → View)
1. 사용자가 사진을 업로드한다.
2. 백엔드가 이미지를 저장하고(예: Supabase Storage), 해당 이미지로 OpenAI API 분석을 요청한다.
3. OpenAI API 응답(카테고리/색상/태그 등)을 파싱·검증 후 Postgres에 저장한다.
4. 프론트는 저장된 의류 아이템을 조회하여 목록 및 필터링 기능으로 보여준다.

### Data Storage Policy
- **이미지 원본**은 파일 스토리지에 저장하고, DB에는 **image_url 및 메타데이터**만 저장한다.

### Security
- **OPENAI_API_KEY**, **Supabase Service Role Key**는 서버에서만 사용하며 클라이언트에 노출하지 않는다.

---

## 폴더 구조
- src/routes
- src/controller
- src/service
- src/repository
- src/dto

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
- API 문서: -
- 배포 주소: -


