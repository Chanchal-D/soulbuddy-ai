import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class SubscriptionService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL")

    async def send_welcome_email(self, email: str) -> Optional[str]:
        if not all([self.smtp_username, self.smtp_password, self.from_email]):
            error_msg = "Email service configuration is incomplete. Please check SMTP settings."
            logger.error(error_msg)
            raise ValueError(error_msg)

        try:
            message = MIMEMultipart("alternative")
            message["From"] = self.smtp_username
            message["To"] = email
            message["Subject"] = "Welcome to SoulBuddy - Your Cosmic Journey Begins!"

            # Create both plain text and HTML versions
            text = """
            Hello and Welcome to SoulBuddy!
            Thank you for subscribing to our celestial insights and spiritual guidance.
            Start your journey here: https://soulbuddy.com/blog
            May the cosmos guide your path!
            Best regards,
            The SoulBuddy Team
            """

            html = """
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f8f8f8;
                    }
                    .header {
                        text-align: center;
                        padding: 20px 0;
                        background: linear-gradient(135deg, #663399 0%, #5B4B8A 100%);
                        color: white;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .content {
                        background: white;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .button {
                        display: inline-block;
                        padding: 12px 24px;
                        background: #663399;
                        color: white;
                        text-decoration: none;
                        border-radius: 25px;
                        margin: 20px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        color: #666666;
                        font-size: 0.9em;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to SoulBuddy</h1>
                    </div>
                    <div class="content">
                        <h2>Your Cosmic Journey Begins!</h2>
                        <p>Dear Cosmic Explorer,</p>
                        <p>Welcome to the SoulBuddy community! We're thrilled to have you join us on this spiritual journey.</p>
                        <p>Get ready to receive celestial insights and spiritual guidance that will help illuminate your path.</p>
                        <div style="text-align: center;">
                            <a href="https://soulbuddy.com/blog" class="button">Start Your Journey</a>
                        </div>
                        <p>Here's what you can expect from us:</p>
                        <ul>
                            <li>Weekly spiritual insights</li>
                            <li>Meditation guides</li>
                            <li>Cosmic energy updates</li>
                            <li>Personal growth resources</li>
                        </ul>
                        <p>May the cosmos guide your path!</p>
                        <p>With light and love,<br>The SoulBuddy Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 SoulBuddy. All rights reserved.</p>
                        <small>You're receiving this email because you subscribed to our newsletter.</small>
                    </div>
                </div>
            </body>
            </html>
            """

            # Attach both versions
            message.attach(MIMEText(text, "plain"))
            message.attach(MIMEText(html, "html"))

            # Connect to SMTP server and send
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(message)
                
            logger.info(f"Welcome email sent successfully to {email}")
            return None

        except Exception as e:
            error_msg = f"Failed to send welcome email: {str(e)}"
            logger.error(error_msg)
            raise 