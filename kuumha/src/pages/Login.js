import { useState } from "react";
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
      setId(result.respuesta.id);
      setRol(result.respuesta.rol_id);

      if (response.ok) {
        setShowModal(true);
      } else {
        setError("Error de autenticación: " + result.error);
      }
    } catch (error) {
      setError("Error al intentar autenticar: " + error.message);
    }
  };

  return (
    <>
      <div className="h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url("/Login.png")` }}>
        <div className="bg-white bg-opacity-30 p-10 rounded-lg max-w-5xl">
          <img src="/kuumha.png" alt="Kuumha Logo" className="w-48 h-auto mx-auto mb-6" />
          {showModal && <ModalLogin id={id} rol={rol} />}
          <Tupla
            tupla="Gmail"
            dato="Gmail"
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
          <div className="flex justify-center mt-6">
            {error && <div className="text-red-600">{error}</div>}
            <button
              className="text-center font-bold text-white rounded-md h-10 px-6 bg-[#185866]"
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
