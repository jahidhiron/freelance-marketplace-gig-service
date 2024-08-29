import { config } from '@gig/config';
import { winstonLogger } from '@jahidhiron/jobber-shared';
import client, { Channel, Connection } from 'amqplib';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigQueueConnection', 'debug');

export async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel = await connection.createChannel();

    log.info('Gig server connected to queue successfully...');
    closeConnection(channel, connection);

    return channel;
  } catch (error) {
    log.log('error', 'GigService createConnection() method error:', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}
