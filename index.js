const DiscordBot = require('./structures/Bot.js');
require('dotenv').config();
let config = require('./config.json');

const client = new DiscordBot(config);
client.start().then(() => null);
