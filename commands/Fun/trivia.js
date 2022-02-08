
const Command = require('../../structures/Command');
const {MessageActionRow, MessageSelectMenu} = require("discord.js");


module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['quiz', 'frage'],
            description: 'Kleine Implementierung eines Quizspieles',
            category: 'Fun',
            guildOnly: true,
            userPerms: [],
            cooldown: 30
        });
    }

    async run(context, args, isInteraction) {
        context.delete();
        const categories = [{"value":"9","label":"General Knowledge"},{"value":"10","label":"Entertainment: Books"},{"value":"11","label":"Entertainment: Film"},{"value":"12","label":"Entertainment: Music"},{"value":"13","label":"Entertainment: Musicals & Theatres"},{"value":"14","label":"Entertainment: Television"},{"value":"15","label":"Entertainment: Vvalueeo Games"},{"value":"16","label":"Entertainment: Board Games"},{"value":"17","label":"Science & Nature"},{"value":"18","label":"Science: Computers"},{"value":"19","label":"Science: Mathematics"},{"value":"20","label":"Mythology"},{"value":"21","label":"Sports"},{"value":"22","label":"Geography"},{"value":"23","label":"History"},{"value":"24","label":"Politics"},{"value":"25","label":"Art"},{"value":"26","label":"Celebrities"},{"value":"27","label":"Animals"},{"value":"28","label":"Vehicles"},{"value":"29","label":"Entertainment: Comics"},{"value":"30","label":"Science: Gadgets"},{"value":"31","label":"Entertainment: Japanese Anime & Manga"},{"value":"32","label":"Entertainment: Cartoon & Animations"}]


        const firstResponse = await context.channel.send({content: `Welcome to Trivia!`, components: [(new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('triviaCategoryselect')
                        .setPlaceholder(` Please choose your desired category:`)
                        .addOptions(categories)
                ))]});


    }

}