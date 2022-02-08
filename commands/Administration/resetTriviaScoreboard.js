const Command = require("../../structures/Command");

const {Collection, MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');

module.exports = class extends Command {


    constructor(...args) {
        super(...args, {
            aliases: ["resetTrivia"],
            category: 'Administration',
            userPerms: ['ADMINISTRATOR']
        });
    }


    async run(context, args, isInteraction) {

        this.client.triviaManager.scores = new Collection();

    }
}
