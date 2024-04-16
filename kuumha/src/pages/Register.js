import React from "react";
function Register() {
    return (
        <>
            <div className="flex h-screen">
                <div className="relative w-1/2 bg-red-600 ">
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-center mt-12">
                        <h1 className="text-3xl ">Registro</h1>
                    </div>
                    <img src="/Login.png" className="object-cover w-full h-full"></img>
                </div>
                <div className="flex items-center justify-center w-1/2 bg-blue-300">
                    <div className="p-5 bg-blue-100 rounded-3xl">
                        <h2 className="justify-center pl-[40%] text-2xl">Login</h2>
                        <form className="mt-4">
                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-2 ">
                                    Nombre
                                <input type="email" id="email" name="email" className="w-full px-4 py-2 rounded border-xl blck focus:outline-none"></input>
                                </label>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-2 ">
                                    Correo electrónico
                                <input type="email" id="email" name="email" className="w-full px-4 py-2 rounded border-xl blck focus:outline-none"></input>
                                </label>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-2 ">
                                    Correo electrónico
                                <input type="email" id="email" name="email" className="w-full px-4 py-2 rounded border-xl blck focus:outline-none"></input>
                                </label>
                            </div>
                            <button type="submit" className="w-full py-3 font-bold bg-blue-200 rounded-lg shadow-lg">Iniciar sesion</button>
                            
                        </form>
                    </div>
                </div>
            </div >
        </>
    );
}

export default Register;
