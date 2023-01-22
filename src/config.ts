type Config = {
  token: string
  guilds: string[]
  db: string
  kimuGuild: {
    atrium: string
    atelier: string
    streaming: string
    playground: string
    lab: string
  }
}

export const config: Config = require("../config.json")
