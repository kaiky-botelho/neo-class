package com.neoclass.controller;
import com.neoclass.model.Secretaria;
import com.neoclass.service.SecretariaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/secretarias")
public class SecretariaController {
  private final SecretariaService service;
  public SecretariaController(SecretariaService service){this.service=service;}

  @GetMapping public List<Secretaria> listar(){ return service.listarTodos(); }
  @GetMapping("/{id}") public Secretaria buscar(@PathVariable Long id){ return service.buscarPorId(id); }
  @PostMapping public Secretaria criar(@RequestBody Secretaria s){ return service.salvar(s); }
  @PutMapping("/{id}") public Secretaria atualizar(@PathVariable Long id, @RequestBody Secretaria s){
    s.setId(id);
    return service.salvar(s);
  }
  @DeleteMapping("/{id}") public void excluir(@PathVariable Long id){ service.excluir(id); }
}