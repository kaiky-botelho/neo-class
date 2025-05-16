// src/main/java/com/neoclass/controller/AuthController.java
package com.neoclass.controller;

import com.neoclass.dto.AuthRequestDTO;
import com.neoclass.dto.AuthResponseDTO;
import com.neoclass.model.Secretaria;
import com.neoclass.service.SecretariaService;
import com.neoclass.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final SecretariaService secretariaService;
    private final JwtUtil jwtUtil;

    public AuthController(SecretariaService service, JwtUtil jwtUtil) {
        this.secretariaService = service;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO req) {
        var maybeSec = secretariaService.autenticar(req.getEmail(), req.getSenha());

        if (maybeSec.isEmpty()) {
            // 401 se não encontrou
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("E-mail ou senha inválidos");
        }

        // gerou o token e retorna o DTO
        Secretaria sec = maybeSec.get();
        String token = jwtUtil.gerarToken(sec.getEmail());
        var resp = new AuthResponseDTO(token);
        return ResponseEntity.ok(resp);
    }
}
