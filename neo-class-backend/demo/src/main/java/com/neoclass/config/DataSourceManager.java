package com.neoclass.config;

import jakarta.annotation.PreDestroy;        
import org.springframework.stereotype.Component;

import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;

@Component
public class DataSourceManager {

    private final HikariDataSource hikariDataSource;

    public DataSourceManager(HikariDataSource hikariDataSource) {
        this.hikariDataSource = hikariDataSource;
    }

    public void shutdownPool() {
        hikariDataSource.close();
    }

    public void evictAllConnections() {
        HikariPoolMXBean poolProxy = hikariDataSource.getHikariPoolMXBean();
        poolProxy.softEvictConnections();
    }

    @PreDestroy
    public void onDestroy() {
        hikariDataSource.close();
    }
}
