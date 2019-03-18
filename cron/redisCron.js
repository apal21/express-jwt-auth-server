import Cron from 'cron';
import client from '../models/redisClient';

require('dotenv').config();

const { CronJob } = Cron;

// eslint-disable-next-line no-new
new CronJob(process.env.CRON_REDIS, () => {
  client.keys('*', (err, keys) => {
    for (let i = 0; i < keys.length; i += 1) {
      client.hgetall(keys[i], (error, response) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log(err);
          return;
        }
        // eslint-disable-next-line array-callback-return
        Object.keys(response).map(key => {
          if (key.includes('exp-')) {
            if (Number(response[key]) < Math.floor(Date.now() / 1000)) {
              client.hdel(keys[i], [key.split('exp-')[1], key], e => {
                if (e) {
                  // eslint-disable-next-line no-console
                  console.log(e);
                }
              });
            }
          }
        });
      });
    }
  });
}, null, true);
