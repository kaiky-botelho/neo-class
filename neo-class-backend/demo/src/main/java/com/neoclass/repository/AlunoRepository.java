// src/main/java/com/neoclass/repository/AlunoRepository.java
package com.neoclass.repository;

import com.neoclass.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Optional<Aluno> findByEmailInstitucionalAndSenha(String emailInstitucional, String senha);
    Optional<Aluno> findByEmailInstitucional(String emailInstitucional);
}
