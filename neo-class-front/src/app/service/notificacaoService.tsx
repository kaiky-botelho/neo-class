import ApiService from "../apiService";
import type { AxiosResponse } from "axios";
import type { RespostaDTO, NotificacaoDTO } from "./type";

class NotificacaoService extends ApiService {
    constructor() {
        super("/api/notificacoes");
    }

    listarTodas(): Promise<AxiosResponse<NotificacaoDTO[]>> {
        return this.get<NotificacaoDTO[]>("");
    }

    listarPendentes(): Promise<AxiosResponse<NotificacaoDTO[]>> {
        return this.get<NotificacaoDTO[]>("/pendentes");
    }

    salvar(notificacao: NotificacaoDTO): Promise<AxiosResponse<NotificacaoDTO>> {
        return this.post<NotificacaoDTO>("", notificacao);
    }

    responder(
        id: number,
        payload: RespostaDTO
    ): Promise<AxiosResponse<NotificacaoDTO>> {
        return this.put<NotificacaoDTO>(`/${id}/responder`, payload);
    }

    buscarPorId(id: number): Promise<AxiosResponse<NotificacaoDTO>> {
        return this.get<NotificacaoDTO>(`/${id}`);
    }
}

export default NotificacaoService;