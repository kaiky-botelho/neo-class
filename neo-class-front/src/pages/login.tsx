import React, { useState } from "react";
import "../styles/login.css";
import Input from "../components/input/input";
import LoginService from "../app/service/loginService"

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("PROFESSOR"); // valor padrão
  const loginService = new LoginService();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let response;

      // Faz o login conforme o tipo de usuário selecionado
      if (tipoUsuario === "PROFESSOR") {
        response = await loginService.loginProfessor(email, senha);
      } else if (tipoUsuario === "SECRETARIA") {
        response = await loginService.loginSecretaria(email, senha);
      }

      // Verifica se a resposta é válida
      if (response?.data) {
        const { token, role, id } = response.data;

        // Salvando os dados no localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        if (id) localStorage.setItem("id", id.toString());
        localStorage.setItem("email", email);

        console.log(`${role} Login Successful:`, { token, role, id });

        // Redirecionando para a página do professor com o ID na URL
        if (role === "PROFESSOR" && id) {
          window.location.href = `/#/homeProfessor/${id}`;
        } else if (role === "SECRETARIA") {
          window.location.href = "/#/homeSecretaria";
        } else {
          setError("Role desconhecida");
        }
      } else {
        setError("Resposta inválida do servidor");
      }
    } catch (err: any) {
      setError(err.response?.data || "Erro ao fazer login");
    }
  };

  return (
    <div className="fundo">
      <div className="container">
        <div className="loginContainer">
          <div className="loginImg">
            <img src="/image/loginImage.png" alt="Login" />
          </div>
          <div className="loginInputs">
            <img src="/image/neoClassLogo.png" alt="" />
            <h1>LOGIN</h1>
            {error && <div className="login-error">{error}</div>}

            <form className="form-login" onSubmit={handleLogin}>
              <label htmlFor="tipoUsuario">Tipo de Usuário:</label>
              <select
                id="tipoUsuario"
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(e.target.value)}
              >
                <option value="PROFESSOR">Professor</option>
                <option value="SECRETARIA">Secretaria</option>
              </select>

              <Input
                label="E-mail"
                type="email"
                placeholder="digite o e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Senha"
                type="password"
                placeholder="digite a senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button type="submit">ENTRAR</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
