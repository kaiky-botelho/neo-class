import ApiService from "../apiService";
import type { AxiosResponse } from "axios";
import type { MateriaDTO } from "./type";

class MateriaService extends ApiService {
  constructor() {
    super("/api/materias");
  }

  listarTodos(): Promise<AxiosResponse<MateriaDTO[]>> {
    return this.get<MateriaDTO[]>("");
  }

  salvar(materia: MateriaDTO): Promise<AxiosResponse<MateriaDTO>> {
    return this.post<MateriaDTO>("", materia);
  }

  editar(materia: MateriaDTO): Promise<AxiosResponse<MateriaDTO>> {
    return this.put<MateriaDTO>(`/${materia.id}`, materia);
  }

  deletar(id: number): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/${id}`);
  }

  buscarPorId(id: number): Promise<AxiosResponse<MateriaDTO>> {
    return this.get<MateriaDTO>(`/${id}`);
  }
}

export default MateriaService;