import React from "react";
import SideBar from "../components/sideBar/sideBar";
import { ReactComponent as HomeIcon } from "../assets/icons/home.svg";
import "../styles/teste.css";

const navItems = [
  {
    icon: <HomeIcon className="sideBar-icon" />,
    text: "Teste",
    href: "/teste",
  },
  {
    icon: <HomeIcon className="sideBar-icon" />,
    text: "FAQ",
    href: "/faq",
  },
  {
    icon: <img src="/image/contato.png" alt="Contato" className="sideBar-icon" />,
    text: "Contato",
    href: "/contato",
  },
  {
    icon: <img src="/image/ajuda.png" alt="Ajuda" className="sideBar-icon" />,
    text: "Ajuda",
    href: "/ajuda",
  },
];

const Teste: React.FC = () => {
  return (
    <div>
      <SideBar buttonText={"Sair"} navItems={navItems} />
    </div>

  );
};

export default Teste;
