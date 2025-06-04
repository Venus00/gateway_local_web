"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUpdatedEmail = void 0;
exports.PasswordUpdatedEmail = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8fdf6;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        .email-container {
            background-color: white;
            max-width: 600px;
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #f39130;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 24px;
        }
        .body {
            padding: 20px;
            color: #333;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            padding: 15px;
            border-top: 1px solid #eaeaea;
        }
        .highlight-box {
            background-color: #f8f8f8;
            border-left: 4px solid #f39130;
            padding: 12px;
            margin: 20px 0;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            PASSWORD UPDATED SUCCESSFULLY
        </div>
        <div class="body">
            <p>Your <strong>DigiSenese</strong> account password has been changed.</p>
            
            <div class="highlight-box">
                <strong>Important:</strong> If you did not make this change, please contact our support team immediately.
            </div>
            
            <p>For security reasons, we recommend:</p>
            <ul style="text-align: left; max-width: 80%; margin: 0 auto;">
                <li>Using a strong, unique password</li>
                <li>Dont share your password with anyone</li>
                <li>Updating your password regularly</li>
            </ul>
        </div>
        <div class="footer">
            This email address is not monitored. Please do not reply to this message.
            <br><br>
            <small>© 2023 DigiSenese. All rights reserved.</small>
        </div>
    </div>
</body>
</html>
`;
//# sourceMappingURL=PasswordUpdatedEmail.js.map