import { applicationCommand, Extension, option } from "@pikokr/command.ts"
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js"
import { MuUser } from "../models/muUser"
import { MuUserDocument } from "../types/muUser.type"

class ProfileExtension extends Extension {
  @applicationCommand({
    name: "profile",
    type: ApplicationCommandType.ChatInput,
    nameLocalizations: {
      ko: "프로필",
    },
    description: "자신의 키뮤서버 프로필을 확인할 수 있어요!",
  })
  async profile(i: ChatInputCommandInteraction) {
    const user = await i.user.getMuUser()
    const exp = user.getIntegratedExp()

    const getGraph = () => {
      const graphSize = 10
      const graphEmoji = {
        atelier: "🎨",
        lab: "🧪",
        streaming: "🎥",
        playground: "🎲",
        atrium: "🏛",
      }
      let graph = ""
      graph += graphEmoji.atelier.repeat((user.atelierExp / exp) * graphSize)
      graph += graphEmoji.lab.repeat((user.labExp / exp) * graphSize)
      graph += graphEmoji.streaming.repeat(
        (user.streamingExp / exp) * graphSize
      )
      graph += graphEmoji.playground.repeat(
        (user.playgroundExp / exp) * graphSize
      )
      graph += graphEmoji.atrium.repeat((user.atriumExp / exp) * graphSize)
      return graph
    }

    const embed = new EmbedBuilder()
      .setTitle(`${user.name}님의 프로필`)
      .setFields([
        {
          name: "레벨과 경험치",
          value: `레벨 ${user.getLevel()}\`(✨ ${user
            .getIntegratedExp()
            .toLocaleString()})\``,
          inline: true,
        },
        {
          name: "키뮤 포인트",
          value: `🪙 ${user.point.toLocaleString()}`,
          inline: true,
        },
        {
          name: "보유 그림권",
          value: `🎨 ${user.artCoupon}`,
          inline: true,
        },
        {
          name: "성향",
          value: getGraph(),
        },
      ])
      .setColor("#cbd5e1")
      .setTimestamp()
      .setThumbnail(i.user.displayAvatarURL())

    await i.reply({ embeds: [embed] })
  }

  @applicationCommand({
    name: "level",
    type: ApplicationCommandType.ChatInput,
    nameLocalizations: {
      ko: "레벨",
    },
    description: "자신의 키뮤서버 통합 레벨을 확인할 수 있어요!",
  })
  async level(
    i: ChatInputCommandInteraction,
    @option({
      type: ApplicationCommandOptionType.User,
      name: "user",
      name_localizations: {
        ko: "유저",
      },
      description: "레벨을 확인할 유저를 선택해주세요!",
      required: false,
    })
    userId?: string
  ) {
    let user: MuUserDocument
    if (userId) {
      if (!(await MuUser.exists({ id: userId })))
        return i.reply("키뮤가 모르는 분이에요...")
      user = (await MuUser.findOne({
        id: userId,
      }))!
    } else {
      user = await i.user.getMuUser()
    }

    await i.reply(
      `${user.name}님은 ${user.getLevel()} 레벨이에요! \`(✨ ${user
        .getIntegratedExp()
        .toLocaleString()})\``
    )
  }
}

export const setup = async () => {
  return new ProfileExtension()
}
