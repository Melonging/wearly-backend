// src/utils/email.ts
import nodemailer from "nodemailer";

// 6자리 랜덤 인증 코드 생성
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// SMTP 트랜스포터 설정
// 환경변수에 따라 실제 SMTP 설정을 변경하세요
export const createTransporter = () => {
  // Gmail 사용 예시 (비추천 - 제한 많음)
  // Gmail 사용 시: Gmail 설정 -> 보안 -> 2단계 인증 활성화 후 앱 비밀번호 생성 필요

  // SendGrid, Mailgun, AWS SES 등을 사용하는 것을 권장
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com", // SMTP 호스트
    port: parseInt(process.env.SMTP_PORT || "587"), // 587 (TLS) 또는 465 (SSL)
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // SMTP 사용자명 (이메일)
      pass: process.env.SMTP_PASS, // SMTP 비밀번호 (앱 비밀번호)
    },
  });

  return transporter;
};

// 인증 코드 이메일 발송
export const sendVerificationEmail = async (
  email: string,
  code: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER, // 발신자
      to: email, // 수신자
      subject: "Wearly 이메일 인증 코드", // 제목
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Wearly 이메일 인증</h2>
          <p style="color: #666; font-size: 16px;">
            안녕하세요! Wearly 회원가입을 위한 인증 코드입니다.
          </p>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4CAF50; letter-spacing: 5px; margin: 0;">
              ${code}
            </h1>
          </div>
          <p style="color: #666; font-size: 14px;">
            이 인증 코드는 <strong>5분간 유효</strong>합니다.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            본인이 요청하지 않은 경우, 이 이메일을 무시하셔도 됩니다.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`인증 코드 발송 성공: ${email}`);
    return true;
  } catch (error) {
    console.error("이메일 발송 실패:", error);
    return false;
  }
};
