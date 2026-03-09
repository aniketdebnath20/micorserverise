import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const startSendOTPConsumer = async () => {
    try {
        console.log("🚀 Starting OTP consumer...");
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOST,
            port: 5672,
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASSWORD,
        });
        const channel = await connection.createChannel();
        const queueName = "send-otp";
        await channel.assertQueue(queueName, { durable: true });
        console.log("📧 OTP Email Consumer started");
        channel.consume(queueName, async (msg) => {
            if (!msg)
                return;
            console.log("📨 Message received:", msg.content.toString());
            try {
                const { to, subject, body } = JSON.parse(msg.content.toString());
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                });
                await transporter.sendMail({
                    from: `"Chat App" <${process.env.EMAIL_USER}>`,
                    to,
                    subject,
                    text: body,
                });
                console.log(`✅ OTP email sent to ${to}`);
                channel.ack(msg);
            }
            catch (err) {
                console.error("❌ Email send failed:", err);
                channel.nack(msg, false, false);
            }
        });
    }
    catch (err) {
        console.error("❌ Consumer crashed:", err);
    }
};
//# sourceMappingURL=user.js.map