import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthRemoteDataSourceImpl } from "../../data/datasources/AuthRemoteDataSourceImp";
import { AuthRepositoryImpl } from "../../data/repositories/AuthRepositoryImpl";

import { AuthUser } from "../../domain/entities/AuthUser";
import { GetCurrentUserUseCase } from "../../domain/usecases/GetCurrentUserUseCase";
import { LoginUseCase } from "../../domain/usecases/LoginUseCase";
import { LogoutUseCase } from "../../domain/usecases/LogoutUseCase";
import { SignupUseCase } from "../../domain/usecases/SignupUseCase";


const authRemoteDataSource = new AuthRemoteDataSourceImpl();
const repository = new AuthRepositoryImpl(authRemoteDataSource);

const loginUseCase = new LoginUseCase(repository);
const signupUseCase = new SignupUseCase(repository);
const logoutUseCase = new LogoutUseCase(repository);
const getCurrentUserUseCase = new GetCurrentUserUseCase(repository);

type AuthContextType = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getCurrentUserUseCase.execute().then((user) => {
      setUser(user);
      setIsLoggedIn(!!user);
    });


  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await loginUseCase.execute(email, password);
    setUser(loggedInUser);
    setIsLoggedIn(true);
  };

  const signup = async (email: string, password: string) => {
    const newUser = await signupUseCase.execute(email, password);
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await logoutUseCase.execute();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
