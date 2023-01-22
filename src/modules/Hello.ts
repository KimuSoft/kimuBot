import { applicationCommand, Extension, listener } from "@pikokr/command.ts"
import {
  ActionRowBuilder,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Message,
  MessageActionRowComponentBuilder,
  RoleSelectMenuBuilder,
} from "discord.js"

class HelloExtension extends Extension {
  @listener({ event: "ready" })
  async ready() {
    this.logger.info(`Logged in as ${this.client.user!.tag}`)
    await this.commandClient.fetchOwners()
  }

  @listener({ event: "applicationCommandInvokeError", emitter: "cts" })
  async errorHandler(err: Error) {
    this.logger.error(err)
  }

  @listener({ event: "messageCreate" })
  async gum(msg: Message) {
    if (/[키뮤바보]{4}/.test(msg.content) && msg.deletable) {
      await msg.delete()
    }
  }

  @applicationCommand({
    name: "ping",
    type: ApplicationCommandType.ChatInput,
    description: "wow this is ping",
  })
  async ping(i: ChatInputCommandInteraction) {
    const select = new RoleSelectMenuBuilder()
      .setCustomId("role_sel")
      .setPlaceholder("머야 이건")
    await i.reply({
      components: [
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          select
        ),
      ],
    })
    // await i.reply(`current ping: ${i.client.ws.ping}ms`)
  }
}

export const setup = async () => {
  return new HelloExtension()
}
