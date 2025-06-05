// src/main/java/com/neoclass/dto/FaltaDTO.java
package com.neoclass.dto;

public class FaltaDTO {
    private Long   materiaId;
    private String materiaNome;
    private Long   totalFaltas;

    // Construtor usado na JPQL acima
    public FaltaDTO(Long materiaId, String materiaNome, Long totalFaltas) {
        this.materiaId   = materiaId;
        this.materiaNome = materiaNome;
        this.totalFaltas = totalFaltas;
    }

    // ——— Somente getters (leitura) ———
    public Long getMateriaId() {
        return materiaId;
    }
    public String getMateriaNome() {
        return materiaNome;
    }
    public Long getTotalFaltas() {
        return totalFaltas;
    }
}
