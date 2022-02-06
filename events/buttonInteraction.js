const Event = require('../structures/Event');

module.exports = class extends Event {


    async run(interaction) {
        if(interaction.message.author.id !== this.client.user.id) return;

        await interaction.guild.roles.fetch();

        await interaction.member.fetch();

        let disallowedRoles = [];

        for await (const disallowedRole of disallowedRoles) {


            if(interaction.member.roles.cache.has(disallowedRole)) {
                if(interaction.member.roles.cache.has(interaction.customId)) interaction.member.roles.remove(interaction.customId);

                await interaction.reply({content: `<@${interaction.member.id}>\nDu darfst diesen Channel nicht sehen!`, ephemeral: true})

                return;
            }
        }

        if(interaction.member.roles.cache.has(interaction.customId)) {
            interaction.member.roles.remove(interaction.customId);
        } else {
            interaction.member.roles.add(interaction.customId);
        }

        await interaction.deferUpdate();


    }
}