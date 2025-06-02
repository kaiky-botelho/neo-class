import React from "react";
import "../../styles/cadastro.css";
import Header from "../../components/header/header";
import Input from "../../components/input/input";
import Select from "../../components/select/select";

const CadastroTrabalho: React.FC = () => {

    const bimestres = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"];

    return (
        <div>
            <Header title={"CADASTRO DE TRABALHO"} />

            <div className="container relative">
                <form action="" className="form-cadastro center">
                    <h1>INFORMAÇÕES DO TRABALHO</h1>
                    <div className="grid-2e1">
                        <Input
                            label={"Nome do Trabalho*"}
                            type={"text"}
                            value={""}
                            placeholder="Digite o nome do trabalho"
                        />
                        <Select
                            label={"Bimestre*"}
                            name={""}
                            value={""}
                            options={bimestres}
                            title={"o bimestre"} />
                    </div>
                    <div className="grid-rep3">
                        <Select
                            label={"Turma*"}
                            name={""}
                            value={""}
                            options={[]}
                            title={"a turma"}
                        />
                        <Select
                            label={"Matéria*"} 
                            name={""} 
                            value={""} 
                            options={[]} 
                            title={"a matéria"} />
                        <Input label={"Data de Entrega*"} type={"date"} value={""} />
                    </div>
                    <div className="buttons">
                        <a href="/#/homeProfessor" className="btn-voltar">
                            Voltar
                        </a>
                        <button type="submit" className="btn-cadastrar">
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CadastroTrabalho;
