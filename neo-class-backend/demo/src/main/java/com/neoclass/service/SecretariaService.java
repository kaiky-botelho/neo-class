// src/main/java/com/neoclass/service/SecretariaService.java
package com.neoclass.service;

import com.neoclass.model.Secretaria;
import com.neoclass.repository.SecretariaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SecretariaService implements CrudService<Secretaria, Long> {

    private final SecretariaRepository repo;

    public SecretariaService(SecretariaRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Secretaria> listarTodos() {
        return repo.findAll();
    }

    @Override
    public Secretaria buscarPorId(Long id) {
        return repo.findById(id)
                   .orElseThrow(() ->
                       new IllegalArgumentException("Secretaria não encontrada com id " + id));
    }

    @Override
    public Secretaria salvar(Secretaria s) {
        return repo.save(s);
    }

    @Override
    public void excluir(Long id) {
        repo.deleteById(id);
    }


    public Optional<Secretaria> autenticar(String email, String senha) {
        return repo.findByEmailAndSenha(email, senha);
    }
}
