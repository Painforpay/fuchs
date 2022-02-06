const Event = require('../structures/Event');
const {MessageEmbed} = require('discord.js');

module.exports = class extends Event {

    async run(oldState, newState) {


        if (newState.channel && !oldState.channel) {
            //User Joined a Channel

            if (newState.channel.id === this.client.constants.channels.VCHub) await this.client.pVoices.createPVoice(newState, this.client.maxChanSize)



        } else if (!newState.channel && oldState.channel) {
            //User left a Channel

            if (oldState.channel.members.size < 1) await this.client.pVoices.deletePVoice(oldState.channel);


        } else if (newState.channel && oldState.channel) {
            if (oldState.channel.members.size < 1) await this.client.pVoices.deletePVoice(oldState.channel);
            if (newState.channel.id === this.client.constants.channels.VCHub) await this.client.pVoices.createPVoice(newState, this.client.maxChanSize)

        }


    }
}
