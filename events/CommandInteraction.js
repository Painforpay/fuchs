const Event = require('../structures/Event');



module.exports = class extends Event {


    async run(interaction) {


        const cmd = interaction.commandName;

        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
        const args = interaction.options;

        if (command) {

            if (command.ownerOnly && !this.client.utils.checkOwner(interaction.member.user)) {

                //User is not allowed to use this command, we don't want to do anything as it is not needed

                return;
            }


            //Check if this command is guildOnly. This will never be true as the Bot skips DMs
            if (command.guildOnly && !interaction.guild) {

                //We cannot delete Messages in DMs other than ours so we skip deleting the message
                return interaction.reply({content: 'Entschuldige, aber dieser Befehl kann nicht im Privatchat ausgeführt werden.', ephemeral: true})
            }

            //Check if the Message was sent to a Guild - Always true
            if (interaction.guild) {


                const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;

                //Check if the Command needs special Permissions
                if (userPermCheck) {

                    //Check if the Member has missing Permissions
                    const missing = interaction.channel.permissionsFor(interaction.member).missing(userPermCheck);
                    if (missing.length) {

                        return interaction.reply({content: `Entschuldige, aber dir fehlen entsprechende Berechtigungen hierfür!`, ephemeral: true})

                    }
                }

                //Lastly - Check if Command was Disabled
                if (this.client.disabledCommands.find(element => element === command.name)) {

                    return interaction.reply({content: `Entschuldige, aber dieser Befehl ist gegenwärtig deaktiviert!`, ephemeral: true});

                }


            }

            if (command.cooldown > 0 && command.cooldownPeople.has(interaction.member.user.id) && !interaction.member.permissions.has("ADMINISTRATOR")) {


                const remainingTime = command.cooldownPeople.get(interaction.member.user.id);


                return interaction.reply({content: `Entschuldige, aber du hast noch einen Cooldown auf dem \`${command.name}\` Befehl! <t:${Math.trunc(remainingTime / 1000)}:R>!`, ephemeral: true})


            }
            if (command.cooldown > 0) {
                command.cooldownPeople.set(interaction.member.user.id, Date.parse(new Date().toString())+command.cooldown);

                setTimeout(async () => {
                    command.cooldownPeople.delete(interaction.member.user.id);
                }, command.cooldown)

            }

            /*
            * Everything went fine:
            * Call the Command file and run the message
            */
            command.run(interaction, args, true);
        }


    }
}