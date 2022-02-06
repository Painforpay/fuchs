const Event = require('../structures/Event');
const colors = require('colors/safe');


module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            once: true
        });
    }

    async run() {


        console.log([
            `Bot ${this.client.user.username} is Ready!`,
            `${this.client.guilds.cache.filter(g => g.available).size} Guilds available.`
        ].join('\n'))

        this.client.user.setActivity(`v${this.client.constants.clientVersion}`, {type: "PLAYING"})


        this.client.guild = await this.client.guilds.fetch(this.client.constants.guildID);
        this.client.invites = await this.client.guild.invites.fetch();


        ///////////////////////// Anti Spam /////////////////////////
        /*
        setInterval(() => {
            this.client.spammer.forEach((v, k) => {

                let newMessageCount = v.count - 1 <= 0 ? 0 : v.count - 1;

                this.client.spammer.set(k, {count: newMessageCount, muted: v.muted});
            })

        }, 1000)
       //*/
       ///////////////////////// Anti Spam /////////////////////////



        /*
                await guild.commands.set([]);
        //*/

        /*
                       guild.commands.create({
                            name: 'createselectmenu',
                            description: 'Testbefehl',
                            options: [
                                {
                                    name: 'menutyp',
                                    description: 'Wähle hier, was für eine Rollenverteilung erstellt werden soll',
                                    required: true,
                                    type: 'STRING',
                                    channelTypes: ['GUILD_TEXT'],
                                    choices: [
                                        {
                                            name: 'Geschlecht',
                                            value: 'gender'
                                        },
                                        {
                                            name: 'Alter',
                                            value: 'age'
                                        },
                                        {
                                            name: 'Herkunft (Land/Bundesland)',
                                            value: 'location'
                                        }
                                    ]
                                }

                            ]
                        }).then(console.log).catch(console.error);

                 guild.commands.create({
                    name: 'createbutton',
                    description: 'Befehl zum Erstellen von Buttons',
                    options: [
                        {
                            name: 'menutyp',
                            description: 'Wähle hier, was für ein Button erstellt werden soll',
                            required: true,
                            type: 'STRING',
                            channelTypes: ['GUILD_TEXT'],
                            choices: [
                                {
                                    name: 'News',
                                    value: 'News'
                                },
                                {
                                    name: 'Abstimmer',
                                    value: 'Abstimmer'
                                },
                                {
                                    name: 'Neuankömmlinge',
                                    value: 'Neuankömmlinge'
                                },
                                {
                                    name: 'Nsfw',
                                    value: 'Nsfw'
                                },
                                {
                                    name: 'Standard Farbe',
                                    value: 'Standard_Farbe'
                                },
                                {
                                    name: 'Random Events',
                                    value: 'Random-Events'
                                },
                                {
                                    name: 'Remind ME',
                                    value: 'Remind-ME'
                                },
                                {
                                    name: 'Kummerkasten',
                                    value: 'Kummerkasten'
                                },
                                {
                                    name: 'Gatcha',
                                    value: 'gatcha'
                                },
                                {
                                    name: 'vcping',
                                    value: 'vcping'
                                },

                            ]
                        }

                    ]
                }).then(console.log).catch(console.error);

                //*/


    }
}