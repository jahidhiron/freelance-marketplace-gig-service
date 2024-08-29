import { Client } from '@elastic/elasticsearch';
import { config } from '@gig/config';
import { ISellerGig, winstonLogger } from '@jahidhiron/jobber-shared';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigElasticSearchServer', 'debug');

export const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

export const checkConnection = async (): Promise<void> => {
  let isConnected = false;

  while (!isConnected) {
    try {
      const health = await elasticSearchClient.cluster.health({});
      log.info(`GigService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'GigService checkConnection() method:', error);
    }
  }
};

export async function checkIfIndexExist(indexName: string): Promise<boolean> {
  const result = await elasticSearchClient.indices.exists({ index: indexName });
  return result;
}

export async function createIndex(indexName: string): Promise<void> {
  try {
    const result = await checkIfIndexExist(indexName);

    if (result) {
      log.info(`Index "${indexName}" already exist.`);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });
      log.info(`Created index ${indexName}`);
    }
  } catch (error) {
    log.error(`An error occurred while creating the index ${indexName}`);
    log.log('error', 'GigService createIndex() method error:', error);
  }
}

export const getDocumentCount = async (index: string): Promise<number> => {
  try {
    const result = await elasticSearchClient.count({ index });

    return result.count;
  } catch (error) {
    log.log('error', 'GigService elasticsearch getDocumentCount() method error:', error);
    return 0;
  }
};

export const getIndexedData = async (index: string, itemId: string): Promise<ISellerGig> => {
  try {
    const result = await elasticSearchClient.get({ index, id: itemId });

    return result._source as ISellerGig;
  } catch (error) {
    log.log('error', 'GigService elasticsearch getIndexedData() method error:', error);
    return {} as ISellerGig;
  }
};

export const addDataToIndex = async (index: string, itemId: string, gigDocument: unknown): Promise<void> => {
  try {
    await elasticSearchClient.index({
      index,
      id: itemId,
      document: gigDocument
    });
  } catch (error) {
    log.log('error', 'GigService elasticsearch addDataToIndex() method error:', error);
  }
};

export const updateIndexedData = async (index: string, itemId: string, gigDocument: unknown): Promise<void> => {
  try {
    await elasticSearchClient.update({
      index,
      id: itemId,
      doc: gigDocument
    });
  } catch (error) {
    log.log('error', 'GigService elasticsearch updateIndexedData() method error:', error);
  }
};

export const deleteIndexedData = async (index: string, itemId: string): Promise<void> => {
  try {
    await elasticSearchClient.delete({
      index,
      id: itemId
    });
  } catch (error) {
    log.log('error', 'GigService elasticsearch deleteIndexedData() method error:', error);
  }
};
