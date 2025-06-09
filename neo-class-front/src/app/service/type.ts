export interface AlunoDTO {
  id?: number;
  nome?: string;
  dataNascimento?: string;
  rg?: string;
  cpf?: string;
  celular?: string;
  telefone?: string;
  email?: string;
  genero?: string;
  cep?: string;
  uf?: string;
  cidade?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  dataMatricula?: string;
  situacaoMatricula?: string;
  emailInstitucional?: string;
  senha?: string;
  turmaId?: number;
};

export interface ProfessorDTO {
  id?: number;
  nome?: string;
  dataNascimento?: string;
  rg?: string;
  cpf?: string;
  estadoCivil?: string;
  celular?: string;
  telefone?: string;
  email?: string;
  genero?: string;
  cep?: string;
  uf?: string;
  cidade?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  areaFormacao?: string;
  situacaoContrato?: string;
  emailInstitucional?: string;
  senha?: string;
  turmaId?: number;
};

// src/app/service/type.ts

export type TurmaDTO = {
  id?: undefined | number; 
  nome: string;
  anoLetivo?: number;
  serie: string;
  turno: string;
  capacidade?: number;
  sala: string;
  
};

export type MateriaDTO = {
  id?: number;
  nome: string;
  bimestre: number;
  professorId?: number;
  turmaId?: number;
};

export type NotificacaoDTO = {
  id?: number;
  texto: string;
  dataEnvio?: string;
  alunoId: number;
  resposta?: string;
  dataResposta?: string;
  secretariaId?: number;
  status?: 'PENDENTE' | 'RESPONDIDA';
};

export type TrabalhoDTO = {
  id?: number;
  nome: string;
  bimestre?: number;
  data?: string; 
  nota?: number;
  turmaId?: number;
  materiaId?: number; 
  professorId?: number;
};

export type ProvaDTO = {
  id?: number;
  nome: string;
  bimestre: number;
  data: string;       // Data como string ISO (ex: "2025-05-27")
  nota?: number;
  professorId?: number;
  turmaId?: number;   // usa turmaId para casar com Java
  materiaId?: number; // usa materiaId para casar com Java
};

export type NotaDTO = {
  id?: number;
  bimestre: number;
  valor: number;
  turmaId: number;
  alunoId: number;
};

export interface FrequenciaDTO {
  id?: number;
  data: string;        // data no formato ISO (ex: "2025-06-05")
  presente: boolean;
  alunoId: number;
  turmaId: number;
  materiaId: number;
}
