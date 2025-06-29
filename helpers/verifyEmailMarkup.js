import 'dotenv/config';

const { APP_DOMAIN } = process.env;
export default function verifyEmailMarkup(verificationToken) {
  return `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 40px 0;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 32px 32px 16px 32px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 16px;">Welcome to Our Service!</h2>
            <p style="color: #555; font-size: 16px; margin-bottom: 24px;">
              Thank you for registering. Please verify your email address to activate your account.
            </p>
            <a href="${APP_DOMAIN}/api/auth/verify/${verificationToken}" 
               style="display: inline-block; padding: 12px 28px; background: #4f8cff; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Verify Email
            </a>
            <p style="color: #888; font-size: 13px; margin-top: 32px;">
              If you did not create an account, please ignore this email.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
}