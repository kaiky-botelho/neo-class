import ApiService from "../apiService";
import type { AxiosResponse } from "axios";
import type { AlunoDTO } from "./type";

class AlunoService extends ApiService {
  constructor() {
    super("/api/alunos");
  }

  listarTodos(): Promise<AxiosResponse<AlunoDTO[]>> {
    return this.get<AlunoDTO[]>(""); 
   
  }

  salvar(aluno: AlunoDTO): Promise<AxiosResponse<AlunoDTO>> {
    return this.post<AlunoDTO>("", aluno);
  }

  editar(aluno: AlunoDTO): Promise<AxiosResponse<AlunoDTO>> {
    return this.put<AlunoDTO>(`/${aluno.id}`, aluno);
  }

deletar(id: number): Promise<AxiosResponse<void>> {
        return this.delete<void>(`/${id}`);
    }

  buscarPorId(id: number): Promise<AxiosResponse<AlunoDTO>> {
    return this.get<AlunoDTO>(`/${id}`);
  }
}

export default AlunoService;
