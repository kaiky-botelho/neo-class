package com.neoclass.controller;

import com.neoclass.dto.AlunoDTO;
import com.neoclass.model.Aluno;
import com.neoclass.model.Turma;
import com.neoclass.service.AlunoService;
import com.neoclass.service.TurmaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoService alunoService;
    private final TurmaService turmaService;

    public AlunoController(AlunoService alunoService, TurmaService turmaService) {
        this.alunoService = alunoService;
        this.turmaService = turmaService;
    }

    // Converte entidade → DTO (IMPORTANTE: NÃO INCLUIR SENHA AQUI)
    private AlunoDTO toDTO(Aluno a) {
        AlunoDTO dto = new AlunoDTO();
        dto.setId(a.getId());
        dto.setNome(a.getNome());
        dto.setDataNascimento(a.getDataNascimento());
        dto.setRg(a.getRg());
        dto.setCpf(a.getCpf());
        dto.setCelular(a.getCelular());
        dto.setTelefone(a.getTelefone());
        dto.setEmail(a.getEmail());
        dto.setGenero(a.getGenero());
        dto.setCep(a.getCep());
        dto.setUf(a.getUf());
        dto.setCidade(a.getCidade());
        dto.setRua(a.getRua());
        dto.setNumero(a.getNumero());
        dto.setComplemento(a.getComplemento());
        dto.setBairro(a.getBairro());
        dto.setSerie(a.getSerie());
        dto.setDataMatricula(a.getDataMatricula());
        dto.setSituacaoMatricula(a.getSituacaoMatricula());
        dto.setEmailInstitucional(a.getEmailInstitucional());
        // NÃO RETORNA A SENHA NO DTO POR SEGURANÇA!
        // dto.setSenha(a.getSenha()); // <-- Certifique-se de que esta linha NÃO está ativa

        if (a.getTurma() != null) {
            dto.setTurmaId(a.getTurma().getId());
        } else {
            dto.setTurmaId(null);
        }

        return dto;
    }

    // Converte DTO → entidade (use com cautela para atualizações de perfil: não sobrescrever senha)
    private Aluno toEntity(AlunoDTO dto) {
        Aluno a = new Aluno();
        a.setId(dto.getId());
        a.setNome(dto.getNome());
        a.setDataNascimento(dto.getDataNascimento());
        a.setRg(dto.getRg());
        a.setCpf(dto.getCpf());
        a.setCelular(dto.getCelular());
        a.setTelefone(dto.getTelefone());
        a.setEmail(dto.getEmail());
        a.setGenero(dto.getGenero());
        a.setCep(dto.getCep());
        a.setUf(dto.getUf());
        a.setCidade(dto.getCidade());
        a.setRua(dto.getRua());
        a.setNumero(dto.getNumero());
        a.setComplemento(dto.getComplemento());
        a.setBairro(dto.getBairro());
        a.setSerie(dto.getSerie());
        a.setDataMatricula(dto.getDataMatricula());
        a.setSituacaoMatricula(dto.getSituacaoMatricula());
        a.setEmailInstitucional(dto.getEmailInstitucional());
        // ATENÇÃO: Ao converter DTO para Entidade em um UPDATE,
        // é crucial NÃO sobrescrever a senha hasheada com uma senha em texto puro
        // se o DTO não for especificamente para alterar a senha.
        // O ideal é carregar a entidade existente e copiar campo por campo, exceto a senha.
        a.setSenha(dto.getSenha()); // Mantido como estava, mas com esta ressalva importante
        // Caso de uso: Se este toEntity for usado para um POST de criação, a senha virá em texto puro e será hasheada no service.

        if (dto.getTurmaId() != null) {
            Long idTurma = dto.getTurmaId();
            Turma turmaRef = new Turma(idTurma);
            a.setTurma(turmaRef);
        } else {
            a.setTurma(null);
        }

        return a;
    }

    @GetMapping
    public ResponseEntity<List<AlunoDTO>> listarTodos() {
        List<Aluno> lista = alunoService.listarTodos();
        List<AlunoDTO> dtos = lista.stream()
                                   .map(this::toDTO)
                                   .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoDTO> buscarPorId(@PathVariable Long id) {
        Aluno a = alunoService.buscarPorId(id);
        return ResponseEntity.ok(toDTO(a));
    }

    @PostMapping
    public ResponseEntity<AlunoDTO> criar(@RequestBody AlunoDTO dto) {
        Aluno entidade = toEntity(dto);
        // O `alunoService.salvar` agora hasheia a senha se necessário.
        Aluno salva = alunoService.salvar(entidade);
        return ResponseEntity.status(201).body(toDTO(salva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoDTO> atualizar(
            @PathVariable Long id,
            @RequestBody AlunoDTO dto
    ) {
        dto.setId(id);
        // Para um PUT genérico, você precisaria carregar o Aluno existente do banco,
        // copiar os campos do DTO (EXCETO a senha, para não sobrescrever o hash), e salvar.
        // O `toEntity` aqui pode ser problemático se o DTO tiver senha e não for para alterá-la.
        Aluno entidade = toEntity(dto); // Isto pode sobrescrever a senha se dto.getSenha() != null
        Aluno atualizado = alunoService.salvar(entidade);
        return ResponseEntity.ok(toDTO(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        alunoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
    // O endpoint de alterar senha para aluno (`@PutMapping("/{id}/senha")`)
    // foi removido daqui e adicionado no AuthController.
}