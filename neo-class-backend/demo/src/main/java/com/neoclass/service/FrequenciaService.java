// src/main/java/com/neoclass/service/FrequenciaService.java
package com.neoclass.service;

import com.neoclass.dto.FaltaDTO;
import com.neoclass.dto.FrequenciaDTO;
import com.neoclass.model.Aluno;
import com.neoclass.model.Frequencia;
import com.neoclass.model.Materia;
import com.neoclass.model.Turma;
import com.neoclass.repository.AlunoRepository;
import com.neoclass.repository.FrequenciaRepository;
import com.neoclass.repository.MateriaRepository;
import com.neoclass.repository.TurmaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FrequenciaService {

    private final FrequenciaRepository frequenciaRepo;
    private final AlunoRepository      alunoRepo;
    private final TurmaRepository      turmaRepo;
    private final MateriaRepository    materiaRepo;

    public FrequenciaService(
            FrequenciaRepository frequenciaRepo,
            AlunoRepository      alunoRepo,
            TurmaRepository      turmaRepo,
            MateriaRepository    materiaRepo
    ) {
        this.frequenciaRepo = frequenciaRepo;
        this.alunoRepo      = alunoRepo;
        this.turmaRepo      = turmaRepo;
        this.materiaRepo    = materiaRepo;
    }

    /**
     * Lista todas as frequências (faltas e presenças).
     */
    public List<Frequencia> listarTodos() {
        return frequenciaRepo.findAll();
    }

    /**
     * Busca uma frequência específica pelo ID.
     */
    public Frequencia buscarPorId(Long id) {
        return frequenciaRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Frequência não encontrada com id: " + id));
    }

    /**
     * Lista lista de FaltaDTO (agrupado por matéria) para um determinado aluno.
     */
    public List<FaltaDTO> listarFaltasPorAluno(Long alunoId) {
        return frequenciaRepo.findTotalFaltasPorMateriaDoAluno(alunoId);
    }

    /**
     * Cria uma nova frequência a partir do DTO:
     * 1) Carrega Aluno, Turma e Matéria pelo ID
     * 2) Monta objeto Frequencia e salva no banco
     */
    public Frequencia criarFrequencia(FrequenciaDTO dto) {
        Aluno aluno = alunoRepo.findById(dto.getAlunoId())
                        .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado: " + dto.getAlunoId()));

        Turma turma = turmaRepo.findById(dto.getTurmaId())
                        .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada: " + dto.getTurmaId()));

        Materia materia = materiaRepo.findById(dto.getMateriaId())
                        .orElseThrow(() -> new IllegalArgumentException("Matéria não encontrada: " + dto.getMateriaId()));

        Frequencia freq = new Frequencia();
        freq.setData(dto.getData());
        freq.setPresente(dto.getPresente());
        freq.setAluno(aluno);
        freq.setTurma(turma);
        freq.setMateria(materia);

        return frequenciaRepo.save(freq);
    }

    /**
     * Atualiza uma frequência existente, substituindo todos os campos.
     */
    public Frequencia atualizarFrequencia(Long id, FrequenciaDTO dto) {
        Frequencia existente = buscarPorId(id);

        Aluno aluno = alunoRepo.findById(dto.getAlunoId())
                        .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado: " + dto.getAlunoId()));

        Turma turma = turmaRepo.findById(dto.getTurmaId())
                        .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada: " + dto.getTurmaId()));

        Materia materia = materiaRepo.findById(dto.getMateriaId())
                        .orElseThrow(() -> new IllegalArgumentException("Matéria não encontrada: " + dto.getMateriaId()));

        existente.setData(dto.getData());
        existente.setPresente(dto.getPresente());
        existente.setAluno(aluno);
        existente.setTurma(turma);
        existente.setMateria(materia);

        return frequenciaRepo.save(existente);
    }

    /**
     * Exclui uma frequência por ID.
     */
    public void excluir(Long id) {
        Frequencia existente = buscarPorId(id);
        frequenciaRepo.delete(existente);
    }
}
