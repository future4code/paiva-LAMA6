import { BaseDatabase } from "../data/BaseDatabase";
import { UnauthorizedError } from "../error/UnauthorizedError";
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
}