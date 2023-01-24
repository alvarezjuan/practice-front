/**
 * Declaracion de dependencias
 */
import { useRef, useState, useEffect, useContext } from 'react';
import { Table, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { Input, Button, Label, Container, Row, Col, FormGroup, FormFeedback, FormText, Form } from 'reactstrap';
import { toast } from 'react-toastify';
import SimpleReactValidator from 'simple-react-validator';
import 'simple-react-validator/dist/locale/es.js';
import AuthContext from "../contexts/AuthProvider";
import UserDataService from '../api/UserDataService'

/**
 * Componente de Inicio de Sesion
 */
const Login = ({ children }) => {
    const loginValidator = useRef(new SimpleReactValidator({ locale: 'es' }))

    const { auth, setAuth } = useContext(AuthContext);

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [success, setSuccess] = useState(auth.roles);

    let [form, setForm] = useState({
        email: "",
        pwd: "",
    });
    let [modalLogin, setModalLogin] = useState(true);
    const editar = async (dato) => {

        try {
            const data = await UserDataService.auth(dato.email, dato.pwd);
            const id = data?.user.id;
            const email = data?.user.email;
            const roles = data?.user.roles;
            const accessToken = data?.access_token;
            setAuth({ id, email, roles, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
            toast.success("Inicio de sesion exitoso!");
            setModalLogin(false);
        } catch (err) {
            if (!err?.response) {
                toast.error('Servidor no responde');
            } else if (err.response?.status === 400) {
                toast.error('Falta nombre de usuartio o Clave');
            } else if (err.response?.status === 401) {
                toast.error('No autorizado');
            } else {
                toast.error('Fallo el inicio de sesion');
            }
        }

    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            {success ? (
                <section>
                    {children}
                </section>
            ) : (
                <section>
                    <Modal isOpen={modalLogin}>
                        <ModalHeader>
                            <div><h3>Inicio de Sesi&oacute;n</h3></div>
                        </ModalHeader>

                        <ModalBody>
                            <FormGroup>
                                <Label for="email">Usuario:</Label>
                                <Input className="form-control"
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Digite email"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    onBlur={() => loginValidator.current.showMessageFor('email')}
                                    value={form.email}
                                    invalid={loginValidator.current.fieldValid('email')} />
                                {loginValidator.current.message('email', form.email, 'required|email', { className: 'text-danger' })}
                            </FormGroup>
                            <br />
                            <FormGroup>
                                <Label for="pwd">Clave:</Label>
                                <Input className="form-control"
                                    type="password"
                                    id="pwd"
                                    name="pwd"
                                    placeholder="Digite clave"
                                    autoComplete="off"
                                    onChange={handleChange}
                                    onBlur={() => loginValidator.current.showMessageFor('pwd')}
                                    value={form.pwd}
                                    invalid={loginValidator.current.fieldValid('pwd')} />
                                {loginValidator.current.message('pwd', form.pwd, 'required', { className: 'text-danger' })}
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color="primary"
                                onClick={() => editar(form)}
                                disabled={!loginValidator.current.allValid()}
                            >
                                Iniciar Sesi&oacute;n
                            </Button>
                        </ModalFooter>
                    </Modal>

                </section>
            )}
        </>
    )
}

export default Login;