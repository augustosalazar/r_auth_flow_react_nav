import { AuthUser } from "../../domain/entities/AuthUser";
import { IAuthDataSource } from "./iAuthDataSource";

type StoredUser = AuthUser & { password: string };

export class AuthLocalDataSource implements IAuthDataSource {
  private users: StoredUser[] = [
    { email: "test@example.com", password: "123456" },
  ];
  private currentUser: AuthUser | null = null;


  async login(email: string, password: string): Promise<AuthUser> {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new Error("Invalid credentials");
    }
    this.currentUser = { email: user.email, password: user.password };
    return this.currentUser;
  }

  async signup(email: string, password: string): Promise<AuthUser> {
    const exists = this.users.some((u) => u.email === email);
    if (exists) {
      throw new Error("User already exists");
    }
    const newUser: StoredUser = {
      email,
      password,
    };
    this.users.push(newUser);
    this.currentUser = { email: newUser.email, password: newUser.password };
    return this.currentUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.currentUser;
  }
}
