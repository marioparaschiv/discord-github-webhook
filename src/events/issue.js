import Config from '../../config.json' assert { type: 'json' };
import { MessageEmbed } from 'discord.js';

export default ({ body }, _, webhook) => {
   const { issue, repository } = body;
   const { user } = issue;

   const embed = new MessageEmbed()
      .setTitle(`${repository.full_name} - Issue Opened (#${issue.number})`)
      .setURL(issue.url)
      .setColor(Config.Colour)
      .addField('Title', issue.title)
      .addField('Description', issue.body.substring(0, 2024))
      .setAuthor({
         name: user.login,
         iconURL: user.avatar_url,
         url: user.html_url
      });

   return webhook.send({ embeds: [embed] });
};