// src/main/java/com/neoclass/repository/ProfessorRepository.java
package com.neoclass.repository;

import com.neoclass.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {

  Optional<Professor> findByEmailInstitucionalAndSenha(String emailInstitucional, String senha);
}
