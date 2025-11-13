import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(config.token);

try {
  console.log(`Started refreshing ${commands.length} application (/) commands.`);

  let data;
  if (config.guildId) {
    data = await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );
    console.log(`Successfully registered commands to guild ${config.guildId}`);
  } else {
    data = await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );
    console.log('Successfully registered commands globally');
  }

  console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  console.error('Error deploying commands:', error);
  if (!config.token || !config.clientId) {
    console.error('Make sure DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID are set in your secrets.');
  }
}
