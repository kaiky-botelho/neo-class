// src/main/java/com/neoclass/service/FrequenciaService.java
package com.neoclass.service;

import com.neoclass.dto.FaltaDTO;
import com.neoclass.model.Materia;
import com.neoclass.model.Frequencia;
import com.neoclass.repository.FrequenciaRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FrequenciaService implements CrudService<Frequencia, Long> {

    private final FrequenciaRepository frequenciaRepo;
    private final MateriaService       materiaService;

    public FrequenciaService(
            FrequenciaRepository frequenciaRepo,
            MateriaService materiaService
    ) {
        this.frequenciaRepo = frequenciaRepo;
        this.materiaService = materiaService;
    }

    @Override
    public List<Frequencia> listarTodos() {
        return frequenciaRepo.findAll();
    }

    @Override
    public Frequencia buscarPorId(Long id) {
        return frequenciaRepo.findById(id).orElseThrow();
    }

    @Override
    public Frequencia salvar(Frequencia f) {
        return frequenciaRepo.save(f);
    }

    @Override
    public void excluir(Long id) {
        frequenciaRepo.deleteById(id);
    }

    /**
     * Retorna lista de FaltaDTO para cada matéria em que o aluno esteja ausente.
     * O processo:
     *  1) countFaltasPorMateria(...) → List<Object[]> (matiad, totalFaltas)
     *  2) Para cada linha, faz buscarPorId(materiaId) para obter o nome
     *  3) Empacota FaltaDTO(materiaId, materiaNome, totalFaltas)
     */
    public List<FaltaDTO> listarFaltasPorAluno(Long alunoId) {
        List<Object[]> agrupado = frequenciaRepo.countFaltasPorMateria(alunoId);
        List<FaltaDTO> resultado = new ArrayList<>();

        for (Object[] linha : agrupado) {
            // Cada linha: [0] = materiaId (Long), [1] = totalFaltas (Long)
            Long materiaId   = (Long) linha[0];
            Long totalFaltas = (Long) linha[1];

            // Carrega o objeto Materia para pegar o nome
            Materia m = materiaService.buscarPorId(materiaId);
            String materiaNome = m.getNome();

            // Monta o DTO
            FaltaDTO dto = new FaltaDTO(materiaId, materiaNome, totalFaltas);
            resultado.add(dto);
        }

        return resultado;
    }
}
