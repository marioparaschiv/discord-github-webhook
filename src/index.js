import dotenv from 'dotenv';
dotenv.config();

import * as Events from './events/index.js';
import { WebhookClient } from 'discord.js';
import bodyParser from 'body-parser';
import { writeFileSync } from 'fs';
import express from 'express';

const { WEBHOOK, BLACKLISTED } = process.env;
const blacklisted = JSON.parse(BLACKLISTED);

const app = express();
const webhook = new WebhookClient({ url: WEBHOOK });

app.use(bodyParser.json());

app.post('/', function (req, res) {
   try {
      const { body } = req;
      const repo = body.repository;

      if (~blacklisted.indexOf(repo?.name)) {
         return res.end();
      }

      writeFileSync(`./logs/${Date.now()}.txt`, JSON.stringify(req.body, null, 3));

      const payload = [req, res, webhook];

      // Event handlers
      if (body.commits) { /* Commits */
         Events.Commit.apply(this, payload);
      } else if (body.action === 'opened' && body.issue) { /* Issues */
         Events.Issue.apply(this, payload);
      } else if (body.forkee) { /* Forks */
         Events.Fork.apply(this, payload);
      } else if (body.starred_at !== undefined) { /* Stars */
         Events.Star.apply(this, payload);
      }
   } catch (e) {
      console.error('Failed to parse payload', e.message);
   }

   res.end();
});

const listener = app.listen(process.env.PORT || 3000, () => {
   console.log(`Listening on port ${listener.address().port}.`);
});
