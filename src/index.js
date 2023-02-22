// Create a Discord Bot using OpenAI API that interacts on the Discord Server
require('dotenv').config();

const filePath = 'messages.txt';
const userFilePath = 'usernames.txt';

// Prepare to connect to the Discord API
const { GatewayIntentBits, Client, ActivityType, AttachmentBuilder} = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

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
    const steps = interaction.options.get('steps')?.value ?? 50; 

    if (steps === undefined || steps < 1 || steps > 200) {
      interaction.reply({content:'⚠️Steps must be between 1 and 200⚠️', ephemeral: true})
      //throw new Error('Steps must be between 1 and 200');
    } else {

    interaction.reply(`Prompt: ${prompt}\n\
    <a:sigmaspin:936805012145840138> Generating <a:sigmaspin:936805012145840138>`)
    console.log('Painting');


  
    const { spawn } = require('child_process');
    const pyProg = spawn('python3.9', ['/src/image_gen.py', prompt, steps], { detached: true });
  
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

    interaction.editReply('<a:TecnaDeafult:970719096129871932>Uploading<a:TecnaDeafult:970719096129871932>')

    const attachment = new AttachmentBuilder('output.png');

    interaction.editReply({ content: `Prompt: ${prompt}`, files: [attachment] });
    console.log('Sent Image');

  } } } catch (error) {
    console.error(error);
    interaction.editReply('❌Error making image❌');
  }


  if (interaction.commandName === 'talk') {
    const prompt = interaction.options.get('prompt');
        // Start typing indicator and set custom status
        await client.user.setActivity({
          name: "with AI",
          type: ActivityType.Playing,
        })

        //await interaction.channel.sendTyping();

        //interaction.react('<a:sigmaspin:936805012145840138>')

        const fs = require('fs');        
        const filePath = 'messages.txt';
        //const messages = fs.readFileSync(filePath, 'utf8').trim().split('\n');

        const MAX_CHARACTERS = 20000;

        const messages = fs.readFileSync(filePath, 'utf8').trim().split('\n');
        let totalCharacters = messages.join('').length;
        
        while (totalCharacters >= MAX_CHARACTERS) {
          const removedMessage = messages.shift();
          totalCharacters -= removedMessage.length;
        }
        
        console.log(totalCharacters)
        

        //const userFilePath = 'usernames.txt';
        //const stopWords = fs.readFileSync(userFilePath, 'utf8').split('\n').filter(Boolean); // filter out empty lines

        console.log("Writing")

        const gtpResponse = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: `Cursed GPT is a friendly Discord chatbot.\n\
Cursed GPT cannot say racial slurs or transphobic slurs either.\n\
Cursed GPT: Hello, how are you?\n\
${interaction.member.user.username}: ${prompt}\n\
Cursed GPT:`,
            temperature: 0.9,
            max_tokens: 500,
            stop: ["Cursed GPT: ", `${interaction.member.user.username}: `]
        })


        const newMessage = `${interaction.member.user.username}: ${prompt}`;
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
        const username = interaction.member.user.username;
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
          //interaction.reactions.removeAll()
          //interaction.react('⚠️')
          
          client.user.setActivity({
            name: "for messages",
            type: ActivityType.Watching,
          })

        } else {
        interaction.reply(`${trimmedText}`);
        //interaction.react('✅')
        
        client.user.setActivity({
          name: "for messages",
          type: ActivityType.Watching,
        })

        console.log("Sent")
        //interaction.reactions.cache.get('936805012145840138').remove()
    //.catch(error => console.error('Failed to remove reactions:', error));
    return;          
        }

    

  };
})



//Check for when a message on discord is sent
client.on('messageCreate', async function(message){
    try {
        if(message.author.bot) return;
        
        // Start typing indicator and set custom status
        await client.user.setActivity({
          name: "with AI",
          type: ActivityType.Playing,
        })

        await message.channel.sendTyping();

        message.react('<a:sigmaspin:936805012145840138>')

        const fs = require('fs');        
        const filePath = 'messages.txt';
        //const messages = fs.readFileSync(filePath, 'utf8').trim().split('\n');

        const MAX_CHARACTERS = 20000;

        const messages = fs.readFileSync(filePath, 'utf8').trim().split('\n');
        let totalCharacters = messages.join('').length;
        
        while (totalCharacters >= MAX_CHARACTERS) {
          const removedMessage = messages.shift();
          totalCharacters -= removedMessage.length;
        }
        
        console.log(totalCharacters)
        

        //const userFilePath = 'usernames.txt';
        //const stopWords = fs.readFileSync(userFilePath, 'utf8').split('\n').filter(Boolean); // filter out empty lines

        console.log("Writing")

        const gtpResponse = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: `Cursed GPT is a friendly Discord chatbot.\n\
Cursed GPT cannot say racial slurs or transphobic slurs either.\n\
Cursed GPT: Hello, how are you?\n\
${messages}\n\
${message.author.username}: ${message.content}\n\
Cursed GPT:`,
            temperature: 0.9,
            max_tokens: 500,
            stop: ["Cursed GPT: ", `${message.author.username}: `]
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
          
          client.user.setActivity({
            name: "for messages",
            type: ActivityType.Watching,
          })

        } else {
        message.reply(`${trimmedText}`);
        message.react('✅')
        
        client.user.setActivity({
          name: "for messages",
          type: ActivityType.Watching,
        })

        console.log("Sent")
        message.reactions.cache.get('936805012145840138').remove()
    .catch(error => console.error('Failed to remove reactions:', error));
    return;          
        }

    } catch (err) {
        console.log("Error")
        message.reactions.removeAll()
	.catch(error => console.error('Failed to clear reactions:', error));
        message.react('❌')

        client.user.setActivity({
          name: "for messages",
          type: ActivityType.Watching,
        })

        const fs = require('fs');
        const filePath = 'messages.txt';
        const messages = fs.readFileSync(filePath, 'utf8').trim().split('\n');
        messages.shift();

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
