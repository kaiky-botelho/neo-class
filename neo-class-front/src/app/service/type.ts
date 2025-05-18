export interface AlunoDTO {
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
  serie?: string;
  turno?: string;
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
  dataAdmissao?: string;
  tipoContrato?: string;
  serie?: string;
  materia?: string;
  turno?: string;
  emailInstitucional?: string;
  senha?: string;
  turmaId?: number;
};

// src/app/service/type.ts

export type TurmaDTO = {
  id?: undefined | number; 
  nome: string;
  ano_letivo?: number;
  serie: string;
  turno: string;
  capacidade?: number;
  sala: string;
};
