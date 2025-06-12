import ApiService from "../apiService";
import type { AxiosResponse } from "axios";
import type { ProvaDTO } from "./type";

class ProvaService extends ApiService {
  constructor() {
    super("/api/provas");
  }

  listarTodas(): Promise<AxiosResponse<ProvaDTO[]>> {
    return this.get<ProvaDTO[]>("");
  }

  salvar(prova: ProvaDTO): Promise<AxiosResponse<ProvaDTO>> {
    return this.post<ProvaDTO>("", prova);
  }

  editar(prova: ProvaDTO): Promise<AxiosResponse<ProvaDTO>> {
    return this.put<ProvaDTO>(`/${prova.id}`, prova);
  }

  deletar(id: number): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/${id}`);
  }

  buscarPorId(id: number): Promise<AxiosResponse<ProvaDTO>> {
    return this.get<ProvaDTO>(`/${id}`);
  }
}

export default ProvaService;
