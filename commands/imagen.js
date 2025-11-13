import { SlashCommandBuilder } from "discord.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const data = new SlashCommandBuilder()
  .setName("imagen")
  .setDescription("Generates an image based of of description.");

export async function execute(interaction) {
  await interaction.reply({
    content: "Generating",
    fetchReply: true,
  });

  const response = await ai.models.generateImages({
    model: "imagen-4.0-generate-001",
    prompt: "Robot holding a red skateboard",
    config: {
      numberOfImages: 4,
    },
  });

  await interaction.editReply(`${response}`);
}
