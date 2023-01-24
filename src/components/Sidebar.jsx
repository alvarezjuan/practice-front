/**
 * Declaracion de dependencias
 */
import React, { useState } from 'react';
import {
    FaHome,
    FaBars,
} from "react-icons/fa";
import { NavLink } from 'react-router-dom';

/**
 * Componente de Barra lateral de menu
 */
const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const menuItem = [
        {
            path: "/",
            name: "Gestion de Empresas",
            icon: <FaHome />
        },
    ]
    return (
        <div className="container-flex">
            <div className="row">
                <div className={ isOpen ? "col-4" : "col-1" }>
                    <div className="top_section">
                        <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">Practica</h1>
                        <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                            <FaBars onClick={toggle} />
                        </div>
                    </div>
                    {
                        menuItem.map((item, index) => (
                            <NavLink to={item.path} key={index} className="link" activeclassname="active">
                                <div className="icon">{item.icon}</div>
                                <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                            </NavLink>
                        ))
                    }

                </div>
                <div className={ isOpen ? "col-8" : "col-11" }>
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;