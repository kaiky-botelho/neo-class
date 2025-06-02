package com.neoclass.controller;

import com.neoclass.dto.AuthRequestDTO;
import com.neoclass.dto.AuthResponseDTO;
import com.neoclass.security.JwtUtil;
import com.neoclass.service.AlunoService;
import com.neoclass.service.ProfessorService;
import com.neoclass.service.SecretariaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class AuthController {

    private final SecretariaService secretariaService;
    private final AlunoService alunoService;
    private final ProfessorService professorService;
    private final JwtUtil jwtUtil;

    public AuthController(
            SecretariaService secretariaService,
            AlunoService alunoService,
            ProfessorService professorService,
            JwtUtil jwtUtil) {
        this.secretariaService = secretariaService;
        this.alunoService = alunoService;
        this.professorService = professorService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/secretaria")
    public ResponseEntity<?> loginSecretaria(@RequestBody AuthRequestDTO req) {
        var opt = secretariaService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("E-mail ou senha inválidos");
        }

        var user = opt.get();
        // GERAR O TOKEN COM A ROLE "SECRETARIA"
        String token = jwtUtil.gerarToken(user.getEmail(), "SECRETARIA");

        AuthResponseDTO dto = new AuthResponseDTO(token, "SECRETARIA", user.getId());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/aluno")
    public ResponseEntity<?> loginAluno(@RequestBody AuthRequestDTO req) {
        var opt = alunoService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("E-mail institucional ou senha inválidos");
        }

        var user = opt.get();
        // Nota: usei user.getEmailInstitucional() como subject do token
        String token = jwtUtil.gerarToken(user.getEmailInstitucional(), "ALUNO");

        AuthResponseDTO dto = new AuthResponseDTO(token, "ALUNO", user.getId());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/professor")
    public ResponseEntity<?> loginProfessor(@RequestBody AuthRequestDTO req) {
        var opt = professorService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("E-mail ou senha inválidos");
        }

        var user = opt.get();
        // Nota: usei user.getEmailInstitucional() como subject do token
        String token = jwtUtil.gerarToken(user.getEmailInstitucional(), "PROFESSOR");

        AuthResponseDTO dto = new AuthResponseDTO(token, "PROFESSOR", user.getId());
        return ResponseEntity.ok(dto);
    }
}
