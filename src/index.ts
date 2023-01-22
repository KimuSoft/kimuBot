import { Client } from "discord.js"
import path from "path"
import { config } from "./config"
import { CustomizedCommandClient } from "./structures"
import mongoose from "mongoose"

const client = new Client({
  intents: [
    "Guilds",
    "DirectMessages",
    "MessageContent",
    "GuildMembers",
    "GuildMessages",
  ],
})

const cts = new CustomizedCommandClient(client)

const start = async () => {
  await mongoose.connect(config.db)

  await cts.setup()

  await client.login(config.token)

  await cts.getApplicationCommandsExtension()!.sync()
}

start().then()
