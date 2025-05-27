import React, { useState } from "react";
import "../styles/login.css";
import Input from "../components/input/input";
import ProfessorService from "../app/service/professorService";
import secretariaService from "../app/service/secretariaService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const professorService = new ProfessorService();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const response = await professorService.loginProfessor(email, senha);
    const { token, role, id } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (id) localStorage.setItem("id", id.toString());
    localStorage.setItem("email", email);

    console.log("Login Professor:", { token, role, id });

    if (role === "PROFESSOR") {
      window.location.href = "/#/homeProfessor";
    } else if (role === "SECRETARIA") {
      window.location.href = "/#/homeSecretaria";
    } else {
      setError("Role desconhecida");
    }
  } catch (err: any) {
    try {
      const response = await secretariaService.login(email, senha);
      const { token, role, id } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (id) localStorage.setItem("id", id.toString());
      localStorage.setItem("email", email);

      console.log("Login Secretaria:", { token, role, id });

      if (role === "SECRETARIA") {
        window.location.href = "/#/homeSecretaria";
      } else if (role === "PROFESSOR") {
        window.location.href = "/#/homeProfessor";
      } else {
        setError("Role desconhecida");
      }
    } catch (err2: any) {
      setError(err2.response?.data || "Erro ao fazer login");
    }
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
