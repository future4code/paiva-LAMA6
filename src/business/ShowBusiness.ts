import { BandDatabase } from "../data/BandDatabase";
import { ShowDataBase } from "../data/ShowDatabase";
import { InvalidInputError } from "../error/invalidInputError";
import { NotFoundError } from "../error/NotFoundError";
import { UnauthorizedError } from "../error/UnauthorizedError";
import { Show, ShowInputDTO, WeekDay } from "../model/Show";
import { UserRole } from "../model/User";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class ShowBusiness {
    constructor(
        private showDatabase: ShowDataBase,
        private bandDatabase: BandDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ){}

    async createShow(input: ShowInputDTO, token: string){
       const tokenData = this.authenticator.getData(token)
       if(tokenData.role !== UserRole.ADMIN){
          throw new UnauthorizedError("Only admins")
       }

       if(!input.bandId || !input.weekDay || !input.startTime || !input.endTime){
           throw new InvalidInputError("Invalid input")
       }

       if(input.startTime < 8 || input.endTime > 23 || input.startTime >= input.endTime){
           throw new InvalidInputError("Invalid time")
       }

       if(Number.isInteger(input.startTime) || Number.isInteger(input.endTime)){
           throw new InvalidInputError("Time shoud be integer")
       }

       const band = await this.bandDatabase.getBandByIdOrNameOrFail(input.bandId)

       if(!band){
           throw new NotFoundError("Band not found")
       }

       const registeredShows = await this.showDatabase.getShowsByTimes(input.weekDay, input.startTime,input.endTime)
    
       if(registeredShows.length){
           throw new InvalidInputError("No more shows can be registered")
       }

       await this.showDatabase.createShow(
           Show.toShow({
               ...input,
               id: this.idGenerator.generate()
           })
       )
    }

    async getShowByWeekDay(weekDay: WeekDay){
       if(!weekDay){
           throw new InvalidInputError("Invalid input to getShowByWeekDay")
       }

       const shows = await this.showDatabase.getShowByWeekDayOrFail(weekDay)

       return {result: shows}
    }
}