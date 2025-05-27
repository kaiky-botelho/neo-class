import ApiService from "../apiService";
import type { AxiosResponse } from "axios";
import { TrabalhoDTO } from "./type"

class TrabalhoService extends ApiService {
    constructor() {
        super("/api/trabalhos");
    }
    
    listarTodos(): Promise<AxiosResponse<TrabalhoDTO[]>> {
        return this.get<TrabalhoDTO[]>("");
    }
    
    salvar(trabalho: TrabalhoDTO): Promise<AxiosResponse<TrabalhoDTO>> {
        return this.post<TrabalhoDTO>("", trabalho);
    }
    
    editar(trabalho: TrabalhoDTO): Promise<AxiosResponse<TrabalhoDTO>> {
        return this.put<TrabalhoDTO>(`/${trabalho.id}`, trabalho);
    }
    
    deletar(id: number): Promise<AxiosResponse<void>> {
        return this.delete<void>(`/${id}`);
    }
    
    buscarPorId(id: number): Promise<AxiosResponse<TrabalhoDTO>> {
        return this.get<TrabalhoDTO>(`/${id}`);
    }
    }

    export default TrabalhoService;