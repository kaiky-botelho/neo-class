import ApiService from "../apiService";
import type { AxiosResponse } from "axios";
import type { ProfessorDTO } from "./type";

class ProfessorService extends ApiService {
  constructor() {
    super("/api/professores");
  }

  loginProfessor(email: string, senha: any): Promise<AxiosResponse<ProfessorDTO>> {
    return this.post<ProfessorDTO>("/login/professor", { email, senha });
  }
  listarTods(): Promise<AxiosResponse<ProfessorDTO[]>>{
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