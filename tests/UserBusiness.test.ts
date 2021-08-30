import { UserBusiness } from "../src/business/UserBusiness";
import { NotFoundError } from "../src/error/NotFoundError";
import { LoginInputDTO, User, UserInputDTO, UserRole } from "../src/model/User";

const userDatabase = {
    createUser: jest.fn(async (user: User)=>{})
    getUserByEmail: jest.fn((email: string)=> {
        if(email === "teste@email.com"){
            return User.toUserModel({
                id: "id_usuario",
                name: "nome_usuario",
                email,
                password: "123456",
                userRole: UserRole.ADMIN
            })
        } else{
            throw new NotFoundError(`UNableto found user with email:${email}`)
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
    generate: jest.fn(()=> "backend")
}
const hashManager = {
    hash: jest.fn((password: string)=>"LABENU_SECRET_PASS_HASH"),
    compare: jest.fn((text:string, hash: string)=> text === "123123" ? true: false)
}

const userBusiness = new UserBusiness(
    userDatabase as any,
    idGenerator as any,
    hashManager as any,
    authenticator as any
)

describe("SignUp Test Flow", ()=>{
    test("Should return error when wrong email format", async()=>{
        expect.assertions(2)

        const user = {
            email: "emailteste.com",
            name: "Labenu",
            password: "123123",
            role:"NORMAL"
        } as UserInputDTO

        try {
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("Invalid email")
            expect(error.code).toBe(417)
        }
    })

    test("Should return error when wrong role", async()=>{
        expect.assertions(1)
        
        const user = {
            email: "email@teste.com",
            name: "Labenu",
            password: "123123",
            role:"CLIENT"
        } as UserInputDTO

        try {
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("Invalid role")           
        }
    })

    test("Should return error when wrong password", async()=>{
        expect.assertions(2)
        
        const user = {
            email: "email@teste.com",
            name: "Labenu",
            password: "123",
            role:"NORMAL"
        } as UserInputDTO

        try {
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("Invalid password, it should have 6 digits")  
            expect(error.code).toBe(417)         
        }
    })

    test("Should return error when no password", async()=>{
        expect.assertions(2)
        
        const user = {
            email: "email@teste.com",
            name: "Labenu",       
            role:"NORMAL"
        } as UserInputDTO

        try {
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("Invalid input")  
            expect(error.code).toBe(417)         
        }
    })

    test("Should return error when no role", async()=>{
        expect.assertions(2)
        
        const user = {
            email: "email@teste.com",
            name: "Labenu", 
            password: "123123"         
        } as UserInputDTO

        try {
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("Invalid input")  
            expect(error.code).toBe(417)         
        }
    })

    test("Should return error when no email", async()=>{
        expect.assertions(2)
        
        const user = {           
            name: "Labenu", 
            password: "123123",   
            role:"NORMAL"
        } as UserInputDTO

        try {
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("Invalid input")  
            expect(error.code).toBe(417)         
        }
    })
    test("Should return token", async()=>{
        expect.assertions(1)
        
        const user = {   
            email: "email@teste.com",        
            name: "Labenu", 
            password: "123123",   
            role:"NORMAL"
        } as UserInputDTO

          const result = await userBusiness.createUser(user)
          expect(result).toBe("token_something")      
    })
})

describe("SignIn Test Flow", () => {
    test("Should return an error when no user linked to email", async()=> {
        expect.assertions(2)

        const userlogin = {
           email: "email@email.com",
           password: "123123"           
        } as LoginInputDTO

        try {
          await userBusiness.authUserByEmail(login)  
        } catch (error) {
            expect(error.message).toBe(`Unable to found user with email: ${login.email}`)
            expect(error.code).toBe(404)
        }
    })

    test("Should return an error when wrong password", async()=> {
        expect.assertions(2)

        const userlogin = {
           email: "teste@email.com",
           password: "123456"           
        } as LoginInputDTO

        try {
          await userBusiness.authUserByEmail(login)  
        } catch (error) {
            expect(error.message).toBe("Invalid password")
            expect(error.code).toBe(417)
        }
    })

    test("Should return an error when no password", async()=> {
        expect.assertions(2)

        const userlogin = {
           email: "teste@email.com"                  
        } as LoginInputDTO

        try {
          await userBusiness.authUserByEmail(login)  
        } catch (error) {
            expect(error.message).toBe("Invalid input")
            expect(error.code).toBe(417)
        }
    })

    test("Should return an error when no email", async()=> {
        expect.assertions(2)

        const userlogin = {
            password: "123456"                         
        } as LoginInputDTO

        try {
          await userBusiness.authUserByEmail(login)  
        } catch (error) {
            expect(error.message).toBe("Invalid input")
            expect(error.code).toBe(417)
        }
    })

    test("Should return an acces token", async()=>{
        expect.assertions(1)

        const userLogin ={
            email:"teste@email.com",
            password: "123123",
        } as LoginInputDTO

        const result = await UserBusiness.authUserByEmail(userLogin)
        expect(result)
    })
})