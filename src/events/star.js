import { MessageEmbed } from 'discord.js';
import { Colours } from '../constants.js';

const cache = [];

export default ({ body }, _, webhook) => {
   const repo = body.repository;
   const sender = body.sender;

   // Ignore if the same event is repeated in between now to 30 seconds (anti-spam)
   const limited = cache.find(u => u.login === sender.login && u.action === body.action);
   if (limited) {
      if ((Date.now() - limited.time) <= 30000) return;

      const idx = cache.indexOf(limited);
      cache.splice(idx, 1);
   }

   cache.push({
      action: body.action,
      login: sender.login,
      time: Date.now()
   });

   const embed = new MessageEmbed()
      .setColor(Colours.BRAND)
      .setTitle(`${repo.full_name} - Star ${body.action === 'deleted' ? 'Removed' : 'Added'}`)
      .setURL(repo.html_url)
      .setAuthor({
         name: sender.login,
         iconURL: sender.avatar_url,
         url: sender.html_url
      });

   return webhook.send({ embeds: [embed] });
};