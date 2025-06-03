export const forgetPasswordEmail = `
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
           
        .button {
            display: block;
            width: 80%;
            max-width: 300px;
            margin: 20px auto;
            text-align: center;
            text-decoration: none;
            background-color: #f39130;
            color: white !important;
            padding: 12px 20px;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #f39130;
        }
        .link {
            color: #f39130;
            word-break: break-word;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            padding: 15px;
            border-top: 1px solid #eaeaea;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
           PASSWORD CHANGE REQUEST
        </div>
        <div class="body">
          <p>We have received a password change request for your <strong>DigiSenese</strong>  account.
</p>
            <p>This link will expire in 24 hours. If you have not requested a password change, please ignore this email. No changes will be made to your account.</p>
            <a target="_blank" href="[Reset Password Link]" class="button">Change My Password</a>
            
        </div>
        <div class="footer">
           This email address is not monitored. Please do not reply to this message
        </div>
    </div>
</body>
</html>
`