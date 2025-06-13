package com.neoclass.controller;

import com.neoclass.dto.AuthRequestDTO;
import com.neoclass.dto.ChangePasswordRequestDTO;
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
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/login")
public class AuthController {

    private final SecretariaService secretariaService;
    private final AlunoService alunoService;
    private final ProfessorService professorService;
    private final JwtUtil jwtUtil;

    public AuthController(SecretariaService secretariaService,
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
        var optional = secretariaService.autenticar(req.getEmail(), req.getSenha());
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("E-mail ou senha inválidos");
        }

        Secretaria secretaria = optional.get();
        List<String> roles = List.of("SECRETARIA");
        String token = jwtUtil.gerarToken(secretaria.getEmail(), roles);

        SecretariaDTO dto = new SecretariaDTO();
        dto.setId(secretaria.getId());
        dto.setEmail(secretaria.getEmail());

        LoginResponseDTO response = new LoginResponseDTO(token, dto, roles);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/aluno")
    public ResponseEntity<?> loginAluno(@RequestBody AuthRequestDTO req) {
        var optional = alunoService.autenticar(req.getEmail(), req.getSenha());
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("E-mail institucional ou senha inválidos");
        }

        Aluno aluno = optional.get();
        List<String> roles = List.of("ALUNO");
        String token = jwtUtil.gerarToken(aluno.getEmailInstitucional(), roles);

        AlunoResumoDTO dto = new AlunoResumoDTO();
        dto.setId(aluno.getId());
        dto.setNome(aluno.getNome());
        dto.setEmailInstitucional(aluno.getEmailInstitucional());
        dto.setTurmaId(aluno.getTurma() != null ? aluno.getTurma().getId() : null);

        LoginResponseDTO response = new LoginResponseDTO(token, dto, roles);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/professor")
    public ResponseEntity<?> loginProfessor(@RequestBody AuthRequestDTO req) {
        var optional = professorService.autenticar(req.getEmail(), req.getSenha());
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("E-mail ou senha inválidos");
        }

        Professor professor = optional.get();
        List<String> roles = List.of("PROFESSOR");
        String token = jwtUtil.gerarToken(professor.getEmailInstitucional(), roles);

        ProfessorResumoDTO dto = new ProfessorResumoDTO();
        dto.setId(professor.getId());
        dto.setNome(professor.getNome());
        dto.setEmailInstitucional(professor.getEmailInstitucional());

        LoginResponseDTO response = new LoginResponseDTO(token, dto, roles);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/aluno/senha")
    public ResponseEntity<Void> alterarSenhaAluno(
            @Valid @RequestBody ChangePasswordRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String emailLogado = auth.getName();
        try {
            Aluno aluno = alunoService.buscarPorEmailInstitucional(emailLogado);
            alunoService.alterarSenha(aluno.getId(), request.getNovaSenha());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(null);
        }
    }
}
