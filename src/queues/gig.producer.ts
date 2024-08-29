import { config } from '@gig/config';
import { winstonLogger } from '@jahidhiron/jobber-shared';
import { Channel } from 'amqplib';
import { createConnection } from '@gig/queues/connection';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigServiceProducer', 'debug');

export const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'GigService publishDirectMessage() method error:', error);
  }
};
