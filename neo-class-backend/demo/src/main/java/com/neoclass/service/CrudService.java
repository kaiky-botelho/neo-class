package com.neoclass.service;

import java.util.List;

public interface CrudService<T, ID> {
    List<T> listarTodos();
    T buscarPorId(ID id);
    T salvar(T obj);
    void excluir(ID id);
}
