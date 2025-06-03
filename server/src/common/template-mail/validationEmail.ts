export const validationEmail = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8fdf6;
            margin: 0;
            padding: 0;
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
            background-color: #4caf50;
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
            background-color: #4caf50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #43a047;
        }
        .link {
            color: #4caf50;
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
            Welcome to Iot Dashboard
        </div>
        <div class="body">
            <p>Hi <strong>Hello</strong>,</p>
            <p>We’re excited to have you join <strong>Digital Sense</strong>, the comprehensive solution for managing and visualizing IoT data in real-time!</p>
            <p>To get started and explore all the powerful features, please activate your account by clicking the button below:</p>
            <a href="[Activation Link]" class="button">Activate My Account</a>
            <p>If the button doesn’t work, please copy and paste this link into your browser:</p>
            <p><a href="[Activation Link]" class="link">[Activation Link]</a></p>
            <h3>What can you do with Iot Dashboard?</h3>
            <ul>
                <li>Monitor devices in real time to ensure seamless operations.</li>
                <li>Create virtual entities and associate them with real devices.</li>
                <li>Build dynamic dashboards for data visualization.</li>
                <li>Design workflows and playbooks for automated actions.</li>
            </ul>
            <p>If you have any questions or need assistance, our support team is here for you at <a href="mailto:[Support Email]" class="link">[Support Email]</a>.</p>
            <p>Let’s build smarter solutions together!</p>
        </div>
        <div class="footer">
           This email address is not monitored. Please do not reply to this message
        </div>
    </div>
</body>
</html>
`