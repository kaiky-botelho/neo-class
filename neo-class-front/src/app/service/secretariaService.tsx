// src/services/SecretariaService.ts
import ApiService from "../apiService";

class SecretariaService extends ApiService {
    constructor() {
        super("/api");
    }

    login(email: string, senha: string): Promise<any> {
        // O backend espera "email" e "senha"
        return this.post("/login/secretaria", { email, senha });
    }
}

export default new SecretariaService();
