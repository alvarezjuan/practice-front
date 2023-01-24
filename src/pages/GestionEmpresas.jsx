/**
 * Declaracion de dependencias
 */
import React, { useRef, useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, FormGroup, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SimpleReactValidator from 'simple-react-validator';
import 'simple-react-validator/dist/locale/es.js';
import BusinessDataService from '../api/BusinessDataService';
import ProductsReport from '../components/ProductsReport';
import AuthContext from "../contexts/AuthProvider";

/**
 * Componente de Gestion de Empresas
 */
const GestionEmpresas = () => {
  const actualizarValidator = useRef(new SimpleReactValidator({ locale: 'es' }))
  const insertarValidator = useRef(new SimpleReactValidator({ locale: 'es' }))

  const { auth, setAuth } = useContext(AuthContext);

  let [data, setData] = useState([]);
  let [modalActualizar, setModalActualizar] = useState(false);
  let [modalInsertar, setModalInsertar] = useState(false);
  let [form, setForm] = useState({
    id: "",
    nombre: "",
    direccion: "",
    telefono: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    BusinessDataService.getAll()
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
      direccion: "",
      telefono: "",
    });
    setModalInsertar(true);
  };

  const cerrarModalInsertar = () => {
    setModalInsertar(false);
  };

  const editar = (dato) => {
    BusinessDataService.update(dato.id, dato)
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
    var opcion = window.confirm("Está Seguro que desea Eliminar la Empresa " + dato.nombre);
    if (opcion === true) {
      BusinessDataService.delete(dato.id)
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
    BusinessDataService.create(valorNuevo)
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

  const descargarInventario = () => {
    BusinessDataService.getBusinessAndProducts()
      .then(response => {
        ProductsReport.generarReporte(response)
          .then(report => {
            toast.success('Generacion de reporte exitoso');
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
            pom.setAttribute('download', "ReporteEmpresasInventarion.pdf");
            pom.click();
          })
          .catch(err => {
            toast.error(err);
          });
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const emailInventario = () => {
    let email = prompt("Email del destinatario", "noname@acme.org");
    if (email != null) {
      BusinessDataService.postEmailBusinessAndProducts({ email })
        .then(response => {
          toast.success(<a target="_blank" href={response}>Ir a Correo</a>);
        })
        .catch(err => {
          toast.error(err);
        });
    }
  };

  const isAdmin = () => {
    const { roles } = auth;
    if (!roles) {
      return false;
    }
    if (roles.indexOf("admin") > -1) {
      return true;
    }
    return false;
  };

  return (
    <>
      <br />
      <div className='App-header'>
        Gestion Empresas
      </div>
      <br />
      <Container>
        <br />
        {
          isAdmin() &&
          <><Button color='success' onClick={mostrarModalInsertar} disabled={!isAdmin()}>Crear Empresa</Button>{"  "}</>
        }
        <Button color='info' onClick={descargarInventario}>Descargar Inventario</Button>{"  "}
        <Button color='info' onClick={emailInventario}>Email Inventario</Button>
        <br />
        <br />
        <Table>
          <thead>
            <tr>
              <td>NIT</td>
              <td>Nombre</td>
              <td>Direccion</td>
              <td>Telefono</td>
              <td>Acciones</td>
            </tr>
          </thead>
          <tbody>
            {
              data.map((row) => (
                <tr key={row.id}>
                  <td>{row.nit}</td>
                  <td>{row.nombre}</td>
                  <td>{row.direccion}</td>
                  <td>{row.telefono}</td>
                  <td>
                    {
                      isAdmin() &&
                      <><Button color="primary" onClick={() => mostrarModalActualizar(row)}>Editar</Button>{"  "}
                        <Button color="danger" onClick={() => eliminar(row)}>Eliminar</Button>{"  "}</>
                    }
                    <Link to={{
                      pathname: '/gestion-inventario',
                      search: `id=${row.id}&nombre=${row.nombre}`,
                    }} className="btn btn-info">Inventario</Link></td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </Container>
      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <div><h3>Editar Empresa</h3></div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>
              NIT:
            </label>

            <input
              className="form-control"
              type="text"
              id="nit"
              name="nit"
              readOnly
              value={form.nit}
            />
          </FormGroup>

          <FormGroup>
            <label>
              Nombre:
            </label>
            <input
              className="form-control"
              id="nombre"
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

          <FormGroup>
            <label>
              Direccion:
            </label>
            <input
              className="form-control"
              id="direccion"
              name="direccion"
              type="text"
              placeholder="Digite direccion"
              onChange={handleChange}
              value={form.direccion}
              onBlur={() => actualizarValidator.current.showMessageFor('direccion')}
              invalid={actualizarValidator.current.fieldValid('direccion')}
            />
            {actualizarValidator.current.message('direccion', form.direccion, 'required', { className: 'text-danger' })}
          </FormGroup>

          <FormGroup>
            <label>
              Telefono:
            </label>
            <input
              className="form-control"
              id="telefono"
              name="telefono"
              type="text"
              placeholder="Digite telefono"
              onChange={handleChange}
              value={form.telefono}
              onBlur={() => actualizarValidator.current.showMessageFor('telefono')}
              invalid={actualizarValidator.current.fieldValid('telefono')}
            />
            {actualizarValidator.current.message('telefono', form.telefono, 'required|numeric', { className: 'text-danger' })}
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
          <div><h3>Crear Empresa</h3></div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>
              NIT:
            </label>

            <input
              className="form-control"
              id="nit"
              name="nit"
              type="text"
              placeholder="Digite nit"
              onChange={handleChange}
              value={form.nit}
              onBlur={() => insertarValidator.current.showMessageFor('nit')}
              invalid={insertarValidator.current.fieldValid('nit')}
            />
            {insertarValidator.current.message('nit', form.nit, 'required|numeric', { className: 'text-danger' })}
          </FormGroup>

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

          <FormGroup>
            <label>
              Direccion:
            </label>
            <input
              className="form-control"
              name="direccion"
              type="text"
              placeholder="Digite direccion"
              onChange={handleChange}
              value={form.direccion}
              onBlur={() => insertarValidator.current.showMessageFor('direccion')}
              invalid={insertarValidator.current.fieldValid('direccion')}
            />
            {insertarValidator.current.message('direccion', form.direccion, 'required', { className: 'text-danger' })}
          </FormGroup>


          <FormGroup>
            <label>
              Telefono:
            </label>
            <input
              className="form-control"
              name="telefono"
              type="text"
              placeholder="Digite telefono"
              onChange={handleChange}
              value={form.telefono}
              onBlur={() => insertarValidator.current.showMessageFor('telefono')}
              invalid={insertarValidator.current.fieldValid('telefono')}
            />
            {insertarValidator.current.message('telefono', form.telefono, 'required|numeric', { className: 'text-danger' })}
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

export default GestionEmpresas;