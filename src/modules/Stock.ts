import { applicationCommand, Extension, option } from "@pikokr/command.ts"
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  codeBlock,
  EmbedBuilder,
} from "discord.js"
import { getPrice, getPriceData, Price } from "../models/price"
import { itemChoice, StockType } from "../constants"
import dedent from "dedent"
import { ChartJSNodeCanvas } from "chartjs-node-canvas"
import "chartjs-adapter-moment"
import moment from "moment"
import { PriceDocument } from "../types/price"

class StockExtension extends Extension {
  @applicationCommand({
    name: "buy",
    type: ApplicationCommandType.ChatInput,
    nameLocalizations: { ko: "매수" },
    description: "원하는 키뮤 주식을 매수할 수 있어요!",
  })
  async buy(
    i: ChatInputCommandInteraction,
    @option({
      type: ApplicationCommandOptionType.String,
      choices: itemChoice,
      name: "item",
      name_localizations: { ko: "종목" },
      description: "매수할 종목을 선택해주세요!",
      required: true,
    })
    item: StockType,
    @option({
      type: ApplicationCommandOptionType.Integer,
      name: "amount",
      name_localizations: { ko: "수량" },
      description: "매수할 수량을 입력해주세요!",
      required: true,
      min_value: 1,
    })
    amount: number
  ) {
    const user = await i.user.getMuUser()
    const price = await getPrice(item)

    if (user.point < price * amount)
      return i.reply({
        content: `포인트가 부족합니다! ${
          price * amount - user.point
        } 포인트가 부족해요!`,
      })

    user.point -= price * amount
    user[item] += amount

    await i.reply({
      content: `매수가 완료되었습니다! ${item} ${amount}주를 매수하셨어요!`,
    })
  }
  @applicationCommand({
    name: "sell",
    type: ApplicationCommandType.ChatInput,
    nameLocalizations: { ko: "매도" },
    description: "보유한 키뮤 주식을 매도할 수 있어요!",
  })
  async sell(
    i: ChatInputCommandInteraction,
    @option({
      type: ApplicationCommandOptionType.String,
      choices: itemChoice,
      name: "item",
      name_localizations: { ko: "종목" },
      description: "매수할 종목을 선택해주세요!",
      required: true,
    })
    item: StockType,
    @option({
      type: ApplicationCommandOptionType.Integer,
      name: "amount",
      name_localizations: { ko: "수량" },
      description: "매도할 수량을 입력해주세요!",
      required: true,
      min_value: 1,
    })
    amount: number
  ) {
    const user = await i.user.getMuUser()
    const price = await getPrice(item)

    if (user[item] < amount)
      return i.reply({
        content: `보유한 주식이 부족합니다! ${
          amount - user[item]
        }주가 부족해요!`,
      })

    user.point += price * amount
    user[item] -= amount

    await i.reply({
      content: `매도가 완료되었습니다! ${item} ${amount}주를 매도하셨어요!`,
    })
  }

  @applicationCommand({
    name: "price",
    type: ApplicationCommandType.ChatInput,
    nameLocalizations: { ko: "주가조회" },
    description: "현재 상장된 키뮤 주식의 가격을 조회할 수 있어요!",
  })
  async price(i: ChatInputCommandInteraction) {
    const price = await getPriceData()
    if (!price)
      return i.reply({ content: "주식 데이터를 불러오는데 실패했어요!" })

    const embed = new EmbedBuilder().setTitle("주가조회").setDescription(
      dedent`
        키뮤소프트 : ${price.kimuSoft.toLocaleString()}원
        키뮤게임즈 : ${price.kimuGames.toLocaleString()}원
        키뮤픽쳐즈 : ${price.kimuPictures.toLocaleString()}원
        키뮤노블 : ${price.kimuNovel.toLocaleString()}원
        `
    )

    await i.reply({ embeds: [embed] })
  }

  @applicationCommand({
    name: "price_trend",
    type: ApplicationCommandType.ChatInput,
    nameLocalizations: { ko: "주가추이" },
    description: "원하는 키뮤 주식의 가격을 조회할 수 있어요!",
  })
  async priceTrend(
    i: ChatInputCommandInteraction,
    @option({
      type: ApplicationCommandOptionType.String,
      choices: itemChoice,
      name: "item",
      name_localizations: { ko: "종목" },
      description: "확인할 종목을 선택해주세요!",
      required: true,
    })
    item: StockType
  ) {
    const getGraph = async (priceData: PriceDocument[]) => {
      const chartJSNodeCanvas = new ChartJSNodeCanvas({
        width: 800,
        height: 300,
        backgroundColour: "#ffffff",
      })

      return chartJSNodeCanvas.renderToBuffer({
        type: "line",
        data: {
          datasets: [
            {
              // @ts-ignore
              data: priceData.map((p) => ({ x: p.createdAt, y: p.kimuSoft })),
              borderColor: "#586471",
              label: "키뮤소프트",
            },
            {
              // @ts-ignore
              data: priceData.map((p) => ({ x: p.createdAt, y: p.kimuNovel })),
              borderColor: "#4ac173",
              label: "키뮤노블",
            },
            {
              // @ts-ignore
              data: priceData.map((p) => ({ x: p.createdAt, y: p.kimuGames })),
              borderColor: "#e660be",
              label: "키뮤게임즈",
            },
            {
              // @ts-ignore
              data: priceData.map((p) => ({
                x: p.createdAt,
                y: p.kimuPictures,
              })),
              borderColor: "#f4ae35",
              label: "키뮤픽쳐즈",
            },
          ],
        },
        options: {
          scales: {
            x: {
              // @ts-ignore
              type: "time",
              // @ts-ignore
              min: priceData[priceData.length - 1].createdAt,
              // @ts-ignore
              max: priceData[0].createdAt,
              time: { unit: "minute", displayFormats: { hour: "HH:mm" } },
            },
          },
          backgroundColor: "#fff",
        },
      })
    }

    await i.deferReply()
    const priceData = await Price.find({}).sort({ createdAt: -1 }).limit(10)

    await i.editReply({
      content: codeBlock(
        "cs",
        dedent`
        최근 100분 간 ${item} 1주당 가격 추이
        --------------------------------
        ${priceData
          .map(
            (x) =>
              `${x.createdAt.toLocaleString()} : 💰 ${x[item].toLocaleString()}`
          )
          .join("\n")}
      `
      ),
      files: [await getGraph(priceData)],
    })
  }
}

export const setup = async () => {
  return new StockExtension()
}
