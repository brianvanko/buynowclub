import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Simple token generation (in production, use JWT or similar)
const tokenStore = new Map<string, { userId: string; expires: number }>();

export function createEmailToken(userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  tokenStore.set(token, { userId, expires });

  // Clean up expired tokens
  for (const [key, value] of tokenStore.entries()) {
    if (value.expires < Date.now()) {
      tokenStore.delete(key);
    }
  }

  return token;
}

export function verifyEmailToken(token: string): string | null {
  const data = tokenStore.get(token);

  if (!data) return null;
  if (data.expires < Date.now()) {
    tokenStore.delete(token);
    return null;
  }

  tokenStore.delete(token); // Single use token
  return data.userId;
}

export async function sendVerificationEmail(email: string, userId: string) {
  const token = createEmailToken(userId);
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@buynowclub.com',
    to: email,
    subject: 'Verify Your Email - Buy Now Club',
    html: `
      <h1>Welcome to Buy Now Club!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>Or copy and paste this link in your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
