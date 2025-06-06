package com.neoclass.service;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    public void enviarEmail(String para, String assunto, String conteudoTexto, String conteudoHtml) throws IOException {
        Email from = new Email("kaii.bots18@gmail.com");  // novo remetente, precisa estar verificado
        Email to = new Email(para);

        Content content;
        if (conteudoHtml != null && !conteudoHtml.trim().isEmpty()) {
            content = new Content("text/html", conteudoHtml);
        } else {
            content = new Content("text/plain", conteudoTexto);
        }

        Mail mail = new Mail(from, assunto, to, content);
        SendGrid sg = new SendGrid(sendGridApiKey);

        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sg.api(request);

        // Debug: imprima no console para ver o status que o SendGrid retorna
        System.out.println("SendGrid Status Code: " + response.getStatusCode());
        System.out.println("SendGrid Body: " + response.getBody());
        System.out.println("SendGrid Headers: " + response.getHeaders());
    }
}
