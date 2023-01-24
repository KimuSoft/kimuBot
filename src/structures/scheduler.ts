import { Job, scheduleJob } from "node-schedule"
import { getPriceData, Price } from "../models/price"
import randomNormal from "random-normal"

export class Scheduler {
  Every10Minutes?: Job

  async start() {
    this.Every10Minutes = scheduleJob(
      // "*/10 * * * *",
      "*/10 * * * *",
      this.scheduleEvery10Minutes
    )
  }

  scheduleEvery10Minutes = async () => {
    console.log("every 10 minutes")
    const pd = await getPriceData()

    if (!pd) {
      const newPrice = new Price({
        kimuSoft: 500,
        kimuNovel: 50,
        kimuGames: 200,
        kimuPictures: 100,
      })
      await newPrice.save()
      return
    }

    const getRandomPrice = (price: number) => {
      if (!price) price = 100
      return Math.round(price * randomNormal({ mean: 1, dev: 0.2 }))
    }

    const newPrice = new Price({
      kimuSoft: getRandomPrice(pd?.kimuSoft),
      kimuNovel: getRandomPrice(pd?.kimuNovel),
      kimuGames: getRandomPrice(pd?.kimuGames),
      kimuPictures: getRandomPrice(pd?.kimuPictures),
    })

    await newPrice.save()
  }
}
