import ApiService from "../apiService";
import type { AxiosResponse } from "axios";

export type TurmaDTO = {
  id: number;
  nome: string;
  serie: string;
  turno: string;
};

class TurmaService extends ApiService {
  constructor() {
    super("/api/turmas");
  }

  listarTodos(): Promise<AxiosResponse<TurmaDTO[]>> {
    return this.get<TurmaDTO[]>(""); 
  }

  buscarPorId(id: number): Promise<AxiosResponse<TurmaDTO>> {
    return this.get<TurmaDTO>(`/${id}`);
  }

  salvar(turma: TurmaDTO): Promise<AxiosResponse<TurmaDTO>> {
    return this.post<TurmaDTO>("", turma);
  }

  editar(turma: TurmaDTO): Promise<AxiosResponse<TurmaDTO>> {
    return this.put<TurmaDTO>(`/${turma.id}`, turma);
  }

  excluir(id: number): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/${id}`);
  }
}

export default TurmaService;
