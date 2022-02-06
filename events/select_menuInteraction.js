const Event = require('../structures/Event');

module.exports = class extends Event {


    async run(interaction) {


        if(interaction.message.author.id !== this.client.user.id) return;

        await interaction.guild.roles.fetch();

        let toRemove = [];
        let toAdd = [];

        let guildMember = await interaction.member?.fetch();


        interaction.component.options.forEach(option => {
            if (interaction.values.find(x => x === option.value)) {
                if (!guildMember.roles.cache.has(option.value)) toAdd.push(option.value);
            } else {
                if (guildMember.roles.cache.has(option.value)) toRemove.push(option.value);
            }
        });

        guildMember = await guildMember.roles.add(toAdd);
        await guildMember.roles.remove(toRemove);

        await interaction.deferUpdate();


    }

}