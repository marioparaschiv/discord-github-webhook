export function codeblock(lang, ...text) {
   if (lang === 'mini') {
      return `\`${text.join('')}\``;
   }

   return [
      `\`\`\`${lang}`,
      text.join(''),
      `\`\`\``
   ].join('\n');
}