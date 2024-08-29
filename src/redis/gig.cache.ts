import { config } from '@gig/config';
import { winstonLogger } from '@jahidhiron/jobber-shared';
import { client } from '@gig/redis/redis.connection';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigCache', 'debug');

export const getUserSelectedGigCategory = async (key: string): Promise<string> => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }

    const response = (await client.GET(key)) as string;
    return response;
  } catch (error) {
    log.log('error', 'GigService GigCache getUserSelectedGigCategory() method error:', error);
    return '';
  }
};
