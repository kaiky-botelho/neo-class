package com.neoclass.controller;

import com.neoclass.dto.AuthRequestDTO;
import com.neoclass.dto.ChangePasswordRequestDTO; // Importar o novo DTO
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
import org.springframework.security.core.Authentication; // Importar Authentication
import org.springframework.security.core.context.SecurityContextHolder; // Importar SecurityContextHolder
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/login")
public class AuthController {

    private final SecretariaService secretariaService;
    private final AlunoService    alunoService;
    private final ProfessorService  professorService;
    private final JwtUtil         jwtUtil;

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
        List<String> roles = List.of("SECRETARIA");
        String token = jwtUtil.gerarToken(entidade.getEmail(), roles);

        SecretariaDTO dto = new SecretariaDTO();
        dto.setId(entidade.getId());
        dto.setEmail(entidade.getEmail());

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
        List<String> roles = List.of("ALUNO");
        String token = jwtUtil.gerarToken(entidade.getEmailInstitucional(), roles);

        AlunoResumoDTO dto = new AlunoResumoDTO();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        dto.setEmailInstitucional(entidade.getEmailInstitucional());
        dto.setTurmaId(entidade.getTurma() != null ? entidade.getTurma().getId() : null);

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
        List<String> roles = List.of("PROFESSOR");
        String token = jwtUtil.gerarToken(entidade.getEmailInstitucional(), roles);

        ProfessorResumoDTO dto = new ProfessorResumoDTO();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        dto.setEmailInstitucional(entidade.getEmailInstitucional());

        LoginResponseDTO resposta = new LoginResponseDTO(token, dto, roles);
        return ResponseEntity.ok(resposta);
    }

    // NOVO ENDPOINT: Alterar Senha para Aluno Autenticado (via email do token JWT)
    @PutMapping("/aluno/senha") // <-- Endpoint sem o ID no PathVariable
    public ResponseEntity<?> alterarSenhaAluno(@RequestBody ChangePasswordRequestDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedEmail = authentication.getName(); // Email institucional do usuário logado do JWT

        try {
            // Busca o aluno pelo email obtido do token para ter certeza de que é o usuário correto
            Aluno alunoAutenticado = alunoService.buscarPorEmailInstitucional(authenticatedEmail);
            alunoService.alterarSenha(alunoAutenticado.getId(), request.getNovaSenha());
            return ResponseEntity.ok().build(); // 200 OK sem corpo
        } catch (IllegalArgumentException e) {
            // Isso pode acontecer se o email do token não corresponder a um aluno válido,
            // ou se o serviço retornar essa exceção por outro motivo.
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Erro ao alterar senha para aluno " + authenticatedEmail + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao alterar senha.");
        }
    }
}