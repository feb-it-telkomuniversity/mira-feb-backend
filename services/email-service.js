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
// Notifikasi kegiatan baru ke semua user dan tembusan admin
export const sendActivityNotificationEmail = async ({ activity, creator, allUserEmails = [] }) => {
    try {
        if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'false') {
            console.log('[EmailService] Notifikasi email kegiatan dinonaktifkan (ENABLE_EMAIL_NOTIFICATIONS=false).');
            return false;
        }

        const adminEmail = 'seb@telkomuniversity.ac.id';
        
        // Clean & deduplicate recipient emails
        const uniqueEmails = Array.from(new Set(
            allUserEmails
                .filter(e => e && typeof e === 'string' && e.includes('@'))
                .map(e => e.trim().toLowerCase())
        ));

        // Tembusan admin
        const ccList = [adminEmail];
        
        // Main recipient: creator email if valid, else admin
        const primaryTo = (creator?.email && creator.email.includes('@')) ? creator.email : adminEmail;
        
        // BCC to all other users so emails remain private
        const bccList = uniqueEmails.filter(e => e !== primaryTo && !ccList.includes(e));

        const startDateStr = activity.date ? new Date(activity.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-';
        const endDateStr = activity.endDate ? new Date(activity.endDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : null;
        const dateDisplay = endDateStr && endDateStr !== startDateStr ? `${startDateStr} s.d. ${endDateStr}` : startDateStr;

        const startTimeStr = activity.startTime ? new Date(activity.startTime).toTimeString().slice(0, 5) : '-';
        const endTimeStr = activity.endTime ? new Date(activity.endTime).toTimeString().slice(0, 5) : '-';

        const officialsList = Array.isArray(activity.officials) && activity.officials.length > 0 
            ? activity.officials.join(', ') 
            : 'Tidak ada pejabat spesifik yang ditugaskan';

        const creatorName = creator?.name || 'Sistem / Pengguna MIRA';
        const creatorRole = creator?.role ? ` (${creator.role.toUpperCase()})` : '';

        const mailOptions = {
            from: '"MIRA FEB Telkom University" <' + (process.env.SMTP_EMAIL || 'sekpimfeb.telkomuniv@gmail.com') + '>',
            to: primaryTo,
            cc: ccList,
            bcc: bccList.length > 0 ? bccList : undefined,
            subject: `[Agenda Baru] ${activity.title} - MIRA FEB`,
            html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
                <div style="background: linear-gradient(135deg, #009da5 0%, #0f766e 100%); padding: 20px 24px; border-radius: 12px; color: #ffffff; text-align: left; margin-bottom: 20px;">
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; background-color: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                        Notifikasi Agenda Kegiatan Baru
                    </span>
                    <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 700; line-height: 1.3; color: #ffffff;">${activity.title}</h2>
                    <p style="margin: 0; font-size: 13px; opacity: 0.9;">Fakultas Ekonomi dan Bisnis (FEB) - Telkom University</p>
                </div>

                <div style="background-color: #ffffff; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; margin-bottom: 14px; font-size: 14px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                        Detail Agenda Kegiatan
                    </h3>
                    
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <tr>
                            <td style="padding: 8px 0; color: #64748b; width: 140px; vertical-align: top;">Tanggal</td>
                            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">: ${dateDisplay}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Waktu</td>
                            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">: ${startTimeStr} – ${endTimeStr} WIB</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Ruangan / Lokasi</td>
                            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">: ${activity.room || 'Lainnya'} ${activity.locationDetail ? `(${activity.locationDetail})` : ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Unit Pelaksana</td>
                            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">: ${activity.unit || '-'} ${activity.otherUnit ? `(${activity.otherUnit})` : ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Estimasi Peserta</td>
                            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">: ${activity.participants || 0} Orang</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Pejabat Terlibat</td>
                            <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">: ${officialsList}</td>
                        </tr>
                        ${activity.description ? `
                        <tr>
                            <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Keterangan</td>
                            <td style="padding: 8px 0; color: #334155;">: ${activity.description}</td>
                        </tr>` : ''}
                    </table>
                </div>

                <div style="background-color: #f1f5f9; border-left: 4px solid #009da5; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 12px; color: #475569;">
                        <strong>Diinput Oleh:</strong> ${creatorName}${creatorRole}
                    </p>
                </div>

                <div style="text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                    <p style="margin: 0 0 4px 0;">Email ini dikirimkan secara otomatis oleh Sistem MIRA FEB Telkom University.</p>
                    <p style="margin: 0;">Tembusan: ${adminEmail}</p>
                </div>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Notifikasi] Berhasil terkirim. Message ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('[Email Notifikasi] Gagal mengirim email kegiatan:', error);
        return false;
    }
};


// Notifikasi disposisi surat masuk ke anggota unit kerja dan tembusan admin
export const sendDispositionNotificationEmail = async ({
    disposisi,
    suratMasuk,
    pemberi,
    recipientUnit,
    recipientEmails = []
}) => {
    try {
        const adminEmail = 'seb@telkomuniversity.ac.id';
        
        // Clean and deduplicate recipient emails
        const validEmails = Array.from(new Set(
            recipientEmails
                .filter(e => e && typeof e === 'string' && e.includes('@'))
                .map(e => e.trim().toLowerCase())
        ));

        // Primary recipient: if unit users have emails, send to them; otherwise fallback to adminEmail
        const primaryTo = validEmails.length > 0 ? validEmails : [adminEmail];
        const ccList = validEmails.length > 0 ? [adminEmail] : [];

        // Formatting
        const deadlineStr = disposisi.batasWaktu 
            ? new Date(disposisi.batasWaktu).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            : 'Tidak ditentukan';

        const tanggalSuratStr = suratMasuk?.tanggalSurat
            ? new Date(suratMasuk.tanggalSurat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            : '-';

        const instruksiLabels = {
            TindakLanjuti: 'Tindak Lanjuti & Laporkan',
            Pelajari: 'Pelajari & Beri Saran',
            Hadiri: 'Hadiri / Wakili',
            Simpan: 'Simpan / Arsipkan',
            DraftBalasan: 'Draft Balasan'
        };
        const instruksiText = instruksiLabels[disposisi.instruksi] || disposisi.instruksi;

        const pemberiName = pemberi?.name || 'Pimpinan FEB';
        const pemberiRole = pemberi?.role ? ` (${pemberi.role.toUpperCase()})` : '';
        const unitName = recipientUnit?.name || 'Unit Kerja Terkait';

        const mailOptions = {
            from: '"MIRA FEB Telkom University" <' + (process.env.SMTP_EMAIL || 'sekpimfeb.telkomuniv@gmail.com') + '>',
            to: primaryTo,
            cc: ccList.length > 0 ? ccList : undefined,
            subject: `[Disposisi Masuk] ${instruksiText} - ${suratMasuk?.perihal || 'Surat Masuk'}`,
            html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
                <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%); padding: 20px 24px; border-radius: 12px; color: #ffffff; text-align: left; margin-bottom: 20px;">
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; background-color: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                        Disposisi Naskah Dinas / Surat Masuk
                    </span>
                    <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 700; line-height: 1.3; color: #ffffff;">
                        ${instruksiText}
                    </h2>
                    <p style="margin: 0; font-size: 13px; opacity: 0.9;">Tujuan: <strong>${unitName}</strong> &bull; FEB Telkom University</p>
                </div>

                <!-- Detail Instruksi Pimpinan -->
                <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; border-radius: 12px; padding: 18px 20px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 14px; font-weight: 700; color: #1e40af;">
                        Instruksi & Arahan Pimpinan
                    </h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <tr>
                            <td style="padding: 6px 0; color: #475569; width: 140px; vertical-align: top;">Pemberi Disposisi</td>
                            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">: ${pemberiName}${pemberiRole}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #475569; vertical-align: top;">Aksi / Instruksi</td>
                            <td style="padding: 6px 0; color: #1d4ed8; font-weight: 700;">: ${instruksiText}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #475569; vertical-align: top;">Batas Waktu (Deadline)</td>
                            <td style="padding: 6px 0; color: #b91c1c; font-weight: 700;">: ${deadlineStr}</td>
                        </tr>
                        ${disposisi.catatan ? `
                        <tr>
                            <td style="padding: 6px 0; color: #475569; vertical-align: top;">Catatan Pimpinan</td>
                            <td style="padding: 6px 0; color: #334155; font-style: italic;">: "${disposisi.catatan}"</td>
                        </tr>` : ''}
                    </table>
                </div>

                <!-- Informasi Surat Masuk -->
                <div style="background-color: #ffffff; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <h3 style="margin-top: 0; margin-bottom: 14px; font-size: 14px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                        Rincian Surat Masuk
                    </h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; width: 140px; vertical-align: top;">Nomor Surat</td>
                            <td style="padding: 6px 0; color: #0f172a; font-weight: 600; font-family: monospace;">: ${suratMasuk?.nomorSuratAsal || '-'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Instansi Pengirim</td>
                            <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">: ${suratMasuk?.instansiPengirim || '-'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Tanggal Surat</td>
                            <td style="padding: 6px 0; color: #0f172a;">: ${tanggalSuratStr}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Klasifikasi</td>
                            <td style="padding: 6px 0; color: #0f172a;">: <strong>${suratMasuk?.kerahasiaan || 'Normal'}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Perihal</td>
                            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">: ${suratMasuk?.perihal || '-'}</td>
                        </tr>
                        ${suratMasuk?.ringkasan ? `
                        <tr>
                            <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Ringkasan Isi</td>
                            <td style="padding: 6px 0; color: #475569;">: ${suratMasuk.ringkasan}</td>
                        </tr>` : ''}
                    </table>

                    ${suratMasuk?.linkPdf ? `
                    <div style="margin-top: 16px; padding-top: 14px; border-top: 1px dashed #e2e8f0; text-align: left;">
                        <a href="${suratMasuk.linkPdf}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600;">
                            📄 Buka Berkas Lampiran Surat (PDF)
                        </a>
                    </div>` : ''}
                </div>

                <div style="text-align: center; margin-bottom: 20px;">
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 10px;">
                        Silakan login ke platform MIRA untuk menindaklanjuti atau memperbarui progres disposisi ini.
                    </p>
                </div>

                <div style="text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                    <p style="margin: 0 0 4px 0;">Email ini dikirimkan secara otomatis oleh Sistem Tata Kelola MIRA FEB Telkom University.</p>
                    <p style="margin: 0;">Tembusan: ${adminEmail}</p>
                </div>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email Disposisi] Berhasil terkirim ke [${primaryTo.join(', ')}]. Message ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('[Email Disposisi] Gagal mengirim email disposisi:', error);
        return false;
    }
};
