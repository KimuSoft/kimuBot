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
  ChatInputCommandInteraction,
  Message,
  MessageActionRowComponentBuilder,
  SelectMenuBuilder,
} from "discord.js"
import { config } from "../config"
import { MuUser } from "../models/muUser"

class PointExtension extends Extension {
  @listener({ event: "messageCreate" })
  async pointAndExp(msg: Message) {
    const user = await msg.author.getMuUser()
    const gainedPoint = Math.round(Math.sqrt(Math.min(msg.content.length, 100)))

    user.point += gainedPoint

    const beforeLevel = user.getLevel()

    switch (msg.guildId) {
      case config.kimuGuild.lab:
        user.labExp += gainedPoint
        break
      case config.kimuGuild.atelier:
        user.atelierExp += gainedPoint
        break
      case config.kimuGuild.atrium:
        user.atriumExp += gainedPoint
        break
      case config.kimuGuild.playground:
        user.playgroundExp += gainedPoint
        break
      case config.kimuGuild.streaming:
        user.streamingExp += gainedPoint
        break
      default:
        return this.logger.warn(`unknown guild id: ${msg.guildId}`)
    }

    user.save().then()
    this.logger.debug(`gained ${gainedPoint} point from ${msg.author.tag}`)

    // 레벨이 오르면 이모지를 달아서 알려줌
    const afterLevel = user.getLevel()
    if (beforeLevel !== afterLevel) {
      this.logger.info(`${msg.author.tag} leveled up to ${afterLevel}!`)
      await msg.react("✨")
    }
  }

  @applicationCommand({
    name: "level_ranking",
    nameLocalizations: {
      ko: "레벨랭킹",
    },
    type: ApplicationCommandType.ChatInput,
    description: "레벨 랭킹을 볼 수 있어요!",
  })
  async levelRanking(i: ChatInputCommandInteraction) {
    await i.deferReply()
    const users = await MuUser.find({})
    const sortedUsers = (await users).sort(
      (a, b) => b.getIntegratedExp() - a.getIntegratedExp()
    )
    // 20등까지만 자름
    const slicedUsers = sortedUsers.slice(0, 20)

    const options = []
    let idx = 0
    for (const user of slicedUsers) {
      idx++
      options.push({
        label: `${idx}. ${
          user.name
        } : 레벨 ${user.getLevel()} (✨ ${user.getIntegratedExp()})`,
        value: idx.toString(),
        emoji: "👑",
      })
    }

    const select = new SelectMenuBuilder()
      .setCustomId("ignored")
      .setPlaceholder(`👑 가장 많은 경험치를 모은 사람들!`)
      .addOptions(options)

    await i.editReply({
      components: [
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          select
        ),
      ],
    })
  }

  @applicationCommand({
    name: "그림권부여",
    type: ApplicationCommandType.ChatInput,
    description: "wow this is ping",
  })
  @ownerOnly
  async giveArtCoupon(
    i: ChatInputCommandInteraction,
    @option({
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "wow this is user",
    })
    userId: string,
    @option({
      name: "value",
      type: ApplicationCommandOptionType.Number,
      description: "wow this is value",
    })
    value: number = 1
  ) {
    const user = await MuUser.findOne({
      id: userId,
    })
    if (!user) return i.reply("그런 유저는 없어요!")
    user.artCoupon += value
    user.save().then()
    await i.reply(`그림권을 ${value}개 부여했어요!`)
  }
}

export const setup = async () => {
  return new PointExtension()
}
