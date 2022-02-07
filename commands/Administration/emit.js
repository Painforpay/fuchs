const Command = require("../../structures/Command");

const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');

module.exports = class extends Command {


    constructor(...args) {
        super(...args, {
            aliases: ["event"],
            category: 'Administration',
            userPerms: ['ADMINISTRATOR']
        });
    }


    async run(context, args, isInteraction) {

        this.client.emit(args[0], context.member)

    }
}
