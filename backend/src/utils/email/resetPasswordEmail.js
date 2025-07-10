// src/utils/email/resetPassHtml.js

export const resetPassHtml = (resetUrl) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset Request</title>
    <style>7
        /* Base Styles */
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        /* Header */
        .header {
            padding: 24px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            text-align: center;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 700;
            color: white;
            text-decoration: none;
        }
        
        /* Content */
        .content {
            padding: 32px;
        }
        
        h2 {
            color: #111827;
            font-size: 24px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 24px;
        }
        
        p {
            margin-bottom: 16px;
            font-size: 16px;
            color: #4b5563;
        }
        
        /* Button */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #6366f1;
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.2s ease;
        }
        
        .button:hover {
            background-color: #4f46e5;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }
        
        /* Footer */
        .footer {
            padding: 24px;
            text-align: center;
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
        
        .footer a {
            color: #6366f1;
            text-decoration: none;
            transition: color 0.2s ease;
        }
        
        .footer a:hover {
            color: #4f46e5;
            text-decoration: underline;
        }
        
        /* Responsive */
        @media only screen and (max-width: 480px) {
            .email-container {
                width: 100% !important;
                padding: 16px;
            }

            .header {
                padding: 16px;
            }

            .content {
                padding: 16px;
            }

            h2 {
                font-size: 20px;
                margin-bottom: 16px;
            }

            p {
                font-size: 14px;
            }

            .button {
                padding: 10px 20px;
                font-size: 14px;
            }

            .footer {
                font-size: 12px;
                padding: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <a href="http://localhost:5173" class="logo">Work-in-Progress</a>
        </div>
        <div class="content">
            <h2>Password Reset Request</h2>
            <p>You recently requested to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>This link will expire after 3 minutes. If you didn't request it, please ignore this email.</p>
            <p>Thanks,<br><strong>The Work-in-Progress Team</strong></p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
