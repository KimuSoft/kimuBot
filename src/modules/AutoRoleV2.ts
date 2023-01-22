import {
  applicationCommand,
  Extension,
  listener,
  option,
  ownerOnly,
} from "@pikokr/command.ts"
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CategoryChannel,
  ChatInputCommandInteraction,
  Interaction,
  MessageActionRowComponentBuilder,
  RoleSelectMenuBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} from "discord.js"

class AutoRoleExtension extends Extension {
  // @listener({ event: "interactionCreate" })
  // async giveRole(i: Interaction) {
  //   if (!i.isRoleSelectMenu()) return
  //   if (i.customId !== "role") return
  //   await i.reply({
  //     content: `<@&${i.values[0]}> 역할을 지급합니다.`,
  //     ephemeral: true,
  //   })
  //
  //   this.logger.info(`롤 받아랑`)
  // }
  //
  // @applicationCommand({
  //   name: "give_role",
  //   nameLocalizations: {
  //     ko: "역할받기",
  //   },
  //   type: ApplicationCommandType.ChatInput,
  //   description: "원하는 역할을 받을 수 있어요!",
  // })
  // async autoRole(
  //   i: ChatInputCommandInteraction,
  //   @option({
  //     type: ApplicationCommandOptionType.Channel,
  //     name: "channel",
  //     description: "역할을 받을 채널",
  //     name_localizations: {
  //       ko: "채널",
  //     },
  //   })
  //   channelId: string
  // ) {
  //   if (!i.guild) return
  //   const channel = await i.guild.channels.fetch(channelId)
  //   if (!channel) return i.reply("채널을 찾을 수 없어요!")
  //   if (!channel.isTextBased()) return i.reply("텍스트 채널이 아니에요!")
  //
  //   const select = new RoleSelectMenuBuilder()
  //     .setCustomId("role_sel")
  //     .setPlaceholder("받고 싶은 권한을 검색해 보세요")
  //   await channel.send({
  //     components: [
  //       new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
  //         select
  //       ),
  //     ],
  //   })
  //   // await i.reply(`current ping: ${i.client.ws.ping}ms`)
  // }
}

export const setup = async () => {
  return new AutoRoleExtension()
}
