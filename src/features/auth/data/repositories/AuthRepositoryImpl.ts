import { AuthUser } from "../../domain/entities/AuthUser";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { AuthLocalDataSource } from "../datasources/AuthLocalDataSource";

export class AuthRepositoryImpl implements AuthRepository {
  private localDataSource: AuthLocalDataSource;

  constructor(localDataSource: AuthLocalDataSource) {
    this.localDataSource = localDataSource;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    return this.localDataSource.login(email, password);
  }

  async signup(email: string, password: string): Promise<AuthUser> {
    return this.localDataSource.signup(email, password);
  }

  async logout(): Promise<void> {
    return this.localDataSource.logout();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.localDataSource.getCurrentUser();
  }
}
