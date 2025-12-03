import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // يمكنك استبدال هذه الإعدادات بمزود بريد إلكتروني حقيقي
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOTP(email: string, otp: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Egyptian National Railways" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: 'كود التحقق - السكك الحديدية المصرية',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">مرحباً بك في تطبيق السكك الحديدية المصرية</h2>
            <p>استخدم الكود التالي لإكمال عملية التسجيل:</p>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h1 style="color: #e74c3c; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p>ينتهي هذا الكود خلال <strong>10 دقائق</strong></p>
            <p>إذا لم تطلب هذا الكود، يرجى تجاهل هذه الرسالة.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #7f8c8d; font-size: 12px;">
              © ${new Date().getFullYear()} Egyptian National Railways. جميع الحقوق محفوظة.
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`OTP sent successfully to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}: ${error.message}`);
      return false;
    }
  }
}