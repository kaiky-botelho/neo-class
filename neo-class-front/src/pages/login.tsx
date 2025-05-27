import React, { useState } from "react";
import "../styles/login.css";
import Input from "../components/input/input";
import LoginService from "../app/service/loginService";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const loginService = new LoginService();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Tenta login como professor
      const responseProfessor = await loginService.loginProfessor(email, senha);
      const { token, role, id } = responseProfessor.data;

      // Salva dados no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (id) localStorage.setItem("id", id.toString());
      localStorage.setItem("email", email);

      // Redireciona conforme o role
      if (role === "PROFESSOR") {
        window.location.href = `/#/homeProfessor/${id}`;
      } else if (role === "SECRETARIA") {
        window.location.href = "/#/homeSecretaria";
      } else {
        setError("Role desconhecida");
      }
    } catch {
      try {
        // Se falhar, tenta login como secretaria
        const responseSecretaria = await loginService.loginSecretaria(email, senha);
        const { token, role, id } = responseSecretaria.data;

        // Salva dados no localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        if (id) localStorage.setItem("id", id.toString());
        localStorage.setItem("email", email);

        // Redireciona conforme o role
        if (role === "SECRETARIA") {
          window.location.href = "/#/homeSecretaria";
        } else if (role === "PROFESSOR") {
          window.location.href = `/#/homeProfessor/${id}`;
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
