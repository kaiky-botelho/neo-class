package com.neoclass.repository;

import com.neoclass.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    // REMOVIDO: Optional<Aluno> findByEmailInstitucionalAndSenha(String emailInstitucional, String senha);
    // Agora a autenticação compara o hash da senha, não busca por senha em texto puro.

    Optional<Aluno> findByEmailInstitucional(String emailInstitucional);
}