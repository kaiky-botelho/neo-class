// src/app/service/loginService.ts
import ApiService from "../apiService";
import type { AxiosResponse } from "axios";

class LoginService extends ApiService {
  constructor() {
    super("/api/login"); // Sem basePath, pois o login está fora das rotas de "professor" e "secretaria"
  }

  loginProfessor(email: string, senha: any): Promise<AxiosResponse<any>> {
    return this.post<any>("/professor", { email, senha });
  }

  loginSecretaria(email: string, senha: any): Promise<AxiosResponse<any>> {
    return this.post<any>("/secretaria", { email, senha });
  }
}

export default LoginService;
