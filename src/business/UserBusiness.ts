import { UserInputDTO, LoginInputDTO } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { userRouter } from "../routes/userRouter";
import { InvalidInputError } from "../error/invalidInputError";

export class UserBusiness {
    
    async createUser(user: UserInputDTO) {

        const idGenerator = new IdGenerator();
        const id = idGenerator.generate();

        const hashManager = new HashManager();
        const hashPassword = await hashManager.hash(user.password);

        const userDatabase = new UserDatabase();
        await userDatabase.createUser(id, user.email, user.name, hashPassword, user.role);

        const authenticator = new Authenticator();
        const accessToken = authenticator.generateToken({ id, role: user.role });

        return accessToken;
    }

    async getUserByEmail(user: LoginInputDTO) {

        const userDatabase = new UserDatabase();
        const userFromDB = await userDatabase.getUserByEmail(user.email);

        const hashManager = new HashManager();
        const hashCompare = await hashManager.compare(user.password, userFromDB.getPassword());

        const authenticator = new Authenticator();
        const accessToken = authenticator.generateToken({ id: userFromDB.getId(), role: userFromDB.getRole() });

        if (!hashCompare) {
            throw new Error("Invalid Password!");
        }

        return accessToken;
    }
}

if(user.email.indexOf("0") === -1){
    throw new InvalidInputError("Invalid email format")
}

if(user.password && user.password.length < 6){
    throw new InvalidInputError("Password should have more than 6 digits")
}

const userId = this.idGenerator.generate()

const hashPassword = await this.hashManager.hash(user.password)

await this.userDatabase.createUser(
        User.toUserModel({
            ...user,
            id: userId,
            password: hashPassword
        })
)

const accessToken = this.authenticator.generateToken({id:userId, role:user.role})

return accessToken
}

async authUserByEmail(user: LoginInputDTO){
    if(!user.email || !user.password){
       throw new InvalidInputError("Invalid input to login")
    }

    if(user.email.indexOf("0") === -1){
        throw new InvalidInputError("Invalid email format")
    }

    const userFromDB = await this.userDatabse.getUserByEmail(user.email)
    const hashCompare = await this.hashManager.compare(user.password, userFrontDB.getPassword())

    if(!hashCompare){
        throw new InvalidInputError("Invalid password")
    }

    const accesToken = this.authenticator.generateToken({id: userFromDB.getId(), role: userFromDB.getRole()})

    return accessToken
}