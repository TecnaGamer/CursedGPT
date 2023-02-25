require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'image',
        description: 'Generate an image',
        options: 
        [
            {
                name: 'prompt',
                description: 'Prompt for the image gen',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'steps',
                description: 'How many times to improve the image; Higher values take longer to generate; The default is 25',
                type: ApplicationCommandOptionType.Number,
            },
            {
                name: 'width',
                description: 'Set the width of the image in pixels; Higher values take longer to generate; The default is 512',
                type: ApplicationCommandOptionType.Number,
            },
            {
                name: 'height',
                description: 'Set the height of the image in pixels; Higher values take longer to generate; The default is 512',
                type: ApplicationCommandOptionType.Number
            }
            
        ]
    },
    {
        name: 'talk',
        description: 'Make the bot say a message on a blank memory',
        options: 
        [
            {
            name: 'prompt',
            description: 'prompt for the bot',
            type: ApplicationCommandOptionType.String,
            required: true,
            }
        ]
    },
    {
        name: 'memory',
        description: 'Tools for the bots memory',
        options:
        [
            {
                name: 'clear',
                description: "Clear the bot's memory",
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: 'bump',
                description: "Bumps the oldest line int he bot's memory.",
                type: ApplicationCommandOptionType.Subcommand
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Regestering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, 
                process.env.GUILD_ID
                ),
            { body: commands }
        )
        console.log('Commands regestered!');
    } catch (error) {
        console.log(`Test error: ${error}`);
    }
})();