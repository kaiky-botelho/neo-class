import ApiService from "../apiService";
import type { AxiosResponse } from "axios";
import type { FrequenciaDTO } from "./type";

class FrequenciaService extends ApiService {
  constructor() {
    super("/api/frequencias");
  }

  listarTodos(): Promise<AxiosResponse<FrequenciaDTO[]>> {
    return this.get<FrequenciaDTO[]>("");
  }

  salvar(frequencia: FrequenciaDTO): Promise<AxiosResponse<FrequenciaDTO>> {
    return this.post<FrequenciaDTO>("", frequencia);
  }

  editar(frequencia: FrequenciaDTO): Promise<AxiosResponse<FrequenciaDTO>> {
    return this.put<FrequenciaDTO>(`/${frequencia.id}`, frequencia);
  }

  deletar(id: number): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/${id}`);
  }

  buscarPorId(id: number): Promise<AxiosResponse<FrequenciaDTO>> {
    return this.get<FrequenciaDTO>(`/${id}`);
  }
}

export default FrequenciaService;