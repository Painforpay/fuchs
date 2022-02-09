const {Collection, MessageEmbed, MessageActionRow, MessageSelectMenu} = require("discord.js");
const fetch = require('node-fetch');

module.exports = class Trivia {

    constructor(client) {
        this.client = client;
        this.activeGames = new Collection();

        this.scores = new Collection();
    }


    async startNewGame(interaction) {
        const gameChannel = interaction.channel;
        const starter = interaction.member;
        const category = interaction.values[0];

        const requestURL = `https://opentdb.com/api.php?amount=1${category === 'ANY' ? "" : '&category='+category}&type=multiple&encode=base64`

        // Get GameData //

        const gameData = await fetch(requestURL).then(res => res.json().then(body => {return body;})).catch(() => null);
        if(!gameData) return;
        const question = this.decodeBase64(gameData.results[0].question)

        const triviaEmbed = new MessageEmbed()
            .setTitle(`Category: ${this.decodeBase64(gameData.results[0].category)}`)
            .setDescription(question)
            .setFooter({text: `Difficulty ${this.decodeBase64(gameData.results[0].difficulty)} | Started by ${starter.user.tag}`})

        //triviaEmbed.addField('Correct:', this.decodeBase64(gameData.results[0].correct_answer) + " " + gameData.results[0].correct_answer);

        const gameHash = 'TRIVIA-'+Date.parse(new Date().toString());

        let possibleEntries = [];


        const correctType = gameData.results[0].correct_answer;

        possibleEntries.push({label: this.decodeBase64(correctType), value: correctType});

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
                )]}).catch(() => null )

        if(gameMessage) {
            this.activeGames.set(gameHash, {
                gameHash: gameHash,
                question: question,
                correct: correctType,
                playersGuessed: [],
                startTime: Date.parse(new Date().toString()),
                gameMessage: gameMessage
            });

            interaction.message.delete().catch(() => null);

            // Trivia Counter
            setTimeout(() => {
                if(this.client.triviaManager.activeGames.has(gameHash)) {

                    const guessers = this.client.triviaManager.activeGames.get(gameHash).playersGuessed;
                    gameMessage.edit({content: `Nobody could guess the correct Answer in 60 Seconds!\nThe Question was: **${question}**\nThe Answer was: **${this.decodeBase64(correctType)}**${guessers.length > 0 ? '\n<@' + guessers.join('> <@') + '>' : ''}`, embeds: [], components: []})
                }
            }, 61000)
        }


    }

    async checkAnswer(interaction) {

        const activeGame = this.activeGames.get(interaction.customId)

        if(interaction.values[0] === activeGame.correct) {
            const time = (Date.parse(new Date().toString()) - activeGame.startTime) / 1000;
            const winner = interaction.member;

            interaction.update({
                content: `${winner} has guessed the correct answer in ${time} Seconds! Congratulations!\nThe Question was: **${activeGame.question}**\nThe Answer was: **${this.decodeBase64(activeGame.correct)}**`,
                components: [],
                embeds: []
            });

            if(this.scores.has(interaction.member.user.id)) {

                this.scores.set(interaction.member.user.id, {score: (this.scores.get(interaction.member.user.id).score + 1), user: interaction.member.user})

            } else {

                this.scores.set(interaction.member.user.id, {score: 1, user: interaction.member.user})

            }

            this.activeGames.delete(activeGame.gameHash);
        } else {
            await interaction.deferUpdate();
        }

    }


    decodeBase64(string) {
        return Buffer.from(string, 'Base64').toString('utf8');
    }


}