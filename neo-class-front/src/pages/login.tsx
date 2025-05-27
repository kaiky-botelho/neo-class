// src/views/login.tsx
import React, { useState } from "react";
import "../styles/login.css";
import Input from "../components/input/input";
import secretariaService from "../app/service/secretariaService";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");

    // Corrija aqui: adicione o parâmetro 'e' no handleLogin
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const response = await secretariaService.login(email, senha);
            const { token } = response.data;

            localStorage.setItem("token", token);
            console.log("Token:", token);
            window.location.href = "/#/homeSecretaria";
        } catch (error: any) {
            setError(error.response?.data || "Erro ao fazer login");
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
                        {/* FORMULARIO COMEÇA AQUI */}
                        <form className="form-login" onSubmit={handleLogin}>
                            <Input
                                label={"E-mail"}
                                type={"email"}
                                placeholder={"digite o e-mail"}
                                value={email}
                                onChange={(e: any) => setEmail(e.target.value)}
                            />
                            <Input
                                label={"Senha"}
                                type={"password"}
                                placeholder={"digite a senha"}
                                value={senha}
                                onChange={(e: any) => setSenha(e.target.value)}
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