// src/app/service/professorService.ts
import ApiService from "../apiService";
import type { AxiosResponse } from "axios";
import type { ProfessorDTO } from "./type";

class ProfessorService extends ApiService {
  constructor() {
    super("/api/professores");
  }

  // Login: resposta sem tipagem forte (any)
  loginProfessor(email: string, senha: any): Promise<AxiosResponse<any>> {
    return this.post<any>("/login/professor", { email, senha });
  }

  listarTodos(): Promise<AxiosResponse<ProfessorDTO[]>> {
    return this.get<ProfessorDTO[]>("");
  }

  salvar(professor: ProfessorDTO): Promise<AxiosResponse<ProfessorDTO>> {
    return this.post<ProfessorDTO>("", professor);
  }

  editar(professor: ProfessorDTO): Promise<AxiosResponse<ProfessorDTO>> {
    return this.put<ProfessorDTO>(`/${professor.id}`, professor);
  }

  deletar(id: number): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/${id}`);
  }

  buscarPorId(id: number): Promise<AxiosResponse<ProfessorDTO>> {
    return this.get<ProfessorDTO>(`/${id}`);
  }
}

export default ProfessorService;
