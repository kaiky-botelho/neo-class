-- Tabela de Turmas
CREATE TABLE turma (
  id BIGSERIAL PRIMARY KEY,
  nome_turma VARCHAR(100) NOT NULL,
  ano_letivo INTEGER NOT NULL,
  serie VARCHAR(50) NOT NULL,
  turno VARCHAR(20) NOT NULL,
  capacidade INTEGER,
  sala VARCHAR(50)
);

-- Tabela de Professores
CREATE TABLE professor (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  data_nascimento DATE,
  rg VARCHAR(20),
  cpf VARCHAR(14),
  estado_civil VARCHAR(30),
  celular VARCHAR(20),
  telefone VARCHAR(20),
  email VARCHAR(150),
  genero VARCHAR(20),
  cep VARCHAR(10),
  uf CHAR(2),
  cidade VARCHAR(100),
  rua VARCHAR(150),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  area_formacao VARCHAR(100),
  data_admissao DATE,
  tipo_contrato VARCHAR(50),
  email_institucional VARCHAR(150),
  senha VARCHAR(255)
);

-- Tabela de Alunos
CREATE TABLE aluno (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  data_nascimento DATE,
  rg VARCHAR(20),
  cpf VARCHAR(14),
  estado_civil VARCHAR(30),
  celular VARCHAR(20),
  telefone VARCHAR(20),
  email VARCHAR(150),
  genero VARCHAR(20),
  cep VARCHAR(10),
  uf CHAR(2),
  cidade VARCHAR(100),
  rua VARCHAR(150),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  serie VARCHAR(50),
  turno VARCHAR(20),
  data_matricula DATE,
  situacao_matricula VARCHAR(30),
  email_institucional VARCHAR(150),
  senha VARCHAR(255),
  turma_id BIGINT REFERENCES turma(id)
);

-- Tabela de Matérias
CREATE TABLE materia (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  bimestre VARCHAR(20),
  professor_id BIGINT NOT NULL REFERENCES professor(id),
  turma_id     BIGINT NOT NULL REFERENCES turma(id)
);

-- Tabela de Trabalhos
CREATE TABLE trabalho (
  id BIGSERIAL PRIMARY KEY,
  bimestre VARCHAR(20) NOT NULL,
  nome_trabalho VARCHAR(150) NOT NULL,
  data DATE NOT NULL,
  nota NUMERIC(5,2),
  professor_id BIGINT NOT NULL REFERENCES professor(id),
  materia_id   BIGINT NOT NULL REFERENCES materia(id)
);

-- Tabela de Provas
CREATE TABLE prova (
  id BIGSERIAL PRIMARY KEY,
  bimestre VARCHAR(20) NOT NULL,
  data DATE NOT NULL,
  nota NUMERIC(5,2),
  professor_id BIGINT NOT NULL REFERENCES professor(id),
  materia_id   BIGINT NOT NULL REFERENCES materia(id)
);

-- Tabela de Notas Gerais
CREATE TABLE nota (
  id BIGSERIAL PRIMARY KEY,
  bimestre VARCHAR(20) NOT NULL,
  nota NUMERIC(5,2),
  aluno_id BIGINT NOT NULL REFERENCES aluno(id),
  turma_id BIGINT NOT NULL REFERENCES turma(id)
);
