# 이메일 인증 설정 가이드

## 1. 환경 변수 설정

`.env` 파일에 다음 환경 변수를 추가하세요:

```env
# SMTP 이메일 설정
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

## 2. SMTP 제공자 선택 및 설정

-현재 SendGrid 사용중-

### 옵션 2: SendGrid

- **장점**: 무료 플랜 100통/일, 신뢰성 높음, API 문서 좋음
- **가격**: 무료 ~ $19.95/월 (40,000통)

**설정 방법:**

1. https://sendgrid.com 가입
2. API Key 생성 (Settings → API Keys)
3. 발신자 인증 (Settings → Sender Authentication)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=verified-email@yourdomain.com
```

## 3. 데이터베이스 마이그레이션

EmailVerification 테이블을 생성하기 위해 마이그레이션을 실행하세요:

```bash
npx prisma migrate dev --name add_email_verification
```

## 4. API 사용 방법

### 인증 코드 발송

```http
POST /api/auth/send-code
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**응답:**

```json
{
  "success": true,
  "message": "인증 코드가 이메일로 발송되었습니다.",
  "data": {
    "email": "user@example.com",
    "expiresIn": 300
  },
  "error": null
}
```

### 인증 코드 검증

```http
POST /api/auth/verify-code
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

**응답:**

```json
{
  "success": true,
  "message": "이메일 인증이 완료되었습니다.",
  "data": {
    "email": "user@example.com",
    "verified": true
  },
  "error": null
}
```

## 5. 프론트엔드 통합 플로우

1. 사용자가 이메일 입력
2. `POST /api/auth/send-code` 호출
3. 사용자가 받은 6자리 코드 입력
4. `POST /api/auth/verify-code` 호출로 검증
5. 검증 성공 후 회원가입 진행

## 6. 보안 고려사항

- 인증 코드는 5분간 유효
- 같은 이메일로 새 코드 요청 시 기존 코드 무효화
- 이미 가입된 이메일은 코드 발송 불가
- 코드는 DB에 평문 저장 (단기 사용 후 삭제)

## 7. 트러블슈팅

### 이메일이 발송되지 않는 경우

1. `.env` 파일 설정 확인
2. SMTP 자격 증명 확인
3. 방화벽/포트 차단 확인
4. 콘솔 로그 확인

### "Invalid login" 에러

- SMTP 사용자명/비밀번호 재확인
- Gmail의 경우 앱 비밀번호 사용 확인

### 이메일이 스팸함으로 가는 경우

- 발신자 인증 (SPF, DKIM, DMARC) 설정
- SendGrid, Mailgun 등 전문 서비스 사용 권장
