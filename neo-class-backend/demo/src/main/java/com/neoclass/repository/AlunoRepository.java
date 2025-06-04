// src/main/java/com/neoclass/repository/AlunoRepository.java
package com.neoclass.repository;

import com.neoclass.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    // usado no login para combinar emailInstitucional + senha
    Optional<Aluno> findByEmailInstitucionalAndSenha(String emailInstitucional, String senha);

    // usado para recuperar apenas o aluno (ou seu ID) a partir do emailInstitucional
    Optional<Aluno> findByEmailInstitucional(String emailInstitucional);
}
