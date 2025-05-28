import React from "react";
import "../../styles/cadastro.css";
import Header from "../../components/header/header";
import Input from "../../components/input/input";
import Select from "../../components/select/select";



const CadastroProva: React.FC = () => {
    return (
        <div>
            {/* <Header title={prova.id ? "editar Turma" : "Cadastro de Turma"} /> */}
            <Header title={"CADASTRO DE PROVA"} />

            <div className="container relative">
                <form action="" className="form-cadastro center">
                    <h1>INFORMAÇÕES DA PROVA</h1>
                    <div className="grid-2e1">
                        <Input label={"Nome da Prova*"} type={"text"} value={""} placeholder="Digite o nome da prova" />
                        <Select label={"Bimestre*"} name={""} value={""} options={[]} title={"o bimestre"} />
                    </div>
                    <div className="grid-rep3">
                        <Select label={"Turma*"} name={""} value={""} options={[]} title={"a turma"} />
                        <Select label={"Matéria*"} name={""} value={""} options={[]} title={"a matéria"} />
                        <Input label={"Data da Prova*"} type={"date"} value={""} />
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
}

export default CadastroProva;