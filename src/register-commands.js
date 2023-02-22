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
            description: 'How many times to improve the generated image iteratively; higher values take longer; Default is 50',
            type: ApplicationCommandOptionType.Number,
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