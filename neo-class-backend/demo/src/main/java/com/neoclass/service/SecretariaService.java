// SecretariaService.java
package com.neoclass.service;
import com.neoclass.model.Secretaria;
import com.neoclass.repository.SecretariaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SecretariaService implements CrudService<Secretaria,Long> {
  private final SecretariaRepository repo;
  public SecretariaService(SecretariaRepository repo){this.repo=repo;}
  public List<Secretaria> listarTodos(){return repo.findAll();}
  public Secretaria buscarPorId(Long id){return repo.findById(id).orElseThrow();}
  public Secretaria salvar(Secretaria s){return repo.save(s);}
  public void excluir(Long id){repo.deleteById(id);}
}