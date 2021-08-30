import { BandBusiness } from "../src/business/BandBusiness";
import { NotFoundError } from "../src/error/NotFoundError";
import { Band, BaseInputDTO } from "../src/model/Band";
import {UserRole} from "../src/model/User";

const bandDatabase = {
   createBand: jest.fn(async(band:Band)=>{}),
   getBandByIdOrNameOrFail: jest.fn((input:string)=>{
      if(input === "idValido" || input === "nomeValido"){
          return{
              id: "idBanda",
              name: "Darkblue",
              mainGenre: "Jazz",
              responsible: "Jane"
          }
      }else{
          throw new NotFoundError(`Unable to found band with input:${input}`)
      }
   })
}
const authenticator = {
    generateToken: jest.fn((payload:{id:string, role:UserRole}) => "token_something"),
    getData: jest.fn((token: string)=>{
        switch(token){
            case "userToken":
                return {id: "id_do_token", role: "NORMAL"}
            case "adminToken":
                return {id: "id_do_token", role: "ADMIN"}  
            default:
                return undefined    
        }      
    })
}

const idGenerator = {
    generate: jest.fn(()=> "idBanda")
}

const bandBusiness = new BandBusiness(
    bandDatabase as any,
    idGenerator as any,
    authenticator as any
)

describe("RegisterBand Test Flow", () => {
    test("Should return an error when no name", async()=>{
        expect.assertions(2)

        const token = "adminToken"
        const band = {
           mainGenre: "Jazz",
           responsible: "Jane"
        } as BaseInputDTO

        try {
            await bandBusiness.registerBand(band,token)
        } catch (error) {
            expect(error.message.toBe("Invalid input"))
            expect(error.code.toBe(417))
        }
    })

    test("Should return an error when no main genre", async()=>{
        expect.assertions(2)

        const token = "adminToken"
        const band = {
           name: "Banda Sei Lá",         
           responsible: "June"
        } as BaseInputDTO

        try {
            await bandBusiness.registerBand(band,token)
        } catch (error) {
            expect(error.message.toBe("Invalid input"))
            expect(error.code.toBe(417))
        }
    })

    test("Should return an error when no responsible", async()=>{
        expect.assertions(2)

        const token = "adminToken"
        const band = {
           name:"Okey",
           mainGenre: "Jazz"           
        } as BaseInputDTO

        try {
            await bandBusiness.registerBand(band,token)
        } catch (error) {
            expect(error.message.toBe("Invalid input"))
            expect(error.code.toBe(417))
        }
    })

    test("Should return name when is not an admin", async()=>{
        expect.assertions(2)

        const token = "userToken"
        const band = {
           name:"Okey",
           mainGenre: "Blues"           
        } as BaseInputDTO

        try {
            await bandBusiness.registerBand(band,token)
        } catch (error) {
            expect(error.message.toBe("Only users"))
            expect(error.code.toBe(402))
        }
    })
    test("Shouls register a band", async()=>{
        expect.assertions(1)

        const token = "adminToken"
        const band = {
           name:"Okey",
           mainGenre: "Blues"           
        } as BaseInputDTO

        await bandBusiness.registerBand(band, token)

        expect(bandDatabase.createBand).toHaveBeenCalledWith({
            "id": "idBanda",
            "name": "Okey",
            "mainGenre": "Jazz",
            "responsible": "Jane"
        })
    })
})

describe("GetBandDetail Test Flow", ()=>{
    test("Should return error when no input", async()=>{
        expect.assertions(2)

        const input = ""

        try {
            await bandBusiness.getBandDetailByIdOrName(input)
        } catch (error) {
            expect((error.message).toBe("Invalid input"))
            expect((error.code).toBe(417))
        }
    })

    test("Should return error when no input", async()=>{
        expect.assertions(2)

        const input = "Qualquer coisa inválida"

        try {
            await bandBusiness.getBandDetailByIdOrName(input)
        } catch (error) {
            expect((error.message).toBe("Invalid inputUnable to found the band"))
            expect((error.code).toBe(417))
        }
    })

    test("Should return band when valid id", async()=>{
        expect.assertions(1)

        const input= "idValido"

        const result = await bandBusiness.getBandDetailByIdOrName(input)
        expect(result.getId()).toBe("idBanda")
        expect(result.getName()).toBe("DarkBlue")
        expect(result.getMainGenre()).toBe("Jazz")
        expect(result.getResponsible()).toBe("Junior")        
    })
})