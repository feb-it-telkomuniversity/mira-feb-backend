import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS
    }
});

// Fungsi yang siap dipanggil dari controller
export const sendOtpEmail = async (toEmail, otpCode) => {
    try {
        const mailOptions = {
            from: '"Layanan MIRA FEB" <mirahelpdesk@gmail.com>',
            to: toEmail,
            subject: 'Kode Verifikasi HaloDekan - MIRA FEB',
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; background-color: #faf5f0; padding: 30px; border-radius: 12px; border: 1px solid #fca5a5;">
                <h2 style="color: #991b1b; text-align: center; margin-bottom: 5px;">MIRA FEB</h2>
                <p style="color: #b91c1c; text-align: center; font-size: 14px; margin-top: 0;">Telkom University</p>
                
                <p style="color: #4a3b32; font-size: 16px; margin-top: 30px;">Halo,</p>
                <p style="color: #4a3b32; font-size: 16px; line-height: 1.5;">Berikut adalah kode OTP untuk masuk ke layanan HaloDekan. Mohon jangan berikan kode ini kepada siapa pun.</p>
                
                <div style="background-color: #ef4444; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
                    <span style="font-size: 36px; font-weight: bold; color: #450a0a; letter-spacing: 8px;">${otpCode}</span>
                </div>
                
                <p style="color: #7f1d1d; font-size: 14px;">Kode ini hanya berlaku selama <strong>5 menit</strong>.</p>
                
                <hr style="border: none; border-top: 1px solid #fecaca; margin: 30px 0 20px 0;">
                <p style="color: #9b5d5dff; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} MIRA FEB Telkom University. All rights reserved.</p>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        // console.log(`Email terkirim ke ${toEmail} [Message ID: ${info.messageId}]`);
        return true;
    } catch (error) {
        console.error('Gagal mengirim email OTP:', error);
        return false;
    }
}