// src/main/java/com/neoclass/repository/FrequenciaRepository.java
package com.neoclass.repository;

import com.neoclass.model.Frequencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repositório de Frequencia apenas para agrupar o total de faltas (presente = false)
 * por matéria (sem trazer o nome do join). Retorna apenas (materiaId, totalFaltas).
 */
public interface FrequenciaRepository extends JpaRepository<Frequencia, Long> {

    /**
     * Conta quantas vezes 'presente = false' para cada materia_id, filtrando pelo aluno_id.
     * RESULTADO: List<Object[]> onde cada Object[] = [materiaId(Long), totalFaltas(Long)].
     */
    @Query("""
        SELECT f.materia.id, COUNT(f)
        FROM Frequencia f
        WHERE f.aluno.id = :alunoId
          AND f.presente = false
        GROUP BY f.materia.id
    """)
    List<Object[]> countFaltasPorMateria(@Param("alunoId") Long alunoId);
}
