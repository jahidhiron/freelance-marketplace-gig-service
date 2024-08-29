import { databaseConnection } from '@gig/database';
import { config } from '@gig/config';
import express from 'express';
import { start } from '@gig/server';
import { redisConnect } from '@gig/redis/redis.connection';

const initilize = (): void => {
  config.cloudinaryConfig();
  databaseConnection();
  const app = express();
  start(app);
  redisConnect();
};

initilize();
