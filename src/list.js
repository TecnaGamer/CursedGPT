const fs = require('fs');
const path = require('path');

// Construct the file path
const filePath = path.join(__dirname, '../voices.txt');

// Read the text file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const voiceModels = JSON.parse(data);

    // Create a list of model IDs as "value" and display names as "name"
    const modelList = voiceModels.map((model) => ({
      value: model.model_id,
      name: model.display_name,
    }));

    // Convert the array to a JSON string
    const modelListString = JSON.stringify(modelList);

    // Print the list
    fs.writeFile('list.txt', modelListString, (err) => {
      if (err) {
        console.error('An error occurred while writing to the file:', err);
      } else {
        console.log('The file was successfully written.');
      }
    });
  } catch (error) {
    console.error('Error parsing the JSON:', error);
  }
});
