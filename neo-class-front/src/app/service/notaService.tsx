import ApiService from "../apiService";
import type { AxiosResponse } from "axios";
import type { NotaDTO } from "./type";

class NotaService extends ApiService {
  constructor() {
    super("/api/notas");
  }

  listarTodas(): Promise<AxiosResponse<NotaDTO[]>> {
    return this.get<NotaDTO[]>("");
  }

  salvar(nota: NotaDTO): Promise<AxiosResponse<NotaDTO>> {
    return this.post<NotaDTO>("", nota);
  }

  editar(nota: NotaDTO): Promise<AxiosResponse<NotaDTO>> {
    return this.put<NotaDTO>(`/${nota.id}`, nota);
  }

  deletar(id: number): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/${id}`);
  }

  buscarPorId(id: number): Promise<AxiosResponse<NotaDTO>> {
    return this.get<NotaDTO>(`/${id}`);
  }
}

export default NotaService;