package com.neoclass.service;

import com.neoclass.model.Prova;
import com.neoclass.repository.ProvaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProvaService implements CrudService<Prova, Long> {
    private final ProvaRepository repo;
    public ProvaService(ProvaRepository repo) { this.repo = repo; }

    @Override public List<Prova> listarTodos() { return repo.findAll(); }
    @Override public Prova buscarPorId(Long id) { return repo.findById(id).orElseThrow(); }
    @Override public Prova salvar(Prova t) { return repo.save(t); }
    @Override public void excluir(Long id) { repo.deleteById(id); }
}
