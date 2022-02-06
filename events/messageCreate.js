const Event = require('../structures/Event');
const colors = require('colors/safe');
const {MessageActionRow, MessageEmbed, MessageSelectMenu} = require('discord.js');

module.exports = class extends Event {


    async run(message) {

        //As we Enabled Message partials, we have to try to fetch them.
        if (message.partial) {

            try {

                await message.fetch();

            } catch (error) {
                return console.error('Something went wrong when fetching the message: ', error);


            }
        }


        const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

        if (message.type !== "DEFAULT") return;
        if (message.system === true || message.channel.type === 'DM') return;
        if(message.author.id === "302050872383242240") {

            if(message.embeds) {
                if(message.embeds[0].description.includes(":thumbsup:")) {
                    message.channel.send(`Vielen Dank für deine Unterstützung! Ich werde in diesen Channel schreiben, sobald ein erneuter Bump verfügbar ist!`)
                    if(!this.client.timeoutRunning) {
                        this.client.timeoutRunning = true;
                        setTimeout(async () => {
                            message.channel.send(`${this.client.constants.pings.bumping.length > 0 ? `<@&${this.client.constants.pings.bumping}>\n` : ''}Serverbumping ist wieder verfügbar! Nutze \`!d bump\` um uns zu unterstützen!`)
                            this.client.timeoutRunning = false;
                        }, (2 * 60 * 60 * 1000))
                    }

                } else if (message.embeds[0].thumbnail.url === 'https://disboard.org/images/bot-command-image-thumbnail-error.png') {
                    const time = parseInt(message.embeds[0].description.split("\n")[0].substring(38).substring(0, 4).replace(/\D+/, ""));
                    const timeoutTime = time*60*1000
                    if(!this.client.timeoutRunning) {
                        message.channel.send(`Ich habe ${time} Minuten als Cooldown erkannt! Ich werde pingen, sobald der Bump wieder verfügbar ist!`);
                        this.client.timeoutRunning = true;
                        setTimeout(() => {
                            message.channel.send(`${this.client.constants.pings.bumping.length > 0 ? `<@&${this.client.constants.pings.bumping}>\n` : ''}Serverbumping ist wieder verfügbar! Nutze \`!d bump\` um uns zu unterstützen!`);
                            this.client.timeoutRunning = false;
                        }, timeoutTime)
                    }

                }

            }

        }
        if (message.author.bot) return;

        if (message.content.match(mentionRegex)) message.channel.send(`Mein prefix ist \`${this.client.prefix}\`.`);

        const prefix = message.content.match(mentionRegexPrefix) ?
            message.content.match(mentionRegexPrefix)[0] : this.client.prefix;


        if(!message.content.startsWith(prefix)) return;


        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
        if (command) {

            if (command.ownerOnly && !this.client.utils.checkOwner(message.author)) {

                //User is not allowed to use this command, we don't want to do anything as it is not needed

                return message.delete().catch(err => console.error(err.stack));
            }


            //Check if this command is guildOnly. This will never be true as the Bot skips DMs
            if (command.guildOnly && !message.guild) {

                //We cannot delete Messages in DMs other than ours so we skip deleting the message
                return message.channel.send('Entschuldige, aber dieser Befehl kann nicht im Privatchat ausgeführt werden.').then(m => m.delete({timeout: 60000}).catch(err => console.error(err.stack)));
            }

            // Check if the Command has a specified minimal Number of Args and then check if the message contains the right amount
            if (command.minArgs && args.length < command.minArgs) {
                message.delete().catch(err => console.error(err.stack));
                return message.channel.send(`Entschuldige, aber es werden mehr Argumente benötigt - Angegeben: ${args.length}, Benötigt: ${command.minArgs}\nNutzung: \`${this.client.prefix}${command.name} ${command.argsDef.join(" ")}\``).then(m => {
                    m.delete({timeout: 60000}).catch(err => console.error(err.stack));
                });

            }

            //Check if the Message was sent to a Guild - Always true
            if (message.guild) {


                const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;

                //Check if the Command needs special Permissions
                if (userPermCheck) {

                    //Check if the Member has missing Permissions
                    const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
                    if (missing.length) {
                        message.delete().catch(err => console.error(err.stack));
                        return message.channel.send(`Entschuldige, aber dir fehlt die folgende Berechtigung für diesen Befehl: \`${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))}\`.`).then(m => m.delete({timeout: 60000}).catch(err => console.error(err.stack)));

                    }
                }

                //Lastly - Check if Command was Disabled
                if (this.client.disabledCommands.find(element => element === command.name)) {
                    message.delete().catch(err => console.error(err.stack));
                    return message.channel.send(`Entschuldige, aber dieser Befehl ist gegenwärtig deaktiviert!`).then(m => m.delete({timeout: 60000}).catch(err => console.error(err.stack)));

                }


            }

            if (command.cooldown > 0 && command.cooldownPeople.has(message.author.id) && !message.member.permissions.has("ADMINISTRATOR")) {
                message.delete().catch(err => console.error(err.stack));

                const remainingTime = command.cooldownPeople.get(message.author.id);


                return message.channel.send(`Entschuldige, aber du hast noch einen Cooldown auf dem \`${command.name}\` Befehl! <t:${Math.trunc(remainingTime / 1000)}:R>!`).then(m => m.delete({timeout: 5000}).catch(err => console.error(err.stack)));


            }
            if (command.cooldown > 0) {
                command.cooldownPeople.set(message.author.id, Date.parse(new Date().toString())+command.cooldown);

                setTimeout(async () => {
                    command.cooldownPeople.delete(message.author.id);
                }, command.cooldown)

            }

            /*
            * Everything went fine:
            * Call the Command file and run the message
            */
            command.run(message, args, false);
        }
    }
}