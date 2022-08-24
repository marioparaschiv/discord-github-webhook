import Config from '../../config.json' assert { type: 'json' };
import { MessageEmbed } from 'discord.js';

export default ({ body }, _, webhook) => {
   const { forkee, sender, repository } = body;

   const embed = new MessageEmbed()
      .setTitle(`${repository.full_name} - Fork created: ${forkee.full_name}`)
      .setURL(forkee.html_url)
      .setColor(Config.Colour)
      .setAuthor({
         name: sender.login,
         iconURL: sender.avatar_url,
         url: sender.html_url
      });

   return webhook.send({ embeds: [embed] });
};