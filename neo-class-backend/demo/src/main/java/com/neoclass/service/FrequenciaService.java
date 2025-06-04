// src/main/java/com/neoclass/service/FrequenciaService.java
package com.neoclass.service;

import com.neoclass.dto.FaltaDTO;
import com.neoclass.model.Frequencia;
import com.neoclass.repository.FrequenciaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FrequenciaService {

    private final FrequenciaRepository repo;

    public FrequenciaService(FrequenciaRepository repo) {
        this.repo = repo;
    }

    // CRUD genérico (se você quiser manter, pois implementava CrudService)
    public List<Frequencia> listarTodos() {
        return repo.findAll();
    }

    public Frequencia buscarPorId(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public Frequencia salvar(Frequencia f) {
        return repo.save(f);
    }

    public void excluir(Long id) {
        repo.deleteById(id);
    }

    // ——— NOVO MÉTODO para faltas agrupadas por matéria ———
    public List<FaltaDTO> listarFaltasPorAluno(Long alunoId) {
        return repo.findTotalFaltasPorMateriaDoAluno(alunoId);
    }
}
