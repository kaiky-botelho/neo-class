package com.neoclass.controller;

import com.neoclass.dto.AuthRequestDTO;
import com.neoclass.dto.LoginResponseDTO;
import com.neoclass.dto.AlunoResumoDTO;
import com.neoclass.model.Aluno;
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

<<<<<<< HEAD
        var user = opt.get();
        // GERAR O TOKEN COM A ROLE "SECRETARIA"
        String token = jwtUtil.gerarToken(user.getEmail(), "SECRETARIA");

        AuthResponseDTO dto = new AuthResponseDTO(token, "SECRETARIA", user.getId());
        return ResponseEntity.ok(dto);
=======
        var entidade = opt.get();
        String token = jwtUtil.gerarToken(entidade.getEmail());

        // Mapeia para DTO mínimo (pode criar um SecretariaResumoDTO se desejar, 
        // mas aqui usamos AlunoResumoDTO apenas para “papel” de nome placeholder)
        AlunoResumoDTO dto = new AlunoResumoDTO();
        dto.setId(null);
        dto.setNome("SECRETARIA");
        dto.setEmailInstitucional(entidade.getEmail());
        dto.setTurmaId(null);

        LoginResponseDTO resposta = new LoginResponseDTO(token, dto);
        return ResponseEntity.ok(resposta);
>>>>>>> master
    }

    @PostMapping("/aluno")
    public ResponseEntity<?> loginAluno(@RequestBody AuthRequestDTO req) {
        var opt = alunoService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("E-mail institucional ou senha inválidos");
        }

<<<<<<< HEAD
        var user = opt.get();
        // Nota: usei user.getEmailInstitucional() como subject do token
        String token = jwtUtil.gerarToken(user.getEmailInstitucional(), "ALUNO");

        AuthResponseDTO dto = new AuthResponseDTO(token, "ALUNO", user.getId());
        return ResponseEntity.ok(dto);
=======
        Aluno entidade = opt.get();
        String token = jwtUtil.gerarToken(entidade.getEmailInstitucional());

        AlunoResumoDTO dto = new AlunoResumoDTO();
        dto.setId(entidade.getId());
        dto.setNome(entidade.getNome());
        dto.setEmailInstitucional(entidade.getEmailInstitucional());
        dto.setTurmaId(entidade.getTurma() != null ? entidade.getTurma().getId() : null);

        LoginResponseDTO resposta = new LoginResponseDTO(token, dto);
        return ResponseEntity.ok(resposta);
>>>>>>> master
    }

    @PostMapping("/professor")
    public ResponseEntity<?> loginProfessor(@RequestBody AuthRequestDTO req) {
        var opt = professorService.autenticar(req.getEmail(), req.getSenha());
        if (opt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("E-mail ou senha inválidos");
        }

<<<<<<< HEAD
        var user = opt.get();
        // Nota: usei user.getEmailInstitucional() como subject do token
        String token = jwtUtil.gerarToken(user.getEmailInstitucional(), "PROFESSOR");

        AuthResponseDTO dto = new AuthResponseDTO(token, "PROFESSOR", user.getId());
        return ResponseEntity.ok(dto);
=======
        var entidade = opt.get();
        String token = jwtUtil.gerarToken(entidade.getEmailInstitucional());

        // “Professor” pode usar DTO mínimo também
        AlunoResumoDTO dto = new AlunoResumoDTO();
        dto.setId(null);
        dto.setNome("PROFESSOR");
        dto.setEmailInstitucional(entidade.getEmailInstitucional());
        dto.setTurmaId(null);

        LoginResponseDTO resposta = new LoginResponseDTO(token, dto);
        return ResponseEntity.ok(resposta);
>>>>>>> master
    }
}
