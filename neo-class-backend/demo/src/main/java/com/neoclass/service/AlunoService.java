// src/main/java/com/neoclass/service/AlunoService.java
package com.neoclass.service;

import com.neoclass.model.Aluno;
import com.neoclass.repository.AlunoRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlunoService implements CrudService<Aluno, Long> {

    private final AlunoRepository repo;
    private final PasswordEncoder passwordEncoder;

    public AlunoService(AlunoRepository repo,
                        PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<Aluno> listarTodos() {
        return repo.findAll();
    }

    @Override
    public Aluno buscarPorId(Long id) {
        return repo.findById(id)
                   .orElseThrow(() ->
                       new IllegalArgumentException("Aluno não encontrado com id " + id));
    }

    @Override
    public Aluno salvar(Aluno a) {
        // Se a senha veio em texto puro, gera o hash antes de salvar
        if (a.getSenha() != null && !a.getSenha().startsWith("$2a$")) {
            String hash = passwordEncoder.encode(a.getSenha());
            a.setSenha(hash);
        }
        return repo.save(a);
    }

    @Override
    public void excluir(Long id) {
        repo.deleteById(id);
    }

    /**
     * Autentica aluno comparando texto puro com hash BCrypt.
     */
    public Optional<Aluno> autenticar(String emailInstitucional, String senhaTextoPuro) {
        return repo.findByEmailInstitucional(emailInstitucional)
                   .filter(a -> passwordEncoder.matches(senhaTextoPuro, a.getSenha()));
    }

    public Aluno buscarPorEmailInstitucional(String emailInstitucional) {
        return repo.findByEmailInstitucional(emailInstitucional)
                   .orElseThrow(() ->
                       new IllegalArgumentException(
                           "Aluno não encontrado com e-mail institucional: " + emailInstitucional));
    }

    /**
     * Altera senha de aluno: recebe texto puro, gera hash e salva.
     */
    public void alterarSenha(Long alunoId, String novaSenha) {
        Aluno aluno = buscarPorId(alunoId);
        String hash = passwordEncoder.encode(novaSenha);
        aluno.setSenha(hash);
        repo.save(aluno);
    }
}
