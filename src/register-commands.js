require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType} = require('discord.js');
const { value } = require('promisify');

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
    // {
    //     name: 'talk',
    //     description: 'Make the bot say a message on a blank memory',
    //     options: 
    //     [
    //         {
    //         name: 'prompt',
    //         description: 'prompt for the bot',
    //         type: ApplicationCommandOptionType.String,
    //         required: true,
    //         }
    //     ]
    // },
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
            // {
            //     name: 'bump',
            //     description: "Bumps the oldest line int he bot's memory.",
            //     type: ApplicationCommandOptionType.Subcommand
            // }
        ],
        defaultPermission: false,
    },
    {
        name: 'setting',
        description: 'Settings for the bot',
        options:
        [
            {
                name: 'set-chat',
                description: 'Set the channel the bot will chat in',
                type: ApplicationCommandOptionType.Subcommand,
                options:
                [
                    {
                        name: 'channel',
                        description: 'Set the channel',
                        type: ApplicationCommandOptionType.Channel,
                        required: true
                    },
                    {
                        name: 'model',
                        description: 'Choose witch model to use',
                        type: ApplicationCommandOptionType.String,
                        choices:
                        [
                            {
                                name: '3.5 turbo (ChatGPT) [Default]',
                                value: '3-5-turbo',
                            },
                            {
                                name: 'GPT 2 (Not as smart, may produce more chaotic results)',
                                value: 'GPT-2',
                            }
                        ]
                    }
                ]
            },
            {
            name: 'set-image-logs',
            description: 'Set the channel all generated images will be sent to',
            type: ApplicationCommandOptionType.Subcommand,
            options:
            [
                {
                    name: 'channel',
                    description: 'Set the channel',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }
            ]
        },
        {
            name: 'set-warning-logs',
            description: 'Set where to log warnings triggered by the bots blacklist',
            type: ApplicationCommandOptionType.Subcommand,
            options:
            [
                {
                    name: 'channel',
                    description: 'Set the channel',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }
            ]
        },
        {
            name: 'unset-chat',
            description: 'Unsets the channel the bot will chat in',
            type: ApplicationCommandOptionType.Subcommand,
            options:
            [
                {
                    name: 'model',
                    description: 'Choose witch model to use',
                    type: ApplicationCommandOptionType.String,
                    choices:
                    [
                        {
                            name: '3.5 turbo (ChatGPT) [Default]',
                            value: '3-5-turbo',
                        },
                        {
                            name: 'GPT 2 (Not as smart, may produce more chaotic results)',
                            value: 'GPT-2',
                        }
                    ]
                }
            ]
        },
        {
        name: 'unset-image-logs',
        description: 'Removes the image logs',
        type: ApplicationCommandOptionType.Subcommand,
    },
    {
        name: 'unset-warning-logs',
        description: 'Removes the warning logs',
        type: ApplicationCommandOptionType.Subcommand,
    }
        ],
        defaultPermission: false,
    },
    {
        name: 'blacklist',
        description: "Control what people can or can't do with the bot. Or prevent the bot from saying cretan things",
        defaultPermission: false,
        options:
        [
            {
                name: 'list',
                description: 'List the current list of blacklisted words/phrases',
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: 'bot-response',
                description: 'Prevent the bot from saying certan words/phrases',
                type: ApplicationCommandOptionType.Subcommand,
                options:
                [
                    {
                        name: 'add',
                        description: 'Add a word/phraze to the blacklist',
                        type: ApplicationCommandOptionType.String
                    },
                    {
                        name: 'remove',
                        description: 'Remove a word/phraze from the blacklist',
                        type: ApplicationCommandOptionType.String
                    }
                ]
            },
            {
                name: 'ignore',
                description: 'The bot will ignore messages containing these words/phrases',
                type: ApplicationCommandOptionType.Subcommand,
                options:
                [
                    {
                        name: 'add',
                        description: 'Add a word/phraze to the blacklist',
                        type: ApplicationCommandOptionType.String
                    },
                    {
                        name: 'remove',
                        description: 'Remove a word/phraze from the blacklist',
                        type: ApplicationCommandOptionType.String
                    }
                ]
            },
            {
                name: 'image-gen',
                description: 'Prevent people form entering ceartan words/phrases into the image gen',
                type: ApplicationCommandOptionType.Subcommand,
                options:
                [
                    {
                        name: 'add',
                        description: 'Add a word/phraze to the blacklist',
                        type: ApplicationCommandOptionType.String
                    },
                    {
                        name: 'remove',
                        description: 'Remove a word/phraze from the blacklist',
                        type: ApplicationCommandOptionType.String
                    }
                ]
            },
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Commands registered globally!');
    } catch (error) {
        console.error(error);
    }
})();
