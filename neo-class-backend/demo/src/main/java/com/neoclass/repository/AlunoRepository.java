// src/main/java/com/neoclass/repository/AlunoRepository.java
package com.neoclass.repository;

import com.neoclass.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
  // usamos o campo emailInstitucional + senha para o login do aluno
  Optional<Aluno> findByEmailInstitucionalAndSenha(String emailInstitucional, String senha);
}
