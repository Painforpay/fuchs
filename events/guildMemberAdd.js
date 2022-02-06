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
                .setAuthor({name: member.user.tag})
                .setThumbnail(member.user.avatarURL({ dynamic: true }))
                .addFields({
                        value: `────✧❁✧────\nIch hoffe dir gefällt der Aufenthalt auf unserem Server. Bitte lies dir die <#${this.client.constants.channels.rules}> und gebe dir anschließend <#${this.client.constants.channels.roles}>.\nHier wirst du nicht in Vergessenheit geraten!\n────✧❁✧────`,
                        name: "⤷strawhats⤶",
                        inline: true
                    }
                ).setImage("https://media.discordapp.net/attachments/897206631140569198/939709423360802856/dbb9nym-e61caf35-aaa1-4968-b233-029e35976dbd.gif?width=1025&height=354")
                this.client.guild.channels.fetch(this.client.constants.channels.generalChat).then(channel => channel.send({embeds: [embed]}))
        }


    }
}
