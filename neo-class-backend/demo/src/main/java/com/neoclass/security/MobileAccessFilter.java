package com.neoclass.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class MobileAccessFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String userAgent = req.getHeader("User-Agent");
        String path = req.getRequestURI();

        boolean isMobile = userAgent != null && userAgent.toLowerCase().contains("mobile");
        boolean isRestrictedPath = path.startsWith("/api/secretarias") || path.startsWith("/api/professores");

        if (isMobile && isRestrictedPath) {
            res.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
            res.getWriter().write("Acesso não permitido via dispositivo móvel.");
            return;
        }

        chain.doFilter(request, response);
    }
}
