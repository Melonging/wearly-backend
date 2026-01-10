---
name: "🐛 버그 리포트 (Backend)"
about: API 에러나 서버 로직 결함을 해결하기 위한 이슈를 생성합니다.
title: "fix: [API/기능 요약]"
labels: "bug"
assignees: ''

---

## 🐛 어떤 버그인가요?
> 어떤 API 혹은 로직에서 문제가 발생했는지 설명해주세요.

## 😭 재현 방법
> 버그를 재현할 수 있는 요청(Request) 순서를 작성해주세요.
1. `[METHOD]` `[URL]` (예: POST /api/users/signup) 요청을 보낸다.
2. 전달한 Payload(Body): `{ "email": "test@test.com", ... }`
3. 발생한 에러 응답: `500 Internal Server Error`

## 📋 에러 로그 / 응답값
> 서버 터미널에 찍힌 로그나 Postman/클라이언트에서 받은 응답값을 붙여넣어주세요.
```bash
# 여기에 에러 로그를 붙여넣으세요.
```

## ✅ 예상 결과
> 정상적인 경우 어떤 응답(Status Code, JSON 등)이 와야 하나요?