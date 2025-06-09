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
        return repo.save(a);
    }

    @Override
    public void excluir(Long id) {
        repo.deleteById(id);
    }

    public Optional<Aluno> autenticar(String email, String senha) {
        return repo.findByEmailInstitucionalAndSenha(email, senha);
    }

    public Aluno buscarPorEmailInstitucional(String emailInstitucional) {
        return repo.findByEmailInstitucional(emailInstitucional)
                   .orElseThrow(() ->
                       new IllegalArgumentException(
                         "Aluno não encontrado com e-mail institucional: " + emailInstitucional));
    }

    public Long buscarIdPorEmail(String emailInstitucional) {
        return buscarPorEmailInstitucional(emailInstitucional).getId();
    }

    /**
     * Altera a senha de um aluno, gerando o hash via BCrypt e salvando no banco.
     * @param alunoId     o ID do aluno
     * @param novaSenha   a nova senha em texto puro
     */
    public void alterarSenha(Long alunoId, String novaSenha) {
        Aluno aluno = buscarPorId(alunoId);
        String hash = passwordEncoder.encode(novaSenha);
        aluno.setSenha(hash);
        repo.save(aluno);
    }
}
