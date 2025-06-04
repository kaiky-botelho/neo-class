// src/main/java/com/neoclass/repository/MateriaRepository.java
package com.neoclass.repository;

import com.neoclass.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MateriaRepository extends JpaRepository<Materia, Long> {
    // Herda findAll(), findById(), save(), deleteById() etc.
}
