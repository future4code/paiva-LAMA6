import express from "express"
import { BandController } from "../controller/BandController"

export const bandRouter = express.Router()

const bandController = new BandController()

bandRouter.put("/register", bandController.registerBand)
bandRouter.get("/get-details", bandController.getBandDetail)