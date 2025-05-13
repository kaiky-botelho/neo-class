// src/views/login.tsx
import React from "react";
import "../styles/login.css";
import Input from "../components/input/input";


const Login: React.FC = () => {

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
                        <Input label={"E-mail"} type={"email"} placeholder={"digite o e-mail"}></Input>
                        <Input label={"Senha"} type={"password"} placeholder={"digite a senha"}></Input>
                        <button>ENTRAR</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
