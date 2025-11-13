import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Shows all available commands and how to use them");

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("Shakespeare Help")
    .setDescription("Here are all the available commands:")
    .addFields(
      { name: "/help", value: "Display this help message" },
      {
        name: "/refine",
        value: "Refines the given text optionally with a tone",
      },
      { name: "/s", value: "Chat with shakespeare" },
    )
    .setFooter({ text: "Shakespeare Bot" })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
