const DiscordBot = require('./structures/Bot.js');
require('dotenv').config();
let config = require('./config.json');

config.token = process.env.DISCORD_TOKEN;

const client = new DiscordBot(config);
client.start().then(() => null);
