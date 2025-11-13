import { SlashCommandBuilder } from "discord.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const data = new SlashCommandBuilder()
  .setName("refine")
  .setDescription("Refines the given text.")
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The text to refine")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("tone")
      .setDescription(
        "The tone you want your messages refined to examples: (pirate, zombie)",
      ),
  );

export async function execute(interaction) {
  const message = interaction.options.getString("message");
  const tone = interaction.options.getString("tone");
  await interaction.reply({
    content: "Refining...",
    fetchReply: true,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message,
    config: {
      systemInstruction: `Refine this message. Only return the finalized refined message ${tone && `with the tone of ${tone} in the same language as the message`}`,
    },
  });
  console.log(response.text);

  await interaction.editReply(`${response.text}`);
}
