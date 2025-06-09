// src/main/java/com/neoclass/controller/AuthController.java
package com.neoclass.controller;

import com.neoclass.dto.AuthRequestDTO;
import com.neoclass.dto.LoginResponseDTO;
import com.neoclass.dto.SecretariaDTO;
import com.neoclass.dto.AlunoResumoDTO;
import com.neoclass.dto.ProfessorResumoDTO;
import com.neoclass.model.Aluno;
import com.neoclass.model.Professor;
import com.neoclass.model.Secretaria;
import com.neoclass.security.JwtUtil;
import com.neoclass.service.SecretariaService;
import com.neoclass.service.AlunoService;
import com.neoclass.service.ProfessorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/login")
public class AuthController {

    private final SecretariaService secretariaService;
    private final AlunoService      alunoService;
    private final ProfessorService  professorService;
    private final JwtUtil           jwtUtil;

    public AuthController(
        SecretariaService secretariaService,
        AlunoService alunoService,
        ProfessorService professorService,
        JwtUtil jwtUtil
    ) {
        this.secretariaService = secretariaService;
        this.alunoService      = alunoService;
        this.professorService  = professorService;
        this.jwtUtil           = jwtUtil;
    }

    @PostMapping("/secretaria")
    public ResponseEntity<?> loginSecretaria(@RequestBody AuthRequestDTO req) {
        var opt = secretariaService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("E-mail ou senha inválidos");
        }

        Secretaria entidade = opt.get();
        List<String> roles = List.of("SECRETARIA"); // Define os papéis
        String token = jwtUtil.gerarToken(entidade.getEmail(), roles);

        SecretariaDTO dto = new SecretariaDTO();
        dto.setId(entidade.getId());
        dto.setEmail(entidade.getEmail());

        // Altera o construtor para incluir os papéis
        LoginResponseDTO resposta = new LoginResponseDTO(token, dto, roles);
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/aluno")
    public ResponseEntity<?> loginAluno(@RequestBody AuthRequestDTO req) {
        var opt = alunoService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("E-mail institucional ou senha inválidos");
        }

        Aluno entidade = opt.get();
        List<String> roles = List.of("ALUNO"); // Define os papéis
        String token = jwtUtil.gerarToken(entidade.getEmailInstitucional(), roles);

        AlunoResumoDTO dto = new AlunoResumoDTO();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        dto.setEmailInstitucional(entidade.getEmailInstitucional());
        dto.setTurmaId(entidade.getTurma() != null ? entidade.getTurma().getId() : null);

        // Altera o construtor para incluir os papéis
        LoginResponseDTO resposta = new LoginResponseDTO(token, dto, roles);
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/professor")
    public ResponseEntity<?> loginProfessor(@RequestBody AuthRequestDTO req) {
        var opt = professorService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("E-mail ou senha inválidos");
        }

        Professor entidade = opt.get();
        List<String> roles = List.of("PROFESSOR"); // Define os papéis
        String token = jwtUtil.gerarToken(entidade.getEmailInstitucional(), roles);

        ProfessorResumoDTO dto = new ProfessorResumoDTO();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        dto.setEmailInstitucional(entidade.getEmailInstitucional());

        // Altera o construtor para incluir os papéis
        LoginResponseDTO resposta = new LoginResponseDTO(token, dto, roles);
        return ResponseEntity.ok(resposta);
    }
}