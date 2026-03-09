import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();
let channel: amqp.Channel;

export const connectRabbitMq = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
    });

    channel = await connection.createChannel();

    console.log("✅ Connected to RabbitMQ");
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ:", error);
  }
};

export const pulishTOQuese = async (queueName: string, message: unknown) => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`📤 Message published to queue: ${queueName}`);
};
