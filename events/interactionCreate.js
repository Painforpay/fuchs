const Event = require('../structures/Event');
const colors = require('colors/safe');
const { MessageEmbed } = require('discord.js')


module.exports = class extends Event {


    async run(interaction) {

        if(interaction.type === 'MESSAGE_COMPONENT') {
            this.client.emit(`${interaction.componentType.toLowerCase()}Interaction`, interaction)
        } else if (interaction.type === 'APPLICATION_COMMAND') {
            this.client.emit(`CommandInteraction`, interaction);
        }


    }
}