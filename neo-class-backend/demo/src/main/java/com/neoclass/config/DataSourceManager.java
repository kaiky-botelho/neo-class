package com.neoclass.config;

import jakarta.annotation.PreDestroy;         // <— ajuste aqui
import org.springframework.stereotype.Component;

import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;

@Component
public class DataSourceManager {

    private final HikariDataSource hikariDataSource;

    public DataSourceManager(HikariDataSource hikariDataSource) {
        this.hikariDataSource = hikariDataSource;
    }

    /** Fecha totalmente o pool, liberando TODAS as conexões. */
    public void shutdownPool() {
        hikariDataSource.close();
    }

    /** “Evict” suave: fecha as conexões atuais mas mantém o pool ativo. */
    public void evictAllConnections() {
        HikariPoolMXBean poolProxy = hikariDataSource.getHikariPoolMXBean();
        poolProxy.softEvictConnections();
    }

    /** Garante fechamento do pool quando o Spring encerrar o contexto */
    @PreDestroy
    public void onDestroy() {
        hikariDataSource.close();
    }
}
