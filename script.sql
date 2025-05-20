-- Tabela de Turmas
CREATE TABLE turma (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  ano_letivo  INTEGER       NOT NULL,
  serie       VARCHAR(50)    NOT NULL,
  turno       VARCHAR(20),
  capacidade  INTEGER,
  sala        VARCHAR(50)
);

-- Tabela de Alunos
CREATE TABLE aluno (
  id                  SERIAL PRIMARY KEY,
  nome                VARCHAR(100) NOT NULL,
  data_nascimento     DATE,
  rg                  VARCHAR(20),
  cpf                 VARCHAR(14),
  celular             VARCHAR(20),
  telefone            VARCHAR(20),
  email               VARCHAR(100),
  genero              VARCHAR(20),
  cep                 VARCHAR(10),
  uf                  CHAR(2),
  cidade              VARCHAR(50),
  rua                 VARCHAR(100),
  numero              VARCHAR(10),
  complemento         VARCHAR(50),
  bairro              VARCHAR(50),
  data_matricula      DATE,
  situacao_matricula  VARCHAR(20),
  email_institucional VARCHAR(100),
  senha               VARCHAR(100),
  turma_id            INTEGER REFERENCES turma(id)
);

-- Tabela de Professores
CREATE TABLE professor (
  id                  SERIAL PRIMARY KEY,
  nome                VARCHAR(100) NOT NULL,
  data_nascimento     DATE,
  rg                  VARCHAR(20),
  cpf                 VARCHAR(14),
  estado_civil        VARCHAR(20),
  celular             VARCHAR(20),
  telefone            VARCHAR(20),
  email               VARCHAR(100),
  genero              VARCHAR(20),
  cep                 VARCHAR(10),
  uf                  CHAR(2),
  cidade              VARCHAR(50),
  rua                 VARCHAR(100),
  numero              VARCHAR(10),
  complemento         VARCHAR(50),
  bairro              VARCHAR(50),
  area_formacao       VARCHAR(100),
  situacao_contrato   VARCHAR(50),
  email_institucional VARCHAR(100),
  senha               VARCHAR(100),
  turma_id            INTEGER REFERENCES turma(id)
);

-- Tabela de Matérias
CREATE TABLE materia (
  id           SERIAL PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  bimestre     INTEGER,
  professor_id INTEGER REFERENCES professor(id),
  turma_id     INTEGER REFERENCES turma(id)
);

-- Tabela de Trabalhos
CREATE TABLE trabalho (
  id           SERIAL PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  bimestre     INTEGER       NOT NULL,
  data         DATE,
  nota         NUMERIC(5,2),
  materia_id   INTEGER REFERENCES materia(id),
  turma_id     INTEGER REFERENCES turma(id)
);

-- Tabela de Provas
CREATE TABLE prova (
  id           SERIAL PRIMARY KEY,
  bimestre     INTEGER       NOT NULL,
  data         DATE,
  nota         NUMERIC(5,2),
  professor_id INTEGER REFERENCES professor(id),
  materia_id   INTEGER REFERENCES materia(id),
  turma_id     INTEGER REFERENCES turma(id)
);

-- Tabela de Notas
CREATE TABLE nota (
  id        SERIAL PRIMARY KEY,
  bimestre  INTEGER       NOT NULL,
  valor     NUMERIC(5,2),
  turma_id  INTEGER REFERENCES turma(id),
  aluno_id  INTEGER REFERENCES aluno(id)
);

-- Tabela de Secretaria (usuários da secretaria)
CREATE TABLE secretaria (
  id     SERIAL PRIMARY KEY,
  email  VARCHAR(100) NOT NULL UNIQUE,
  senha  VARCHAR(100) NOT NULL
);

-- Tabela de Notificações (ida e volta aluno ↔ secretaria)
CREATE TABLE notificacao (
  id              SERIAL PRIMARY KEY,
  texto           TEXT        NOT NULL,    
  data_envio      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  aluno_id        INTEGER     NOT NULL REFERENCES aluno(id),
  resposta        TEXT,       
  data_resposta   TIMESTAMP,  
  secretaria_id   INTEGER     REFERENCES secretaria(id),
  status          VARCHAR(20) NOT NULL DEFAULT 'PENDENTE'
);

-- Tabela de Frequência
CREATE TABLE frequencia (
  id         SERIAL PRIMARY KEY,
  data       DATE       NOT NULL,
  presente   BOOLEAN    NOT NULL,
  aluno_id   INTEGER    NOT NULL REFERENCES aluno(id),
  turma_id   INTEGER    NOT NULL REFERENCES turma(id),
  materia_id INTEGER    NOT NULL REFERENCES materia(id)
);
