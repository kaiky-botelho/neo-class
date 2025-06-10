// src/pages/login/index.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import Input from "../components/input/input";
import LoginService from "../app/service/loginService";

interface LoginResponseBackend {
  token: string;
  user: {
    id: number;
    nome: string;
    emailInstitucional: string;
    turmaId?: number | null;
  };
  roles: string[]; // e.g. ["PROFESSOR"] ou ["SECRETARIA"]
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

    let data: LoginResponseBackend | null = null;

    // 1) tenta logar como PROFESSOR
    try {
      const resProf = await loginService.loginProfessor(email, senha);
      data = resProf.data as LoginResponseBackend;
    } catch {
      // 2) se falhar, tenta como SECRETARIA
      try {
        const resSec = await loginService.loginSecretaria(email, senha);
        data = resSec.data as LoginResponseBackend;
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao fazer login");
        return;
      }
    }

    // se chegou aqui, data está preenchido
    const { token, user, roles } = data!;
    const role = roles[0];   // pega a primeira role
    const id = user.id;

    // salva no localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("id", id.toString());
    localStorage.setItem("email", user.emailInstitucional);

    // se for secretaria, salva também secretariaId
    if (role === "SECRETARIA") {
      localStorage.setItem("secretariaId", id.toString());
    }

    // redireciona conforme a role
    if (role === "PROFESSOR") {
      navigate("/homeProfessor", { replace: true });
    } else if (role === "SECRETARIA") {
      navigate("/homeSecretaria", { replace: true });
    } else {
      setError("Role desconhecida: " + role);
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
              <Input
                label="E-mail"
                type="email"
                placeholder="Digite o e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Senha"
                type="password"
                placeholder="Digite a senha"
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
