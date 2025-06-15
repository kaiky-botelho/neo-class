package com.neoclass.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neoclass.config.DataSourceManager;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final DataSourceManager dsManager;

    public AdminController(DataSourceManager dsManager) {
        this.dsManager = dsManager;
    }

    @PostMapping("/shutdown-pool")
    public ResponseEntity<Void> shutdownPool() {
        dsManager.shutdownPool();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/evict-connections")
    public ResponseEntity<Void> evictConnections() {
        dsManager.evictAllConnections();
        return ResponseEntity.noContent().build();
    }
}
