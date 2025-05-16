import React from "react";
import Header from "../../components/header/header";
import Input from "../../components/input/input";
import "../../styles/cadastro.css";

const CadastroAluno: React.FC = () => {
    return (
        <div>
            <Header title="Cadastro de Aluno" />
            <div className="container">
                <form>
                    <h1>INFORMAÇÕES PESSOAIS</h1>
                    <div className="grid-2e1">
                        <Input label={"NOME COMPLETO*"} type={"text"} placeholder={"Digite o nome completo"} value={""} />
                        <Input label={"DATA DE NASCIMENTO*"} type={"date"} value={""} />
                    </div>
                    <div className="grid-1e1">
                        <Input label={"CPF*"} type={"text"} placeholder={"Digite o CPF"} value={""} />
                        <Input label={"RG*"} type={"text"} placeholder={"Digite o RG"} value={""} />
                    </div>
                    <div className="grid-rep3">
                        <Input label={"ESTADO CIVIL*"} type={"text"} placeholder={"Digite o CPF"} value={""} />
                        <Input label={"CELULAR*"} type={"text"} placeholder={"Digite o cdlular"} value={""} />
                        <Input label={"TELEFONE*"} type={"text"} placeholder={"Digite o telefone"} value={""} />
                    </div>
                    <div className="grid-2e1">
                        <Input label={"EMAIL*"} type={"text"} placeholder={"Digite o email"} value={""} />
                        <Input label={"GÊNERO*"} type={"text"} placeholder={"Digite o gênero"} value={""} />
                    </div>
                    <h1>ENDEREÇO</h1>
                    <div className="grid-rep3">
                        <Input label={"CEP*"} type={"text"} placeholder={"Digite o CEP"} value={""} />
                        <Input label={"UF*"} type={"text"} placeholder={"Digite o uf"} value={""} />
                        <Input label={"CIDADE*"} type={"text"} placeholder={"Digite a cidade"} value={""} />
                    </div>
                    <div className="grid-2e1">
                        <Input label={"RUA*"} type={"text"} placeholder={"Digite a rua"} value={""} />
                        <Input label={"NÚMERO*"} type={"text"} placeholder={"Digite o número"} value={""} />
                    </div>
                    <div className="grid-1e1">
                        <Input label={"BAIRRO*"} type={"text"} placeholder={"Digite o bairro"} value={""} />
                        <Input label={"COMPLEMENTO*"} type={"text"} placeholder={"Digite o complemento"} value={""} />
                    </div>
                    <h1>INFORMAÇÕES ACADÊMICAS</h1>
                </form>
            </div>
        </div>
    );
}

export default CadastroAluno;