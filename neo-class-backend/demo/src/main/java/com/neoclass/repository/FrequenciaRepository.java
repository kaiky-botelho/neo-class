// src/main/java/com/neoclass/repository/FrequenciaRepository.java
package com.neoclass.repository;

import com.neoclass.dto.FaltaDTO;
import com.neoclass.model.Frequencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FrequenciaRepository extends JpaRepository<Frequencia, Long> {


    @Query("SELECT new com.neoclass.dto.FaltaDTO(" +
           "  f.materia.id, " +
           "  f.materia.nome, " +
           "  COUNT(f)" +
           ") " +
           "FROM Frequencia f " +
           "WHERE f.aluno.id = :alunoId " +
           "  AND f.presente = false " +
           "GROUP BY f.materia.id, f.materia.nome")
    List<FaltaDTO> findTotalFaltasPorMateriaDoAluno(@Param("alunoId") Long alunoId);
}
