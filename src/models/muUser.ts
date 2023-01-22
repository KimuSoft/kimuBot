import { Schema } from "mongoose"
import { IMuUser, IMuUserMethods, MuUserModel } from "../types/muUser.type"
import * as mongoose from "mongoose"

const schema = new Schema<IMuUser, MuUserModel, IMuUserMethods>({
  id: { type: "String", required: true, unique: true },
  name: { type: "String", required: true },
  atriumExp: { type: "Number", required: true, default: 0 },
  atelierExp: { type: "Number", required: true, default: 0 },
  streamingExp: { type: "Number", required: true, default: 0 },
  playgroundExp: { type: "Number", required: true, default: 0 },
  labExp: { type: "Number", required: true, default: 0 },
  artCoupon: { type: "Number", required: true, default: 0 },
  point: { type: "Number", required: true, default: 0 },
})

schema.methods.getIntegratedExp = function () {
  return (
    this.atelierExp +
    this.atriumExp +
    this.streamingExp +
    this.playgroundExp +
    this.labExp
  )
}

schema.methods.getLevel = function () {
  return Math.ceil(this.getIntegratedExp() ** 0.2)
}

export const MuUser = mongoose.model<IMuUser, MuUserModel>("muUser", schema)
