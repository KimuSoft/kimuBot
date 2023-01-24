import { Client } from "discord.js"
import path from "path"
import { config } from "./config"
import { CustomizedCommandClient } from "./structures"
import mongoose from "mongoose"
import { Scheduler } from "./structures/scheduler"

const client = new Client({
  intents: [
    "Guilds",
    "DirectMessages",
    "MessageContent",
    "GuildMembers",
    "GuildMessages",
  ],
})

const scheduler = new Scheduler()

const cts = new CustomizedCommandClient(client)

const start = async () => {
  await mongoose.connect(config.db)
  await scheduler.start()
  await cts.setup()

  await client.login(config.token)

  await cts.getApplicationCommandsExtension()!.sync()
}

start().then()
