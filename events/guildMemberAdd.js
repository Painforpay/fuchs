const Event = require('../structures/Event');

const { MessageEmbed} = require ("discord.js");

module.exports = class extends Event {

    async run(member) {

        if (member.guild.available) {
            if(member.user.bot) return;
            if ((Date.parse(new Date().toString()) - member.user.createdTimestamp) < 604800000) {
                this.client.guild.channels.fetch(this.client.constants.channels.joinLog).then(channel => channel.send(`Achtung: Der Account von ${member} ist ziemlich jung. Erstellt am: <t:${Math.trunc(member.user.createdTimestamp / 1000)}:f>`));
            }

            const embed = new MessageEmbed().setTitle("Willkommen auf unseren Server!")
                .setColor("#2F3136")
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addField("⤷Rumknutschriff⤶", `──────────✧❁✧──────────\nIch hoffe dir gefällt der Aufenthalt auf unserem Server.\nBitte lies dir die <#${this.client.constants.channels.rules}> und gebe dir anschließend <#${this.client.constants.channels.roles}>.\nHier wirst du nicht in Vergessenheit geraten!\n──────────✧❁✧──────────`)
                .setImage("https://y.yarn.co/76c2e67b-8fbd-4ffd-bbff-245bd292424d_text.gif")
                this.client.guild.channels.fetch(this.client.constants.channels.generalChat).then(channel => channel.send({content: `<@${member.user.id}>` ,embeds: [embed]}))
        }
    }
}
