const Event = require('../structures/Event');

module.exports = class extends Event {


    async run(interaction) {

        if (interaction.customId == "roleSelect") {

            if (interaction.message.author.id !== this.client.user.id) return;

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
        } else if (interaction.customId === "triviaCategoryselect") {
            const category = interaction.component.options.find(x => x.value === interaction.values[0]);

            interaction.update({
                content: `The following category was selected: ${category.label}`,
                components: []
            });

            await this.client.triviaManager.startNewGame(interaction);

        } else if (interaction.customId.startsWith('TRIVIA-')) {
            const game = await this.client.triviaManager.activeGames.get(interaction.customId)
            if(game) {
                if (game.playersGuessed.includes(interaction.member.id)) {
                    await interaction.deferUpdate();
                    return
                } else {
                    game.playersGuessed.push(interaction.member.id);
                    await this.client.triviaManager.checkAnswer(interaction)
                }

            }


        }

    }

}