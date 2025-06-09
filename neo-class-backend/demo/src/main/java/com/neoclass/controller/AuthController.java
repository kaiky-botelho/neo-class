// src/main/java/com/neoclass/controller/AuthController.java
package com.neoclass.controller;

import com.neoclass.dto.AuthRequestDTO;
import com.neoclass.dto.LoginResponseDTO;
import com.neoclass.dto.PasswordDTO;
import com.neoclass.dto.SecretariaDTO;
import com.neoclass.dto.AlunoResumoDTO;
import com.neoclass.dto.ProfessorResumoDTO;
import com.neoclass.model.Aluno;
import com.neoclass.model.Professor;
import com.neoclass.model.Secretaria;
import com.neoclass.security.JwtUtil;
import com.neoclass.service.AlunoService;
import com.neoclass.service.ProfessorService;
import com.neoclass.service.SecretariaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("E-mail ou senha inválidos");
        }
        Secretaria entidade = opt.get();
        String token = jwtUtil.gerarToken(entidade.getEmail());

        SecretariaDTO dto = new SecretariaDTO();
        dto.setId(entidade.getId());
        dto.setEmail(entidade.getEmail());

        return ResponseEntity.ok(new LoginResponseDTO(token, dto));
    }

    @PostMapping("/aluno")
    public ResponseEntity<?> loginAluno(@RequestBody AuthRequestDTO req) {
        var opt = alunoService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("E-mail institucional ou senha inválidos");
        }
        Aluno entidade = opt.get();
        String token = jwtUtil.gerarToken(entidade.getEmailInstitucional());

        AlunoResumoDTO dto = new AlunoResumoDTO();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        dto.setEmailInstitucional(entidade.getEmailInstitucional());
        dto.setTurmaId(entidade.getTurma() != null ? entidade.getTurma().getId() : null);

        return ResponseEntity.ok(new LoginResponseDTO(token, dto));
    }

    @PostMapping("/professor")
    public ResponseEntity<?> loginProfessor(@RequestBody AuthRequestDTO req) {
        var opt = professorService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("E-mail ou senha inválidos");
        }
        Professor entidade = opt.get();
        String token = jwtUtil.gerarToken(entidade.getEmailInstitucional());

        ProfessorResumoDTO dto = new ProfessorResumoDTO();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        dto.setEmailInstitucional(entidade.getEmailInstitucional());

        return ResponseEntity.ok(new LoginResponseDTO(token, dto));
    }

    /**
     * Altera a senha do aluno (já autenticado).
     * Recebe JSON { "novaSenha": "xxx" } e usa o e-mail do JWT.
     */
    @PutMapping("/aluno/senha")
    public ResponseEntity<Void> alterarSenhaAluno(
        @RequestBody PasswordDTO payload,
        @AuthenticationPrincipal String emailInstitucional
    ) {
        Aluno aluno = alunoService.buscarPorEmailInstitucional(emailInstitucional);
        alunoService.alterarSenha(aluno.getId(), payload.getNovaSenha());
        return ResponseEntity.noContent().build();
    }
}
