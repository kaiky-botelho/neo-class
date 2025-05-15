package com.neoclass.service;

import com.neoclass.model.Nota;
import com.neoclass.repository.NotaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotaService implements CrudService<Nota, Long> {
    private final NotaRepository repo;
    public NotaService(NotaRepository repo) { this.repo = repo; }

    @Override public List<Nota> listarTodos() { return repo.findAll(); }
    @Override public Nota buscarPorId(Long id) { return repo.findById(id).orElseThrow(); }
    @Override public Nota salvar(Nota t) { return repo.save(t); }
    @Override public void excluir(Long id) { repo.deleteById(id); }
}
