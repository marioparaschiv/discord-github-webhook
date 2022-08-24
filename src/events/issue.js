import { MessageEmbed } from 'discord.js';
import { Colours } from '../constants.js';

export default ({ body }, _, webhook) => {
   const issue = body.issue;
   const repo = body.repository;
   const sender = issue.user;

   const embed = new MessageEmbed()
      .setTitle(`${repo.full_name} - Issue Opened: #${issue.number} ${issue.performed_via_github_app ? '(via mobile app)' : ''}`)
      .setURL(issue.url)
      .setColor(Colours.BRAND)
      .addField('Title', issue.title)
      .addField('Description', issue.body.substring(0, 2024))
      .setAuthor({
         name: sender.login,
         iconURL: sender.avatar_url,
         url: sender.html_url
      });

   return webhook.send({ embeds: [embed] });
};