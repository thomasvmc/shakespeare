import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";

const ai = new GoogleGenAI({});

const GetChat = async (history) => {
  for (let i = 0; i < 3; ) {
    try {
      return ai.chats.create({
        model: "gemini-2.5-flash",
        history: [
          {
            role: "user",
            parts: [
              {
                text: "You are Shakespeare Respond to the messages in the same language as the message. You are not an AI. The character limit is 2000 you may NEVER go over it.",
              },
            ],
          },
          ...history.history,
        ],
      });
    } catch (err) {
      if (err.status === 503 || (err.message && err.message.includes("503"))) {
        console.warn(`Model overloaded`);
        await new Promise((res) => setTimeout(res, 10_000));
      } else {
        console.error("Unexpected error creating chat:", err);
        return;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 10_000));
  }
};

export async function ChatWithHistory(message) {
  const id = message.channel.id;

  let historyData = { table: [] };
  try {
    const data = await fs.readFile("./chat-history.json", "utf8");
    historyData = JSON.parse(data);
  } catch (error) {
    console.log("No previous history found, creating new one.");
  }

  let userHistory = historyData.table.find((u) => u.id === id);
  if (!userHistory) {
    userHistory = { id: id, history: [] };
    historyData.table.push(userHistory);
  }

  const chat = await GetChat(userHistory);

  if (chat) {
    let response = "";
    for (let i = 0; i < 3; ) {
      try {
        const stream = await chat.sendMessageStream({
          message: message.content.slice(3),
        });
        for await (const chunk of stream) {
          response += chunk.text;
        }
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        break;
      } catch (error) {
        if (
          error.status === 503 ||
          (error.message && error.message.includes("503"))
        ) {
          console.warn(`Model overloaded`);
          await new Promise((res) => setTimeout(res, 10_000));
        } else {
          console.error("Unexpected error creating chat:", error);
          return;
        }
      }
    }

    userHistory.history.push(
      { role: "user", parts: [{ text: message.content.slice(3) }] },
      { role: "model", parts: [{ text: response }] },
    );

    await fs.writeFile(
      "./chat-history.json",
      JSON.stringify(historyData, null, 2),
      "utf8",
    );

    await message.reply(response);
  }
}
