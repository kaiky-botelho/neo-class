// src/main/java/com/neoclass/controller/AuthController.java
package com.neoclass.controller;

import com.neoclass.dto.AuthRequestDTO;
import com.neoclass.dto.AuthResponseDTO;
import com.neoclass.security.JwtUtil;
import com.neoclass.service.SecretariaService;
import com.neoclass.service.AlunoService;
import com.neoclass.service.ProfessorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        String token = jwtUtil.gerarToken(opt.get().getEmail());
        return ResponseEntity.ok(new AuthResponseDTO(token, "SECRETARIA"));
    }

    @PostMapping("/aluno")
    public ResponseEntity<?> loginAluno(@RequestBody AuthRequestDTO req) {
        // aqui o campo 'email' do DTO é mapeado para emailInstitucional do Aluno
        var opt = alunoService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("E-mail institucional ou senha inválidos");
        }
        String token = jwtUtil.gerarToken(opt.get().getEmailInstitucional());
        return ResponseEntity.ok(new AuthResponseDTO(token, "ALUNO"));
    }

    @PostMapping("/professor")
    public ResponseEntity<?> loginProfessor(@RequestBody AuthRequestDTO req) {
        var opt = professorService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("E-mail ou senha inválidos");
        }
        String token = jwtUtil.gerarToken(opt.get().getEmailInstitucional());
        return ResponseEntity.ok(new AuthResponseDTO(token, "PROFESSOR"));
    }
}
