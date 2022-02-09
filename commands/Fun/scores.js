
const Command = require('../../structures/Command');
const {MessageActionRow, MessageSelectMenu, MessageEmbed} = require("discord.js");


module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['triviaTop'],
            description: 'Kleine Implementierung eines Quizspieles',
            category: 'Fun',
            guildOnly: true,
            userPerms: [],
            cooldown: 30
        });
    }

    async run(context, args, isInteraction) {

        const scores = this.client.triviaManager.scores.map(x => x);

        let description = `Die Punkte sind wie folgt verteilt:`;
        let total = 0;
        for await (const index of scores) {
            description += `${index.user}: ${index.score}\n`
            total += index.score;
        }

        const embed = new MessageEmbed()
            .setTitle(`Trivia`)
            .setDescription(description)
            .setFooter(`${total} Punkte insgesamt verteilt auf ${scores.length} Spieler`)
            .setTimestamp()

        context.channel.send({embeds: [embed]})

    }

}