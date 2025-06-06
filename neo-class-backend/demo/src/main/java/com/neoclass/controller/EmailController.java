package com.neoclass.controller;

import com.neoclass.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    /**
     * Exemplo de JSON no body:
     * {
     *   "para": "destinatario@provedor.com",
     *   "assunto": "Assunto da mensagem",
     *   "texto": "Corpo em texto puro",
     *   "html": "<p>Corpo em HTML</p>"
     * }
     */
    @PostMapping("/enviar")
    public ResponseEntity<String> enviarEmail(@RequestBody Map<String, String> payload) {
        String para    = payload.get("para");
        String assunto = payload.get("assunto");
        String texto   = payload.getOrDefault("texto", "");
        String html    = payload.getOrDefault("html", "");

        try {
            emailService.enviarEmail(para, assunto, texto, html);
            return ResponseEntity.ok("E-mail enviado com sucesso.");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body("Erro ao enviar e-mail: " + e.getMessage());
        }
    }
}
