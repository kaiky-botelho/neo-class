// src/main/java/com/neoclass/controller/MateriaController.java
package com.neoclass.controller;

import com.neoclass.dto.MateriaDTO;
import com.neoclass.model.Materia;
import com.neoclass.model.Professor;
import com.neoclass.model.Turma;
import com.neoclass.service.MateriaService;
import com.neoclass.service.ProfessorService;
import com.neoclass.service.TurmaService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {

    private final MateriaService materiaService;
    private final ProfessorService professorService;
    private final TurmaService turmaService;

    public MateriaController(MateriaService materiaService,
                             ProfessorService professorService,
                             TurmaService turmaService) {
        this.materiaService = materiaService;
        this.professorService = professorService;
        this.turmaService = turmaService;
    }

    @GetMapping
    public List<MateriaDTO> listar() {
        return materiaService.listarTodos()
                             .stream()
                             .map(this::toDTO)
                             .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public MateriaDTO buscar(@PathVariable Long id) {
        return toDTO(materiaService.buscarPorId(id));
    }

    @PostMapping
    public MateriaDTO criar(@RequestBody MateriaDTO dto) {
        Materia entidade = toEntity(dto);
        Materia salvo    = materiaService.salvar(entidade);
        return toDTO(salvo);
    }

    @PutMapping("/{id}")
    public MateriaDTO atualizar(
            @PathVariable Long id,
            @RequestBody MateriaDTO dto
    ) {
        dto.setId(id);
        Materia entidade = toEntity(dto);
        Materia atualizado = materiaService.salvar(entidade);
        return toDTO(atualizado);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        materiaService.excluir(id);
    }

    // ——— Conversor de Entidade → DTO ———
    private MateriaDTO toDTO(Materia m) {
        MateriaDTO dto = new MateriaDTO();
        BeanUtils.copyProperties(m, dto);
        if (m.getProfessor() != null) {
            dto.setProfessorId(m.getProfessor().getId());
        }
        if (m.getTurma() != null) {
            dto.setTurmaId(m.getTurma().getId());
        }
        return dto;
    }

    // ——— Conversor de DTO → Entidade ———
    private Materia toEntity(MateriaDTO dto) {
        Materia m = new Materia();
        BeanUtils.copyProperties(dto, m); // copia id, nome, bimestre

        if (dto.getProfessorId() != null) {
            // Busca no banco o Professor completo
            Professor p = professorService.buscarPorId(dto.getProfessorId());
            m.setProfessor(p);
        }
        if (dto.getTurmaId() != null) {
            // Busca no banco a Turma completa
            Turma t = turmaService.buscarPorId(dto.getTurmaId());
            m.setTurma(t);
        }
        return m;
    }
}
