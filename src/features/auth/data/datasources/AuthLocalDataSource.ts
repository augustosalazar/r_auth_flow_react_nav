import { AuthUser } from "../../domain/entities/AuthUser";

type StoredUser = AuthUser & { password: string };

export class AuthLocalDataSource {
  private users: StoredUser[] = [
    { id: "1", email: "test@example.com", password: "123456" },
  ];
  private currentUser: AuthUser | null = null;

  async login(email: string, password: string): Promise<AuthUser> {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new Error("Invalid credentials");
    }
    this.currentUser = { id: user.id, email: user.email };
    return this.currentUser;
  }

  async signup(email: string, password: string): Promise<AuthUser> {
    const exists = this.users.some((u) => u.email === email);
    if (exists) {
      throw new Error("User already exists");
    }
    const newUser: StoredUser = {
      id: String(this.users.length + 1),
      email,
      password,
    };
    this.users.push(newUser);
    this.currentUser = { id: newUser.id, email: newUser.email };
    return this.currentUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.currentUser;
  }
}
