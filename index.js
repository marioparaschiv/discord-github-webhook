import { MessageEmbed, WebhookClient } from 'discord.js';
import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const { WEBHOOK, BLACKLISTED } = process.env;

const blacklisted = JSON.parse(BLACKLISTED);

const app = express();
const webhook = new WebhookClient({ url: WEBHOOK });

app.use(bodyParser.json());

app.post('/payload', ({ body }, res) => {
   try {
      const count = body.commits.length;
      const repo = body.repository;
      const commits = body.commits;

      if (~blacklisted.indexOf(repo.name)) return res.end();

      const embed = new MessageEmbed();
      embed.setTitle(`${repo.full_name} - ${count} new commit${count > 1 ? 's' : ''}`);
      embed.setDescription(commits.map(c => {
         const messages = c.message.split('\n\n');
         const [short, ...long] = messages ?? [];
         const id = c.id.slice(0, 7);
         const author = c.author;
         const url = c.url;

         return `
            [\`${id}\`](${url}) ${short} - ${author.username}
            ${long?.length ? [
               '```md',
               ...long,
               '```'
            ].join('\n') : ''}
         `.trim();
      }).join('\n'));

      embed.setURL(body.compare);
      embed.setColor('RED');

      const { sender } = body;
      embed.setAuthor({
         name: sender.login,
         iconURL: sender.avatar_url,
         url: sender.html_url
      });

      webhook.send({ embeds: [embed] });
   } catch (e) {
      console.error('Failed to post commit ||||', JSON.stringify(body));
   }

   res.end();
});

const listener = app.listen(process.env.PORT || 3000, () => {
   console.log(`Listening on port ${listener.address().port}.`);
});