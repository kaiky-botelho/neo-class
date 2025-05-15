import axios, { AxiosInstance } from "axios";

type TurmaDTO = {
  id: number;
  nome: string;
  serie: string;
  turno: string;
};


export default class TurmaService {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: "http://localhost:8080/api", // ajuste para sua URL base da API
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  listarTodos() {
    return this.http.get<TurmaDTO[]>("/turmas");
  }

  // Se precisar, pode adicionar mais métodos aqui, ex:
  // buscarPorId(id: number) { return this.http.get<TurmaDTO>(`/turmas/${id}`); }
  // salvar(turma: TurmaDTO) { return this.http.post("/turmas", turma); }
  // editar(turma: TurmaDTO) { return this.http.put(`/turmas/${turma.id}`, turma); }
  // excluir(id: number) { return this.http.delete(`/turmas/${id}`); }
}
