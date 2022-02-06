const Command = require("../../structures/Command");

const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');

module.exports = class extends Command {


    constructor(...args) {
        super(...args, {
            aliases: ["button"],
            description: 'Erstellt eine Nachricht mit einem bestimmten Select Menu',
            category: 'Administration',
            userPerms: ['ADMINISTRATOR'],
            guildOnly: true,
            cooldown: 60
        });
    }


    async run(context, args, isInteraction) {

            let topic = "-";
            let description = "-";
            let embedColor = `RANDOM`
            let options = [];

            let kat = isInteraction ? args._hoistedOptions[0].value :  args[0]

            switch (kat) {
                case "News": {
                    topic = 'News';
                    description = `Du wirst über News und wichtige Updates informiert!`;
                    embedColor = `#D8AC6B`;

                    options = [{
                        label: this.client.utils.capitalise(topic.toLowerCase()),
                        emoji: `🗞️`,
                        style: `primary`,
                        customId: `861275783263027230`
                    }]
                }
                break;
                case "Abstimmer": {
                    topic = 'Abstimmer';
                    description = `Du wirst gepingt, wenn eine Abstimmung für Neulinge gestartet ist`;
                    embedColor = `#C5A12C`;

                    options = [{
                        label: this.client.utils.capitalise(topic.toLowerCase()),
                        emoji: `🗳`,
                        style: `primary`,
                        customId: `861275957507391548`
                    }]
                }
                break;
                case "Neuankömmlinge": {
                    topic = 'Neuankömmlinge';
                    description = `Du wirst benachrichtigen, wenn sich jemand auf den Server verirrt hat`;
                    embedColor = `#BE710C`;

                    options = [{
                        label: this.client.utils.capitalise(topic.toLowerCase()),
                        emoji: `❤️‍🔥`,
                        style: `primary`,
                        customId: `861276026343260162`
                    }]
                }
                    break;
                case "Nsfw": {
                    topic = 'Nsfw';
                    description = `Du bekommst Zugriff auf den NSFW Kanal (18+)`;
                    embedColor = `#992E22`;

                    options = [{
                        label: this.client.utils.capitalise(topic.toLowerCase()),
                        emoji: `❤️‍🔥`,
                        style: `primary`,
                        customId: `861275744038551563`
                    }]
                }
                    break;
                case "Standard_Farbe": {
                    topic = 'Standard Farbe';
                    description = `Verhindert dass sich mit Leveln deine Rollenfarbe ändert. Du bleibst auf ewig Standard.`;
                    embedColor = `#E3B900`;

                    options = [{
                        label: this.client.utils.capitalise(topic.toLowerCase()),
                        emoji: `🥴`,
                        style: `primary`,
                        customId: `865136835138945025`
                    }]
                }
                    break;
                case "Random-Events": {
                    topic = 'Random-Events';
                    description = `Wenn du für zufällige Events wie Filme- oder Spielabende gepingt werden willst`;
                    embedColor = `#E28F7F`;

                    options = [{
                        label: this.client.utils.capitalise(topic.toLowerCase()),
                        emoji: `<a:HeadNod:903965031329304626>`,
                        style: `primary`,
                        customId: `867813046285500437`
                    }]
                }
                    break;
                case "Remind-ME": {
                    topic = 'Remind ME';
                    description = `Mit dieser Rolle wirst du ans Bumpen erinnert`;
                    embedColor = `#85DF64`;

                    options = [{
                        label: this.client.utils.capitalise(topic.toLowerCase()),
                        emoji: `📈`,
                        style: `primary`,
                        customId: `875089818286186556`
                    }]
                }
                    break;
                case "Kummerkasten": {
                    topic = 'Kummerkasten';
                    description = `Hier bekommst du Zugriff zu unserem Kummerkasten`;
                    embedColor = `#ed9f8d`;

                    options = [{
                        label: this.client.utils.capitalise(topic.toLowerCase()),
                        emoji: `<:blushcry:874426788623839373>`,
                        style: `primary`,
                        customId: `883725945465360384`
                    }]
                }
                    break;
                case "gatcha": {
                    topic = 'Mudae';
                    description = `Hier bekommst du Zugriff zu den Gatcha Channels!`;
                    embedColor = `#edda8d`;

                    options = [{
                        label: this.client.utils.capitalise(topic.toLowerCase()),
                        emoji: `<:woaahhh:862091127950409748>`,
                        style: `primary`,
                        customId: `884509599619768330`
                    }]
                }
                    break;
                case "vcping": {
                    topic = 'VoiceChat-Ping';
                    description = `Hiermit wirst du gepingt, wenn nach leuten im Voicechat gerufen wird`;
                    embedColor = `#ed9f8d`;

                    options = [{
                        label: this.client.utils.capitalise(topic.toLowerCase()),
                        emoji: `🎤`,
                        style: `primary`,
                        customId: `935916639998836766`
                    }]
                }
                    break;
            }



            let buttons = [];

            for await (const option of options) {
                buttons.push(new MessageButton()
                    .setLabel(option.label)
                    .setEmoji(option.emoji)
                    .setCustomId(option.customId)
                    .setStyle(option.style.toUpperCase()))
            }


            const MessageEmbed1 = new MessageEmbed()
                .setTitle(topic)
                .setDescription(description)
                .setColor(embedColor)


            let row = new MessageActionRow()
                .setComponents(buttons);


            if (!isInteraction) {
                await context.channel.send({embeds: [MessageEmbed1], components: [row]});
            } else {
                await context.channel.send({embeds: [MessageEmbed1], components: [row]});

                if (context.deferred || context.replied) {
                    //await context.deleteReply();
                }

                await context.reply({content: 'Embed Erstellt', fetchReply: true, ephemeral: true})
                    .catch(console.error);
            }

    }



}