import { User } from "discord.js"
import { MuUserDocument } from "../types/muUser.type"
import { MuUser } from "../models/muUser"

declare module "discord.js" {
  interface User {
    getMuUser(): Promise<MuUserDocument>
  }
}

User.prototype.getMuUser = async function () {
  let user = await MuUser.findOne({ id: this.id })
  if (!user) {
    user = new MuUser({
      id: this.id,
      name: this.username,
    })
    await user.save()
  }
  user.name = this.username
  return user
}
