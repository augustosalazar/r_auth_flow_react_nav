import { ILocalPreferences } from "@/src/core/iLocalPreferences";
import { AuthUser } from "../../domain/entities/AuthUser";
import { IAuthDataSource } from "./iAuthDataSource";



export class AuthPrefsDataSource implements IAuthDataSource {
    constructor(private localPreferences: ILocalPreferences) {}
    
    login(email: string, password: string): Promise<AuthUser> {
        throw new Error("Method not implemented.");
    }
    signup(email: string, password: string): Promise<AuthUser> {
        throw new Error("Method not implemented.");
    }
    logout(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getCurrentUser(): Promise<AuthUser | null> {
        throw new Error("Method not implemented.");
    }

}