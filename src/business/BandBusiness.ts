import { BaseDatabase } from "../data/BaseDatabase";
import { InvalidInputError } from "../error/invalidInputError";
import { UnauthorizedError } from "../error/UnauthorizedError";
import { Band } from "../model/Band";
import { UserRole } from "../model/User";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class BandBusiness {
    constructor(private baseDatabase: BaseDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ){}

    async registerBand(input: BandInputDTO, token: string){
        const tokenData = this.authenticator.getData(token)
 
        if(tokenData.role !== UserRole.ADMIN){
          throw new UnauthorizedError("Only admins")
        }  
    }

    async getBandDetailByIdOrName(input:string): Promise<Band>{
        if(!input){
            throw new InvalidInputError("Invalid Input")
        }
        return this.baseDatabase.getBandByIdOrNameOrFail(input)
    }
}