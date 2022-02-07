const Command = require("../../structures/Command");

const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');

module.exports = class extends Command {


    constructor(...args) {
        super(...args, {
            aliases: ["selectMenu"],
            description: 'Erstellt eine Nachricht mit einem bestimmten Select Menu',
            category: 'Administration',
            userPerms: ['ADMINISTRATOR'],
            guildOnly: true,
            cooldown: 60
        });
    }


    async run(context, args, isInteraction) {
        let multiSelect = false;
        let topic_short = null;
        let topic;
        let options = [];
        let topictype;
        let plural = false;
        let embedColor = `RANDOM`


        let maxValues = 1;
        let kat = isInteraction ? args._hoistedOptions[0].value :  args[0]

        switch (kat) {
            case "gender": {
                topictype = "gender";
                topic_short = `Geschlecht ♂️ ♀️ 🧑`
                topic = "Geschlecht";
                embedColor = `#117C15`;
                options = [{
                    label: 'Männlich',

                    value: this.client.constants.roles.male,
                    emoji: `👨`
                },
                    {
                        label: 'Weiblich',

                        value: this.client.constants.roles.female,
                        emoji: `👩`
                    },
                    {
                        label: 'Divers',

                        value: this.client.constants.roles.otherGender,
                        emoji: `🧑`
                    }]
            }
                break;
            case "age": {
                topic_short = `Alter 🍰`
                topic = "Alter";
                topictype = "alter";
                embedColor = `#B38F05`;
                options = [{
                    label: '15-17',

                    value: this.client.constants.roles.fifteento17,
                    emoji: `🧒`
                },
                    {
                        label: '18-20',

                        value: this.client.constants.roles.eigthteento20,
                        emoji: `🧑`
                    },
                    {
                        label: '21+',

                        value: this.client.constants.roles.over21,
                        emoji: `👴`
                    }]
            }
                break;
            case "dms": {
                topic_short = `DMs 📫`
                topic = "DM Einstellungen";
                plural = true;
                topictype = "dms";
                embedColor = `#B38F05`;
                options = [{
                    label: 'DMs Offen',

                    value: this.client.constants.roles.dmYes,
                    emoji: `📬`
                },
                    {
                        label: 'DMs geschlossen',

                        value: this.client.constants.roles.dmNo,
                        emoji: `📪`
                    },
                    {
                        label: 'Ask to DM',

                        value: this.client.constants.roles.dmAsk,
                        emoji: `❓`
                    }]
            }
                break;
            case "games": {
                topic_short = `Spiele 🎮`
                topic = "Spiele";
                plural = true;
                topictype = "games";
                embedColor = `#B38F05`;
                options = [
                    {
                        label: 'League of Legends',
                        value: this.client.constants.roles.leagueoflegends,
                    },
                    {
                        label: 'Valorant',
                        value: this.client.constants.roles.valorant,
                    },
                    {
                        label: 'CSGO',
                        value: this.client.constants.roles.csgo,
                    },
                    {
                        label: 'Genshin Impact',
                        value: this.client.constants.roles.genshin,
                    },
                    {
                        label: 'Minecraft',
                        value: this.client.constants.roles.minecraft,
                    },
                    {
                        label: 'GTA 5',
                        value: this.client.constants.roles.gtav,
                    },
                ];
                maxValues = options.length;
            }
                break;
            case "location": {
                topic_short = 'Bundesland 🌍'
                topic = "Bundesland oder Land";
                topictype = "ort";
                embedColor = `#8F1F1F`;
                options = [{
                    label: 'Bayern',

                    value: '863498202928906280',
                },
                    {
                        label: 'Baden-Württemberg',

                        value: '863498274203631656',
                    },
                    {
                        label: 'Nordrhein-Westfallen',

                        value: '863498301752082453',
                    },{
                        label: 'Niedersachsen',

                        value: '863498497927151666',
                    },
                    {
                        label: 'Hessen',

                        value: '863498541083525142',
                    },{
                        label: 'Rheinlandpfalz',

                        value: '863498876727984148',
                    },{
                        label: 'Saarland',

                        value: '863499136032833546',
                    },{
                        label: 'Bremen',

                        value: '863499159470342176',
                    },{
                        label: 'Thüringen',

                        value: '863498929625628712',
                    },{
                        label: 'Berlin',

                        value: '863499206328975360',
                    },{
                        label: 'Hamburg',

                        value: '863499234840805427',
                    },{
                        label: 'Sachsen-Anhalt',

                        value: '863499374785069086',
                    },{
                        label: 'Brandenburg',

                        value: '863499299974021131',
                    },{
                        label: 'Sachsen',

                        value: '863498573965295656',
                    },{
                        label: 'Mecklenburg-Vorpommern',

                        value: '863499475415072778',
                    },{
                        label: 'Schleswig-Holstein',

                        value: '863498675014336532',
                    },{
                        label: 'Österreich',

                        value: '863498085844779018',
                    },{
                        label: 'Schweiz',

                        value: '863498045043638323',
                    },{
                        label: 'Luxemburg',

                        value: '901491269866508338',
                    },
                ]
            }
                break;
        }

        const MessageEmbed1 = new MessageEmbed()
            .setTitle(`Wähle dein${plural ? 'e' : ''} ${topic_short == null ? topic : topic_short}`)
            .setDescription(`Hier kannst du dein${plural ? 'e' : ''} ${topic} auswählen.${multiSelect ? ' Es sind mehrfach-auswahlen möglich.' : ''}`)
            .setColor(embedColor)


        let row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setMinValues(0)
                    .setMaxValues(maxValues)
                    .setCustomId(topictype)
                    .setPlaceholder(`Wähle dein${plural ? 'e' : ''} ${topic}`)
                    .addOptions(options)
            );


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