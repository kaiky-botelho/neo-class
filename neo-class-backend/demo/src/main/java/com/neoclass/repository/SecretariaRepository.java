// src/main/java/com/neoclass/repository/SecretariaRepository.java
package com.neoclass.repository;

import com.neoclass.model.Secretaria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SecretariaRepository extends JpaRepository<Secretaria, Long> {
    Optional<Secretaria> findByEmailAndSenha(String email, String senha);
}
