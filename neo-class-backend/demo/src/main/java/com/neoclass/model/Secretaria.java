package com.neoclass.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "secretaria")
@Data @NoArgsConstructor @AllArgsConstructor
public class Secretaria {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String senha;
}