// src/main/java/com/neoclass/repository/FrequenciaRepository.java
package com.neoclass.repository;

import com.neoclass.dto.FaltaDTO;
import com.neoclass.model.Frequencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FrequenciaRepository extends JpaRepository<Frequencia, Long> {

    /**
     * Agrupa as faltas (presente = false) de um determinado aluno por matéria.
     * Retorna um FaltaDTO contendo: [materiaId, materiaNome, totalFaltas].
     */
    @Query("""
        SELECT new com.neoclass.dto.FaltaDTO(
            f.materia.id,
            f.materia.nome,
            COUNT(f)
        )
        FROM Frequencia f
        WHERE f.aluno.id = :alunoId
          AND f.presente = false
        GROUP BY f.materia.id, f.materia.nome
        """)
    List<FaltaDTO> findTotalFaltasPorMateriaDoAluno(@Param("alunoId") Long alunoId);
}
