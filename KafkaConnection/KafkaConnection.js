const { Kafka, logLevel } = require('kafkajs');
const fs = require('fs');

// Ensure that the CA certificate path is correct
const caCert = fs.readFileSync('./KafkaConnection/ca.pem', 'utf-8');

const kafka = new Kafka({
  clientId: 'MusicAppNew',
  brokers: ['kafka-3ec5bc2c-testtust21-e578.g.aivencloud.com:11872'],
  ssl: {
    ca: [caCert], 
  },
  sasl: {
    mechanism: 'SCRAM-SHA-512', // Check if Aiven requires SCRAM-SHA-512 instead
    username: 'avnadmin',
    password: "AVNS_9U_F_D6RfJyeUKHzReC", // Your Aiven credentials
  },
  logLevel: logLevel.ERROR,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'kafka_music' });
const messageconsumer = kafka.consumer({groupId:'Message_consumer'})

// Connect the producer to Kafka
const connection = async () => {
  try {
    await producer.connect();
    console.log('Producer Connected to Kafka');

    
  } catch (error) {
    console.error('Error connecting producer:', error);
  }
};

module.exports = { producer, consumer, connection, kafka,messageconsumer };
