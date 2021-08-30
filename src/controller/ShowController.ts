import { Request, Response } from "express";
import { ShowBusiness } from "../business/ShowBusiness";
import { BandDatabase } from "../data/BandDatabase";
import { BaseDatabase } from "../data/BaseDatabase";
import { ShowDataBase } from "../data/ShowDatabase";
import { Show, ShowInputDTO } from "../model/Show";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class ShowController{
    async createShow(req:Request, res:Response){
        try {
          const weekDay = Show.toWeekDayEnum(req.body.weekDay)
          
          const input: ShowInputDTO = {
              weekDay,
              bandId: req.body.bandId,
              startTime: req.body.startTime,
              endTime: req.body.endTime
          }
          const showBusiness = new ShowBusiness(
              new ShowDataBase,
              new BandDatabase,
              new IdGenerator,
              new Authenticator
          )

          await showBusiness.createShow(input, req.headers.authorization as string)
          
          res.sendStatus(200)

        } catch (error) {
            res.status(error.customErrorCode || 400).send({
                message: error.message,
            })
        } finally{
            await BaseDatabase.destroyConnection()
        }            
    }

    async getShowsByWeekDay(req:Request, res: Response){
        try {
            const weekDay = Show.toWeekDayEnum(req.query.weekDay as string)

            const showBusiness = new ShowBusiness(
                new ShowDataBase,
                new BandDatabase,
                new IdGenerator,
                new Authenticator
            )

            const shows = await showBusiness.getShowByWeekDay(weekDay)
            
            res.status(200).send({shows})

        } catch (error) {
            res.status(error.customErrorCode || 400).send({
                message: error.message,
            })
        }finally{
            await BandDatabase.destroyConnection()
        }
    }

}
