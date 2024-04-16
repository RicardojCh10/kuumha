import React, { useState } from "react";
import Tupla from "../components/tupla";

const ModalLogin = ({ id, rol }) => {
  const [confirmacion, setConfirmacion] = useState({
    id: id,
    codigo: "",
  });

  // console.log("rol desde modal ", rol)
  // console.log("id desde modal ", id)

  console.log(confirmacion);

  const handleChange = (e, field) => {
    setConfirmacion({
      ...confirmacion,
      [field]: e.target.value.trim(), // Eliminar espacios en blanco al principio y al final
    });
  };

  const handleModal = async () => {
    try {
      // Validar campos
      if (!confirmacion.codigo) {
        alert("Ingresa el codigo");
        return;
      }

      const response = await fetch("http://localhost:8082/confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmacion),
      });

      const result = await response.json();

      if (response.ok) {

        // ? Habilitar permiso y autenticar para permitir acceso a las rutas

        const { role, token, alias} = result;

        localStorage.setItem("permission", role);
        localStorage.setItem("token", token);
        localStorage.setItem("alias", alias);
        if (rol === 1) {
          return window.location.href = "/Home";
        } else if (rol === 2) {
          return window.location.href = "/Perfil";
        }
      } else {
        console.log("Error de autenticación: " + response.error);
      }
    } catch (error) {
      console.log("Error al intentar autenticar: " + error.message);
    }
  };


  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white p-5 rounded relative">
          <form className="space-y-4">
            <div>
              <label className="block" htmlFor="campo1">
                Ingresa el codigo de verficación :
                <Tupla
                  tupla="Codigo"
                  dato="codigo"
                  descripcion=""
                  value={confirmacion.codigo}
                  change={(e) => handleChange(e, "codigo")}
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleModal}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalLogin;
