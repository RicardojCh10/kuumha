import { useState } from "react";
// import Logo from "../image/logo.png";
import Tupla from "../components/tupla";
import ModalLogin from "./modalLogin";

function Login() {
  const [user, setUser] = useState({
    gmail: "",
    pass: "",
  });

  const [id, setId] = useState(null);
  const [rol, setRol] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e, field) => {
    setUser({
      ...user,
      [field]: e.target.value.trim(), // Eliminar espacios en blanco al principio y al final
    });
  };

  // console.log(id);
  // console.log(rol);

  const handleLogin = async () => {
    try {
      // Validar campos
      if (!user.gmail || !user.pass) {
        setError("Por favor, completa todos los campos.");
        return;
      }

      const response = await fetch("http://localhost:8082/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();
      setId (result.respuesta.id);
      // console.log(result.respuesta.id_mechanic);
      setRol (result.respuesta.rol_id);
      // console.log(result.respuesta.rol_id);


      if (response.ok) {

        setShowModal(true);
      }  else {
        setError("Error de autenticación: " + result.error);
      }
    
    } catch (error) {
      setError("Error al intentar autenticar: " + error.message);
    }
  };

  return (
    <>
      <div className="container w-[480px] h-[500px] rounded-xl items-center mt-[7.5%] m-auto my-auto bg-[#b1c9ce]">
      {showModal && <ModalLogin id={id}  rol={rol} />}
        <div>
          {/* <img
            src={Logo}
            alt="Logo"
            id="logo"
            className="items-center m-auto mb-0 w-[45%]"
          /> */}
        </div>
        <div className="mx-9">
          <Tupla
            tupla="gmail"
            dato="gmail"
            descripcion="Ingresa tu correo"
            value={user.gmail}
            change={(e) => handleChange(e, "gmail")}
          />
          <Tupla
            tupla="Contraseña"
            dato="password"
            descripcion="Ingresa tu contraseña"
            value={user.pass}
            change={(e) => handleChange(e, "pass")}
          />
          <div className="flex flex-col self-center items-center">
            {error && <div className="text-red-600">{error}</div>}
            <button
              className="text-center font-bold mx-4 mt-2 text-white rounded-2xl h-[%100] p-1 bg-[#185866] w-96"
              onClick={handleLogin}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
