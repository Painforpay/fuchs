const { Client, Collection, Permissions } = require('discord.js');
const Util = require('./Utils');
const PVoices = require('./PVoices');
const Trivia = require('../managers/Trivia');


module.exports = class DiscordBot extends Client {

    constructor(options = {}) {
        super({
            disableMentions: 'everyone',
            partials: ["REACTION", "MESSAGE"],
            intents: ['GUILDS', 'GUILD_MEMBERS','GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS', 'GUILD_INVITES', 'GUILD_VOICE_STATES']
        });

        this.validate(options);

        this.pVoices = new PVoices(this);

        this.guild;

        this.triviaManager = new Trivia(this);

        this.constants = require('./Constants');

        this.aliases = new Collection();

        this.commands = new Collection();

        this.events = new Collection();

        this.subCommands = new Collection();

        this.utils = new Util(this);

        this.owners = options.owners;

        this.dev = options.dev;

        this.invites = new Collection();

        this.voteDelay = 12;

        this.timeoutRunning = false;

        this.disabledCommands = [];
    }

    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');


        this.token = options.token ? options.token : process.env.CLIENT_TOKEN;

        if (!options.defaultPrefix) throw new Error('You must pass a prefix for the client.');
        if (typeof options.defaultPrefix !== 'string') throw new TypeError('Prefix should be a type of String.');
        this.prefix = options.defaultPrefix;

        if (!options.defaultPerms) throw new Error('You must pass default perm(s) for the Client.');
        this.defaultPerms = new Permissions(options.defaultPerms).freeze();
    }

    async start(token = this.token) {

        this.owners = await this.utils.getOwners(this.owners);
        await this.utils.loadCommands();
        await this.utils.loadEvents();
        await super.login(token);

    }


}