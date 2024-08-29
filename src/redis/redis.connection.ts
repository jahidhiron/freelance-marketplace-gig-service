import { config } from '@gig/config';
import { winstonLogger } from '@jahidhiron/jobber-shared';
import { createClient } from 'redis';

type RedisClient = ReturnType<typeof createClient>;
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigRedisConnection', 'debug');
export const client: RedisClient = createClient({ url: `${config.REDIS_HOST}` });

export const redisConnect = async (): Promise<void> => {
  try {
    await client.connect();
    log.info(`GigService Redis Connection: ${await client.ping()}`);
    cacheError();
  } catch (error) {
    log.log('error', 'GigService redisConnect() method error:', error);
  }
};

const cacheError = (): void => {
  client.on('error', (error: unknown) => {
    log.error(error);
  });
};
