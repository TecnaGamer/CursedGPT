// Create a Discord Bot using OpenAI API that interacts on the Discord Server
require('dotenv').config();

//const filePath = 'messages.txt';
const userFilePath = 'usernames.txt';

// Prepare to connect to the Discord API
const { GatewayIntentBits, Client, ActivityType, AttachmentBuilder, Partials, PermissionsBitField} = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
],
partials: [
  Partials.Channel
]
})

// Prepare connection to OpenAI API
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {  if (interaction.commandName === 'image') {

    const prompt = interaction.options.get('prompt').value; // Get the value of the prompt option
    const steps = interaction.options.get('steps')?.value ?? 25;
    const width = interaction.options.get('width')?.value ?? 512;
    const height = interaction.options.get('height')?.value ?? 512;

    if (steps === undefined || steps < 1 || steps > 200) {
      interaction.reply({content:'⚠️Steps must be between 1 and 200⚠️', ephemeral: true})
      //throw new Error('Steps must be between 1 and 200');
    } else {

const request = require('request');

const url = "http://127.0.0.1:7860";

// await interaction.Reply(`Prompt: ${prompt}\n\
//     <a:loading:1078160725719138304> Waiting <a:loading:1078160725719138304>`)
//     console.log('Painting');

request.get(`${url}/sdapi/v1/progress`, (error, response, body) => {
if (error) {
console.error(error);
return;
}

const progress = JSON.parse(body).state.job_count;
console.log(progress);
});

    interaction.reply(`Prompt: ${prompt}\n\
    <a:sigmaspin:936805012145840138> Generating <a:sigmaspin:936805012145840138>`)
    console.log('Painting');
  
    const { spawn } = require('child_process');
    const pyProg = spawn('python3.9', ['src/image_gen.py', prompt, steps, width, height], { detached: true });
  
    pyProg.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    pyProg.stderr.on('data', function(data) {
      console.error(data.toString());
    });
    


    // Create a promise that resolves when the pyProg process emits the 'exit' event
    const exitPromise = new Promise((resolve, reject) => {
      pyProg.on('exit', (code, signal) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Process exited with code ${code} and signal ${signal}`));
        }
      });
    });
    
    

    // Wait for the promise to resolve before sending the reply
    await exitPromise;
    await new Promise(resolve => setTimeout(resolve, 1000));


    interaction.editReply('<a:TecnaDeafult:970719096129871932>Uploading<a:TecnaDeafult:970719096129871932>')

    const attachment = new AttachmentBuilder('output.png');



    interaction.editReply({ content: `Prompt: ${prompt}`, files: [attachment] });
    if (interaction.channel.type === 0) {
      guild = interaction.guild.id
      const fs = require('fs');
      imagelogs = fs.readFileSync(`guilds/${guild}/image-logs.txt`).toString().trim();

      if (interaction.channelId !== imagelogs) {
      client.channels.cache.get(imagelogs).send({ content: `Prompt: ${prompt}`, files: [attachment] })
      }
    }


    console.log('Sent Image');

  } } } catch (error) {
    console.error(error);
    interaction.editReply('❌Error making image❌');
  }


  if (interaction.commandName === 'memory') {
    if (interaction.options.getSubcommand() === 'clear') {
      const fs = require('fs');

      if (interaction.channel.type === 1) {
        const dms = interaction.channel.id;

        fs.writeFile(`dms/${dms}/messages.txt`, '', function (err) {
          if (err) throw err;
          console.log('File cleared!');
        });
      } else {

      const guild = interaction.guildId;

fs.writeFile(`guilds/${guild}/messages.txt`, '', function (err) {
  if (err) throw err;
  console.log('File cleared!');
});
      }
      await interaction.reply('Memory cleared!');
    }
    if (interaction.options.getSubcommand() === 'bump') {
      const fs = require('fs');

      if (interaction.channel.type === 1) {
        const dms = interaction.channel.id;
      const filePath = `dms/${dms}/messages.txt`;
      
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;
      
        // Split the file contents into an array of lines
        const lines = data.split('\n');
      
        // Remove the first line (i.e., the oldest line)
        lines.shift();
      
        // Join the remaining lines back into a single string
        const newContent = lines.join('\n');
      
        // Write the updated content back to the file
        fs.writeFile(filePath, newContent, (err) => {
          if (err) throw err;
          
      
          console.log('Memory Bumped');
        
        });
      });
    } else {
      const filePath = 'messages.txt';
      
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;
      
        // Split the file contents into an array of lines
        const lines = data.split('\n');
      
        // Remove the first line (i.e., the oldest line)
        lines.shift();
      
        // Join the remaining lines back into a single string
        const newContent = lines.join('\n');
      
        // Write the updated content back to the file
        fs.writeFile(filePath, newContent, (err) => {
          if (err) throw err;
          
      
          console.log('Memory Bumped');
        
        });
      });
    }
      await interaction.reply('Memory Bumped');
    }
  }
  

  if (interaction.commandName === 'setting') {
    if (!interaction.guild) {
      await interaction.reply('This command can only be run in a server context.');
      return;
    }
            // Check if the user is an admin
            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                await interaction.reply('You do not have permission to run this command.');
                return;
            }
    
            // The user is an admin, continue with the command logic
    if (interaction.options.getSubcommand() === 'set-chat') {
      const channel = interaction.options.getChannel('channel');
      const channelId = channel.toString().match(/(\d+)/)[1];
//      console.log(channelId);
      
      const guild = interaction.guildId;
      
      const fs = require('fs');
    
      const directory = `guilds/${guild}`;
      const filename = `${directory}/settings.txt`;
    
      // Create the directory if it doesn't exist
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
    
      // Create the file if it doesn't exist
      if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, '');
      }
    
      // Write to the file
      fs.writeFile(filename, channelId.toString(), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`Successfully wrote to ${filename} // ${channelId}`);
        interaction.reply(`Chat channel set to ${channel}`);
      });
    }

    if (interaction.options.getSubcommand() === 'set-image-logs') {
      const channel = interaction.options.getChannel('channel');
      const channelId = channel.toString().match(/(\d+)/)[1];
//      console.log(channelId);
      
      const guild = interaction.guildId;
      
      const fs = require('fs');
    
      const directory = `guilds/${guild}`;
      const filename = `${directory}/image-logs.txt`;
    
      // Create the directory if it doesn't exist
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
    
      // Create the file if it doesn't exist
      if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, '');
      }
    
      // Write to the file
      fs.writeFile(filename, channelId.toString(), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`Successfully wrote to ${filename} // ${channelId}`);
        interaction.reply(`Image logs channel set to ${channel}`);
      });
    }


  }
  
  
  



})











//Check for when a message on discord is sent
client.on('messageCreate', async function(message){
  let channel;
  let directory;
  let filename;
  let filePath = '';
  if (message.channel.type === 1) {
    console.log('Dm received')
    channel = message.channel.id

    const fs = require('fs'); 
    const directory = `dms/${channel}`;
    const filename = `${directory}/messages.txt`;
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
          // Create the file if it doesn't exist
          if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, '');
          }
            filePath = `dms/${channel}/messages.txt`;
  } else {
    const guild = message.guild.id;
    const fs = require('fs');
    channel = fs.readFileSync(`guilds/${guild}/settings.txt`).toString().trim(); // read the channel ID from settings.txt
    const directory = `guilds/${guild}`;
    const filename = `${directory}/messages.txt`;
          // Create the file if it doesn't exist
          if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, '');
          }
            filePath = `guilds/${guild}/messages.txt`;
  }
  try {
    if(message.system || message.author.bot || message.channel.id !== channel) return; // only react to messages from the specified channel

    // Start typing indicator and set custom status
    await client.user.setActivity({
      name: "with AI",
      type: ActivityType.Playing,
    })

    await message.channel.sendTyping();

    const reaction = await message.react('<a:sigmaspin:936805012145840138>');

// Assume `client` is a valid Discord.js client object

client.on('message', (message) => {
  const channelId = message.channel.id;
  console.log(`The channel ID is ${channelId}`);
});



        const MAX_CHARACTERS = 12000;
        const fs = require('fs'); 
        const messages = fs.readFileSync(filePath, 'utf8').trim().split('\n');
        let totalCharacters = messages.join('').length;
        
        while (totalCharacters >= MAX_CHARACTERS || messages.length >= 1000) {
          const removedMessage = messages.shift();
          totalCharacters -= removedMessage.length;
        }
        
        console.log(totalCharacters)
        

        //const userFilePath = 'usernames.txt';
        //const stopWords = fs.readFileSync(userFilePath, 'utf8').split('\n').filter(Boolean); // filter out empty lines

        console.log("Writing")

        const gtpResponse = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: `You are a friendly, fun, and helpful Discord chatbot called "CursedGPT".\n\
You will do exactly what people ask you to do.\n\
CursedGPT: Hello, how are you?\n\
${messages}\n\
${message.author.username}: ${message.content}\n\
CursedGPT:`,
            temperature: 0.9,
            max_tokens: 1500,
            stop: ["CursedGPT: ", `${message.author.username}: `]
        })


        const newMessage = `${message.author.username}: ${message.content}`;
        const botResponse = `${gtpResponse.data.choices[0].text}`;

//        const fs = require("fs");

// Sample text to scan and trim
const text = `${gtpResponse.data.choices[0].text}`;

// Read the list of words to trim after from a file
const words = fs.readFileSync("usernames.txt", "utf-8").split("\n").map(word => word.trim());

// Find the smallest index of any word in the list in the input text
let minIndex = text.length;
words.forEach(word => {
  const wordIndex = text.indexOf(word);
  if (wordIndex !== -1 && wordIndex < minIndex) {
    minIndex = wordIndex;
  }
});

// Trim the text after the smallest index found (if any)
const trimmedText = text.substring(0, minIndex);

// Output the final trimmed text
//console.log(botResponse);

        const badwordckeck = `${trimmedText}`.toLowerCase();

        // Read the list of words to detect from a file
        const wordsToDetect = fs.readFileSync("blacklist.txt", "utf-8").split("\n").map(word => word.trim().toLowerCase());

        // Check if any of the words to detect exist in the input text
        if (wordsToDetect.some(word => badwordckeck.includes(word))) {
        // Run your code here
        //console.log("Word detected!");
        
        } else{
        const fullMessage = `${newMessage}\nCursed GPT: ${trimmedText}\n`;

        messages.push(fullMessage);
        fs.writeFileSync(filePath, messages.join('\n'));
        }
        const username = message.author.username;
        const userMessage = `\n${username}:`;  
        
        // Check if username already exists in the file
        fs.readFile(userFilePath, 'utf8', function(err, data) {
          if (err) throw err;
          if (!data.includes(username)) {
            fs.appendFile(userFilePath, userMessage, function (err) {
              if (err) throw err;
            });
          }
        });
        


        if (wordsToDetect.some(word => badwordckeck.includes(word))) {
          // Run your code here
          console.log("Bad Word Detected");
          message.reactions.removeAll()
          message.react('⚠️')
          client.channels.cache.get('1078730517089890374').send(`Message:\n\
${message.author.username}: ${message.content}\n\
Bot reply:\n\
${trimmedText}`)
          
          client.user.setActivity({
            name: "for messages",
            type: ActivityType.Watching,
          })

        } else {
          const MAX_MESSAGE_LENGTH = 2000;

          if (trimmedText.length <= MAX_MESSAGE_LENGTH) {
            // The text is short enough to send as a single message
            message.reply(trimmedText);
          } else {
            // The text is too long, so split it into chunks and send each chunk separately
            const chunks = [];
            for (let i = 0; i < trimmedText.length; i += MAX_MESSAGE_LENGTH) {
              chunks.push(trimmedText.slice(i, i + MAX_MESSAGE_LENGTH));
            }
            chunks.forEach((chunk) => {
              message.reply(chunk);
            });
          }
          

          const botUser = message.client.user;
const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(botUser.id));
for (const reaction of userReactions.values()) {
  await reaction.users.remove(botUser.id);
}
          
          await message.react('✅');
        client.user.setActivity({
          name: "for messages",
          type: ActivityType.Watching,
        })

        console.log("Sent")
        
        
        



    //.catch(error => console.error('Failed to remove reactions:', error));
    return;          
        }

    } catch (err) {
        console.log(err)
        const botUser = message.client.user;
        const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(botUser.id));
        for (const reaction of userReactions.values()) {
          await reaction.users.remove(botUser.id);
        }
        message.react('❌')

        client.user.setActivity({
          name: "for messages",
          type: ActivityType.Watching,
        })
    }
    

});














// Log the bit into Discord
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is Online on Discord")
client.on('ready', client => {
client.channels.cache.get('1076645441816494182').send('Bot Has Restarted!')
client.user.setActivity({
  name: "for messages",
  type: ActivityType.Watching,
})
})

