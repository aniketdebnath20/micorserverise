// import amqp from "amqplib";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
export {};
// dotenv.config();
// export const startSendOTPConsumer = async () => {
//   try {
//     // 1. Connect to RabbitMQ
//     const connection = await amqp.connect({
//       protocol: "amqp",
//       hostname: process.env.RABBITMQ_HOST,
//       port: 5672,
//       username: process.env.RABBITMQ_USERNAME,
//       password: process.env.RABBITMQ_PASSWORD,
//     });
//     const channel = await connection.createChannel();
//     const queueName = "send-otp";
//     // 2. Assert queue BEFORE consuming
//     await channel.assertQueue(queueName, { durable: true });
//     console.log("📧 OTP Email Consumer started");
//     // 3. Consume messages
//     channel.consume(queueName, async (msg) => {
//       if (!msg) return;
//       console.log("📨 Raw message:", msg.content.toString());
//       try {
//         const { to, subject, body } = JSON.parse(
//           msg.content.toString()
//         );
//         // 4. Create mail transporter
//         const transporter = nodemailer.createTransport({
//           host: "smtp.gmail.com",
//           port: 465,
//           secure: true,
//           auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASSWORD,
//           },
//         });
//         // 5. Send email
//         await transporter.sendMail({
//           from: `"Chat App" <${process.env.EMAIL_USER}>`,
//           to,
//           subject,
//           text: body,
//         });
//         console.log(`✅ OTP email sent to ${to}`);
//         // 6. Acknowledge message
//         channel.ack(msg);
//       } catch (error) {
//         console.error("❌ Failed to process OTP message:", error);
//         channel.nack(msg, false, false); // discard message
//       }
//     });
//   } catch (error) {
//     console.error("❌ OTP consumer failed to start:", error);
//     process.exit(1);
//   }
// };
//# sourceMappingURL=consumer.js.map