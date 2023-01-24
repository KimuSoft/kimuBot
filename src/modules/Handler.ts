import { Extension, listener } from "@pikokr/command.ts"
import {
  ApplicationCommandType,
  codeBlock,
  CommandInteraction,
  MessageActionRowComponentBuilder,
} from "discord.js"

class DevExtension extends Extension {
  @listener({ event: "ready" })
  async ready() {
    this.logger.info(`Logged in as ${this.client.user!.tag}`)
    await this.commandClient.fetchOwners()
  }

  @listener({ event: "applicationCommandInvokeError", emitter: "cts" })
  async errorHandler(err: Error, i: CommandInteraction) {
    this.logger.error(err)
    if (i.isRepliable())
      return i.reply("으에... 오류예요!" + codeBlock(err.message))
    else
      return i.channel?.send(
        "으에... 오류예요!" + codeBlock(`⛔ ${err}: ${err.message}`)
      )
  }
}

export const setup = async () => {
  return new DevExtension()
}
