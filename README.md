# Shakespeare

Shakespeare is a bot that can refine your messages with or without a tone. You can also just chat with him.

-----------------------------------------------------------------------------------------------------------



# Installation instructions

1. In the discord settings enable developer mode.
2. Go to https://discord.com/developers
3. Create a new Discord bot
4. Get a Gemini API Token from https://studio.google.com
   
5. Clone the repo.
7. Install node if not installed
9. Open the project with visual studio code or notepad + command prompt
10. Update the tokens and id
$env:DISCORD_BOT_TOKEN="discordtoken"
$env:DISCORD_CLIENT_ID="discordbotid"
$env:GEMINI_API_TOKEN="geminiapitoken"
12. Run 'npm i' and then 'npm start'


-----------------------------------------------------------------------------------------------------------



# Commands

/help - shows a list of all commands and functions <br/>
/refine message tone? - refines your message with an optional tone. <br/>
/s message - chat with shakespeare

-----------------------------------------------------------------------------------------------------------



# Storage

The bot stores chat history per discord channel in the chat-history.json file
