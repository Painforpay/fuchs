const {Collection} = require("discord.js");
module.exports = class PVoices {

    constructor(client) {
        this.client = client;
        this.channels = new Collection();
        this.maxChanSize = 0;
    }



    async createPVoice(newState, count) {
        if (this.channels.has(newState.member.user.id)) {
            try {

                let channel = await this.client.channels.fetch(this.channels.get(newState.member.user.id).channelid, true)
                await newState.setChannel(channel);
            } catch (e) {
                // Der Bot kann den User nicht moven
            }


        } else {

            let name = `${newState.member.nickname != null ? newState.member.nickname : newState.member.user.username}s Sprachkanal`;

            if (name.length > 32) {
                name = 'Neuer Privater Sprachkanal';
            }

            const hubChannel = await this.client.guild.channels.fetch(newState.channelId)


            let chan = await newState.channel.guild.channels.create(name, {
                type: "GUILD_VOICE",
                topic: newState.member.user.id,
                userLimit: count,
                parent: hubChannel.parentId,
                permissionOverwrites: [{id: newState.member.user.id, allow: ["MOVE_MEMBERS", "MANAGE_CHANNELS"]}]
            });

            await newState.setChannel(chan);


            this.channels.set(newState.member.user.id, {
                channelid: chan.id,
                userid: newState.member.user.id,
                timestamp: Date.parse(new Date().toString())
            })

            this.channels.set(chan.id, {
                channelid: chan.id,
                userid: newState.member.user.id,
                timestamp: Date.parse(new Date().toString())
            })


            // newState.member.send(`Dein Sprachkanal wurde erstellt und steht bereit!`).then(m => m.delete({timeout: 6000})).catch(() => null);

        }
    }

    async deletePVoice(channel) {
        if (this.channels.has(channel.id)) {
            let user = this.channels.get(channel.id).userid;
            this.channels.delete(user)
            this.channels.delete(channel.id)
            channel.delete().catch(() => null);
        }
    }
}
