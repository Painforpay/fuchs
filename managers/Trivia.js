const {Collection, MessageEmbed, MessageActionRow, MessageSelectMenu} = require("discord.js");
const fetch = require('node-fetch');

module.exports = class Trivia {

    constructor(client) {
        this.client = client;
        this.activeGames = new Collection();
    }


    async startNewGame(interaction) {
        const gameChannel = interaction.channel;
        const starter = interaction.member;
        const category = interaction.values[0];

        const requestURL = `https://opentdb.com/api.php?amount=1${category === 'ANY' ? "" : '&category='+category}&type=multiple&encode=base64`

        // Get GameData //

        const gameData = await fetch(requestURL).then(res => res.json().then(body => {return body;}));


        const triviaEmbed = new MessageEmbed()
            .setTitle(`Category: ${this.decodeBase64(gameData.results[0].category)}`)
            .setDescription(this.decodeBase64(gameData.results[0].question))
            .setFooter({text: `Difficulty ${this.decodeBase64(gameData.results[0].difficulty)} | Started by ${starter.user.tag}`})

        //triviaEmbed.addField('Correct:', this.decodeBase64(gameData.results[0].correct_answer) + " " + gameData.results[0].correct_answer);

        const gameHash = 'TRIVIA-'+starter.user.id + Date.parse(new Date().toString());

        let possibleEntries = [];


        const correctType = gameData.results[0].correct_answer;

        possibleEntries.push({label: this.decodeBase64(gameData.results[0].correct_answer), value: gameData.results[0].correct_answer});

        gameData.results[0].incorrect_answers.forEach(answer => {
            possibleEntries.push({label: this.decodeBase64(answer), value: answer});
        })

        possibleEntries = await this.client.utils.shuffleArray(possibleEntries);

        const gameMessage = await gameChannel.send({embeds: [triviaEmbed], components: [new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId(gameHash)
                        .setPlaceholder(`Choose the correct Answer`)
                        .addOptions(possibleEntries)
                )]})

        this.activeGames.set(gameHash, {
            gameHash: gameHash,
            correct: correctType,
            playersGuessed: [],
            startTime: Date.parse(new Date().toString()),
            gameMessage: gameMessage
        });

        interaction.message.delete();
    }

    async checkAnswer(interaction) {

        const activeGame = this.activeGames.get(interaction.customId)

        if(interaction.values[0] == activeGame.correct) {
            const time = (Date.parse(new Date().toString()) - activeGame.startTime) / 1000;
            const winner = interaction.member;

            interaction.update({
                content: `${winner} has guessed the correct answer in ${time} Seconds! Congratulations!\nThe Answer was: **${this.decodeBase64(activeGame.correct)}**`,
                components: [],
                embeds: []
            });

            this.activeGames.delete(activeGame.gameHash);
        } else {

            interaction.channel.send(`${interaction.member} guessed wrong!`)
            await interaction.deferUpdate();
        }

    }


    decodeBase64(string) {
        return Buffer.from(string, 'Base64').toString('utf8');
    }


}