import Config from '../../config.json' assert { type: 'json' };
import { MessageEmbed } from 'discord.js';
import { codeblock } from '../util.js';

export default ({ body }, _, webhook) => {
   const { sender, commits, repository } = body;
   const count = commits.length;

   if (count === 0) {
      const embed = new MessageEmbed()
         .setTitle(`${repository.full_name} - Force pushed`)
         .setURL(body.compare)
         .setColor(Colour)
         .setAuthor({
            name: sender.login,
            iconURL: sender.avatar_url,
            url: sender.html_url
         });

      return webhook.send({ embeds: [embed] });
   }

   const embed = new MessageEmbed()
      .setTitle(`${repository.full_name} - ${count} new commit${count > 1 ? 's' : ''}`)
      .setURL(body.compare)
      .setColor(Config.Colour)
      .setDescription(commits.map(parseCommit).join('\n'))
      .setAuthor({
         name: sender.login,
         iconURL: sender.avatar_url,
         url: sender.html_url
      });

   webhook.send({ embeds: [embed] });
};

function parseCommit(commit) {
   const { author, url, message } = commit;

   const messages = message.split('\n').filter(Boolean) ?? [];
   const [short, ...long] = messages;
   const id = commit.id.slice(0, 7);

   return [
      `[${codeblock('mini', id)}](${url}) ${short} - ${author.username}`,
      long?.length && codeblock('md', ...long)
   ].filter(Boolean).join('\n').trim();
}