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
  GuildMember,
  Interaction,
  MessageActionRowComponentBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuComponent,
} from "discord.js"

class AutoRoleExtension extends Extension {
  @listener({ event: "interactionCreate" })
  async giveRole(i: Interaction) {
    if (!i.isStringSelectMenu()) return
    if (i.customId !== "role") return

    const member = i.member as GuildMember
    if (!member) return

    for (const roleId of i.values) {
      // const role = await i.guild?.roles.fetch(roleId)

      if (member.roles.cache.some((r) => r.id === roleId)) {
        await member.roles.remove(roleId)
        await i.reply({
          content: `<@&${i.values[0]}> 역할을 제거합니다.`,
          ephemeral: true,
        })
      } else {
        await member.roles.add(roleId)
        await i.reply({
          content: `<@&${i.values[0]}> 역할을 지급합니다.`,
          ephemeral: true,
        })
      }
    }

    this.logger.info(`롤 받아랑`)
  }

  @applicationCommand({
    name: "create_auto_role",
    nameLocalizations: {
      ko: "자동역할생성",
    },
    type: ApplicationCommandType.ChatInput,
    description: "wow this is ping",
  })
  @ownerOnly
  async create(
    i: ChatInputCommandInteraction,
    @option({
      name: "message",
      description: "자동 역할과 함께 올라갈 메시지",
      type: ApplicationCommandOptionType.String,
      name_localizations: {
        ko: "메시지",
      },
    })
    message: string = "아래에서 원하는 역할을 선택하시면 얻을 수 있어요!\n`📌 한 번 더 선택하면 역할이 사라져요!`"
  ) {
    if (!i.channel) return
    await i.channel.send(message)
    await i.reply({
      content: "생성했어요!",
      ephemeral: true,
    })
  }

  @applicationCommand({
    name: "add_auto_role",
    nameLocalizations: {
      ko: "자동역할추가",
    },
    type: ApplicationCommandType.ChatInput,
    description: "wow this is ping",
  })
  @ownerOnly
  async add(
    i: ChatInputCommandInteraction,
    @option({
      name: "message",
      description: "메시지 ID",
      type: ApplicationCommandOptionType.String,
      name_localizations: {
        ko: "메시지아이디",
      },
      required: true,
    })
    messageId: string,
    @option({
      name: "role",
      description: "역할이에요",
      type: ApplicationCommandOptionType.Role,
      name_localizations: {
        ko: "역할",
      },
      required: true,
    })
    roleId: string,
    @option({
      name: "label",
      description: "역할이에요",
      type: ApplicationCommandOptionType.String,
      name_localizations: {
        ko: "제목",
      },
    })
    label: string,
    @option({
      name: "description",
      description: "역할이에요",
      type: ApplicationCommandOptionType.String,
      name_localizations: {
        ko: "설명",
      },
    })
    description: string,
    @option({
      name: "emoji",
      description: "역할이에요",
      type: ApplicationCommandOptionType.String,
      max_length: 1,
      name_localizations: {
        ko: "이모지",
      },
    })
    emoji: string
  ) {
    if (!i.channel) return
    const msg = await i.channel.messages.fetch(messageId)
    if (!msg.editable) return i.reply("그거 키뮤 게 아니자나요!")
    if (!i.guild) return

    const role = await i.guild.roles.fetch(roleId)
    if (!role) return i.reply("역할이 없어요!")

    const newOption = new SelectMenuOptionBuilder()
      .setLabel(label || role.name)
      // .setDescription(description)
      .setEmoji(emoji || "⚫")
      .setValue(roleId)
      .toJSON()

    let select = msg.components[0]?.components[0] as
      | StringSelectMenuComponent
      | undefined
    console.log(msg.components)

    if (select) {
      select.options.push(newOption)
    } else {
      // @ts-ignore
      select = new StringSelectMenuBuilder()
        .setCustomId(`role`)
        .setPlaceholder("📙  얻고 싶은 역할을 선택해주세요!")
        .setOptions(newOption)
    }

    await msg.edit({
      components: [
        new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
          // @ts-ignore
          select
        ),
      ],
    })

    await i.reply({
      content: "추가했어요!",
      ephemeral: true,
    })
  }
}

export const setup = async () => {
  return new AutoRoleExtension()
}
