
const { Permissions, Collection } = require('discord.js');

module.exports = class Command {

    constructor(client, name, options = {}) {
        this.client = client;
        this.name = options.name || name;
        this.aliases = options.aliases || [];
        this.description = options.description || 'Keine Beschreibung gegeben!';
        this.category = options.category || 'users';
        this.usage = `${this.client.prefix}${this.name} ${options.usage || ''}`.trim();
        this.userPerms = new Permissions(options.userPerms).freeze();
        this.botPerms = new Permissions(options.botPerms).freeze();
        this.guildOnly = options.guildOnly || false;
        this.cooldown = options.cooldown || 0;
        this.cooldownPeople = new Collection();
        this.ownerOnly = options.ownerOnly || false;
        this.nsfw = options.nsfw || false;
        this.minArgs = options.minArgs || 0;
        this.children = client.utils.getSubCommands(name);
    }

    async run(message, args, isInteraction = false) {
        throw new Error(`Command ${this.name} doesn't provide a run method!`);
    }

};