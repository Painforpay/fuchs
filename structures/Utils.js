const path = require('path');
const {promisify} = require('util');
const glob = promisify(require('glob'));
const Command = require('./Command.js');
const SubCommand = require('./SubCommand.js');
const Event = require('./Event.js');
const {MessageEmbed} = require('discord.js');



module.exports = class Util {

    constructor(client) {
        this.client = client;
    }

    getDateTime(ms = new Date()) {

        const date = new Date(ms);

        return date.toLocaleString('de-DE', this.client.datetimeformat);

    }

    isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class';
    }

    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`;
    }

    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }
        return arr;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }

    removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    capitalise(string) {
        return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
    }

    checkOwner(target) {
        return this.client.owners.find(u => u.id === target);
    }

    async shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    async getOwners(ArrOwners) {
        let {users} = this.client;

        let OwnerObj = [];

        for (const id of ArrOwners) {
            OwnerObj.push(await this.client.users.fetch(id))
        }
        return OwnerObj;
    }

    comparePerms(member, target) {
        return member.roles.highest.position > target.roles.highest.position;
    }

    clean(text) {
        if (typeof text === 'string') {
            text = text
                .replace(/`/g, `${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`)
                .replace(new RegExp(this.client.token, 'gi'), '***[TOKEN]***')

        }
        return text;
    }

    trimString(str, length) {
        return ((str.length > length) ? `${str.slice(0, length - 4)}...\n` : str);
    }

    getSubCommands(cmd) {

        return this.client.subCommands.filter((v, k) => v.parent === cmd);

    }

    formatPerms(perm) {
        return perm
            .toLowerCase()
            .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
            .replace(/_/g, ' ')
            .replace(/Guild/g, 'Server')
            .replace(/Use Vad/g, 'Use Voice Activity');
    }

    formatArray(array, type = 'conjunction') {
        return new Intl.ListFormat('en-GB', {style: 'short', type: type}).format(array);
    }


    async loadCommands() {
        return glob(`${this.directory}commands/**/*.js`).then(commands => {
            for (const commandFile of commands) {
                delete require.cache[commandFile];
                const {name} = path.parse(commandFile);
                const File = require(commandFile);
                if (!this.isClass(File)) throw new TypeError(`Der Befehl ${name} exportiert keine Klasse.`);
                const command = new File(this.client, name.toLowerCase());
                if (!(command instanceof Command)) throw new TypeError(`Der Befehl ${name} ist keine Instanz von Command.`);
                this.client.commands.set(command.name, command);
                if (command.aliases.length) {
                    for (const alias of command.aliases) {
                        this.client.aliases.set(alias, command.name);
                    }
                }
            }
        });
    }

    async loadSubCommands() {
        return glob(`${this.directory}commands/*/*/*.js`).then(subCommands => {
            for (const commandFile of subCommands) {
                delete require.cache[commandFile];
                const {name} = path.parse(commandFile);
                const File = require(commandFile);
                if (!this.isClass(File)) throw new TypeError(`Der Befehl ${name} exportiert keine Klasse.`);
                const command = new File(this.client, name.toLowerCase());
                if (!(command instanceof SubCommand)) throw new TypeError(`Der Befehl ${name} ist keine Instanz von SubCommand.`);
                this.client.subCommands.set(command.parent ? `${command.parent}_${command.name}` : command.name, command);
            }
        });
    }


    async loadEvents() {
        return glob(`${this.directory}events/*.js`).then(events => {
            for (const eventFile of events) {
                delete require.cache[eventFile];
                const {name} = path.parse(eventFile);
                const File = require(eventFile);
                if (!this.isClass(File)) throw new TypeError(`Das Event ${name} exportiert keine Klasse.`);
                const event = new File(this.client, name);
                if (!(event instanceof Event)) throw new TypeError(`Das Event ${name} ist keine Instanz von Event.`);
                this.client.events.set(event.name, event);
                event.emitter[event.type](name, (...args) => event.run(...args));
            }
        });
    }

    getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    getRandomfromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }


}