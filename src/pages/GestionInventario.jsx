/**
 * Declaracion de dependencias
 */
import React, { useRef, useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, FormGroup, ModalFooter } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import SimpleReactValidator from 'simple-react-validator';
import 'simple-react-validator/dist/locale/es.js';
import 'simple-react-validator/dist/locale/es.js';
import ProductDataService from '../api/ProductDataService'
import AuthContext from "../contexts/AuthProvider";

/**
 * Componentes de Gestion de Productos
 */
const GestionInventario = () => {
    const actualizarValidator = useRef(new SimpleReactValidator({ locale: 'es' }))
    const insertarValidator = useRef(new SimpleReactValidator({ locale: 'es' }))

    const { auth } = useContext(AuthContext);

    const location_search = useLocation().search;
    const empresa_id = new URLSearchParams(location_search).get('id');
    const empresa_nombre = new URLSearchParams(location_search).get('nombre');

    let [data, setData] = useState([]);
    let [modalActualizar, setModalActualizar] = useState(false);
    let [modalInsertar, setModalInsertar] = useState(false);
    let [form, setForm] = useState({
        id: "",
        nombre: "",
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        ProductDataService.getAll(empresa_id)
            .then(response => {
                setData(response);
            })
            .catch(err => {
                toast.error(err);
            });
    };

    const mostrarModalActualizar = (dato) => {
        setForm(dato);
        setModalActualizar(true);
    };

    const cerrarModalActualizar = () => {
        setModalActualizar(false);
    };

    const mostrarModalInsertar = () => {
        setForm({
            id: "",
            nombre: "",
        });
        setModalInsertar(true);
    };

    const cerrarModalInsertar = () => {
        setModalInsertar(false);
    };

    const editar = (dato) => {
        ProductDataService.update(dato.id, dato)
            .then(response => {
                toast.success('Edicion exitosa');
                setModalActualizar(false);
                cargarDatos();
            })
            .catch(err => {
                toast.error(err);
            });
    };

    const eliminar = (dato) => {
        var opcion = window.confirm("Está Seguro que desea Eliminar el Producto " + dato.nombre);
        if (opcion == true) {
            ProductDataService.delete(dato.id)
                .then(response => {
                    toast.success('Eliminacion exitosa');
                    setModalInsertar(false);
                    cargarDatos();
                })
                .catch(err => {
                    toast.error(err);
                });
        }
    };

    const insertar = () => {
        var valorNuevo = { ...form };
        ProductDataService.create(empresa_id, valorNuevo)
            .then(response => {
                toast.success('Creacion exitosa');
                setModalInsertar(false);
                cargarDatos();
            })
            .catch(err => {
                toast.error(err);
            });
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const isAdmin = () => {
        const { roles } = auth;
        if (roles.indexOf("admin") > -1) {
          return true;
        }
        return false;
      };
    
        return (
        <>
            <br />
            <div className='App-header'>
                Gestion Inventario para {empresa_nombre}
            </div>
            <br />
            <Container>
                <br />
                {
                    isAdmin() &&
                    <><Button color='success' onClick={mostrarModalInsertar}>Crear Producto</Button></>
                }
                <br />
                <br />
                <Table>
                    <thead>
                        <tr>
                            <td>Nombre</td>
                            <td>Acciones</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.nombre}</td>
                                    <td>
                                        {
                                            isAdmin() &&
                                            <><Button color="primary" onClick={() => mostrarModalActualizar(row)}>Editar</Button>{"  "}
                                                <Button color="danger" onClick={() => eliminar(row)}>Eliminar</Button></>
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <br />
                <br />
                <Link to="/" className="btn btn-info">Regresar</Link>
            </Container>
            <Modal isOpen={modalActualizar}>
                <ModalHeader>
                    <div><h3>Editar Producto</h3></div>
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <label>
                            Nombre:
                        </label>
                        <input
                            className="form-control"
                            name="nombre"
                            type="text"
                            placeholder="Digite nombre"
                            onChange={handleChange}
                            value={form.nombre}
                            onBlur={() => actualizarValidator.current.showMessageFor('nombre')}
                            invalid={actualizarValidator.current.fieldValid('nombre')}
                        />
                        {actualizarValidator.current.message('nombre', form.nombre, 'required', { className: 'text-danger' })}
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => editar(form)}
                        disabled={!actualizarValidator.current.allValid()}
                    >
                        Editar
                    </Button>
                    <Button
                        color="danger"
                        onClick={cerrarModalActualizar}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalInsertar}>
                <ModalHeader>
                    <div><h3>Crear Producto</h3></div>
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <label>
                            Nombre:
                        </label>
                        <input
                            className="form-control"
                            name="nombre"
                            type="text"
                            placeholder="Digite nombre"
                            onChange={handleChange}
                            value={form.nombre}
                            onBlur={() => insertarValidator.current.showMessageFor('nombre')}
                            invalid={insertarValidator.current.fieldValid('nombre')}
                        />
                        {insertarValidator.current.message('nombre', form.nombre, 'required', { className: 'text-danger' })}
                    </FormGroup>

                </ModalBody>

                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={insertar}
                        disabled={!insertarValidator.current.allValid()}
                    >
                        Insertar
                    </Button>
                    <Button
                        className="btn btn-danger"
                        onClick={cerrarModalInsertar}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default GestionInventario;