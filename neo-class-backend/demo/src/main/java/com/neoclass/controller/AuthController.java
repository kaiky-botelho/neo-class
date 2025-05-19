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
    public ResponseEntity<Object> loginSecretaria(@RequestBody AuthRequestDTO req) {
        var opt = secretariaService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("E-mail ou senha inválidos");
        }
        String token = jwtUtil.gerarToken(opt.get().getEmail());
        AuthResponseDTO dto = new AuthResponseDTO(token, "SECRETARIA");
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/aluno")
    public ResponseEntity<Object> loginAluno(@RequestBody AuthRequestDTO req) {
        var opt = alunoService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("E-mail ou senha inválidos");
        }
        String token = jwtUtil.gerarToken(opt.get().getEmailInstitucional());
        AuthResponseDTO dto = new AuthResponseDTO(token, "ALUNO");
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/professor")
    public ResponseEntity<Object> loginProfessor(@RequestBody AuthRequestDTO req) {
        var opt = professorService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("E-mail ou senha inválidos");
        }
        String token = jwtUtil.gerarToken(opt.get().getEmailInstitucional());
        AuthResponseDTO dto = new AuthResponseDTO(token, "PROFESSOR");
        return ResponseEntity.ok(dto);
    }
}
