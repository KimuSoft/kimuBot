import { applicationCommand, Extension, listener } from "@pikokr/command.ts"
import {
  ApplicationCommandType,
  ChatInputCommandInteraction,
  Message,
  MessageActionRowComponentBuilder,
} from "discord.js"
import { ChartJSNodeCanvas } from "chartjs-node-canvas"
import "chartjs-adapter-moment"
import moment from "moment"

class DevExtension extends Extension {
  @listener({ event: "messageCreate" })
  async gum(msg: Message) {
    if (/[키뮤바보]{4}/.test(msg.content) && msg.deletable) {
      await msg.delete()
    }
  }

  generateCanva = async (labels: string[], datasets: number[]) => {
    const renderer = new ChartJSNodeCanvas({ width: 800, height: 300 })
    return renderer.renderToBuffer({
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "test",
            data: datasets,
          },
        ],
      },
    })
  }

  @applicationCommand({
    name: "ping",
    nameLocalizations: { ko: "핑" },
    type: ApplicationCommandType.ChatInput,
    description: "wow this is ping",
  })
  async ping(i: ChatInputCommandInteraction) {
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 300 })

    const image = await chartJSNodeCanvas.renderToBuffer({
      type: "line",
      data: {
        labels: ["까", "꿍"],
        datasets: [
          {
            data: [
              {
                // @ts-ignore
                x: moment("20211001"),
                y: 10,
              },
              {
                // @ts-ignore
                x: moment("20211002"),
                y: 20,
              },
            ],
          },
        ],
      },
      options: {
        scales: { x: { type: "time", time: { unit: "day" } } },
        backgroundColor: "#fff",
      },
    })

    await i.reply({
      files: [image],
    })
    // await i.reply(`current ping: ${i.client.ws.ping}ms`)
  }
}

export const setup = async () => {
  return new DevExtension()
}
