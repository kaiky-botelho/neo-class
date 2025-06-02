// src/pages/login/index.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import Input from "../components/input/input";
import LoginService from "../app/service/loginService";

interface LoginResponse {
  token: string;
  role: "PROFESSOR" | "SECRETARIA";
  id: number;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const loginService = new LoginService();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const resProf = await loginService.loginProfessor(email, senha);
      const { token, role, id } = resProf.data as LoginResponse;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id.toString());
      localStorage.setItem("email", email);

      if (role === "PROFESSOR") {
        navigate("/homeProfessor", { replace: true });
        return;
      }
    } catch {
      // tenta secretaria
    }

    try {
      const resSec = await loginService.loginSecretaria(email, senha);
      const { token, role, id } = resSec.data as LoginResponse;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id.toString());
      localStorage.setItem("email", email);

      if (role === "SECRETARIA") {
        navigate("/homeSecretaria", { replace: true });
        return;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao fazer login");
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
            <img src="/image/neoClassLogo.png" alt="Logo" />
            <h1>LOGIN</h1>
            {error && <div className="login-error">{error}</div>}
            <form className="form-login" onSubmit={handleLogin}>
              <Input label="E-mail" type="email" placeholder="Digite o e-mail" value={email} onChange={e => setEmail(e.target.value)} />
              <Input label="Senha" type="password" placeholder="Digite a senha" value={senha} onChange={e => setSenha(e.target.value)} />
              <button type="submit">ENTRAR</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
