import { ILocalPreferences } from "@/src/core/iLocalPreferences";
import { AuthUser } from "../../domain/entities/AuthUser";
import { IAuthDataSource } from "./iAuthDataSource";

export class AuthPrefsDataSource implements IAuthDataSource {
    constructor(private localPreferences: ILocalPreferences) {}

    async login(email: string, password: string): Promise<AuthUser> {
        const listOfUsers: AuthUser[] =  await this.localPreferences.getAllEntries("users");
        console.log("listOfUsers", listOfUsers);
        for (const user of listOfUsers) {

            if (user.email === email && user.password === password) {
                const authUser: AuthUser = { email: user.email, password: user.password };
                this.localPreferences.storeData("currentUser", JSON.stringify(authUser));
                return Promise.resolve(authUser);
            }
        }
        return Promise.reject(new Error("Invalid credentials"));
    }
    async signup(email: string, password: string): Promise<AuthUser> {
        const newUser: AuthUser = { email, password };
        await this.localPreferences.storeEntry<AuthUser>("users", newUser);
        this.localPreferences.storeData<AuthUser>("currentUser", newUser);
        return Promise.resolve(newUser);
    }
    async logout(): Promise<void> {
        await this.localPreferences.removeData("currentUser");
    }
    async getCurrentUser(): Promise<AuthUser | null> {
        const user = await this.localPreferences.retrieveData<AuthUser>("currentUser");
        return user ? user : null;
    }

}