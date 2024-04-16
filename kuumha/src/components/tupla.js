import React from "react";

function tupla({ tupla, descripcion, dato,value, change }) {
  return (
    <>
      <div className="p-3">
          <label className="text-black font-bold" htmlFor="nombre">
            {tupla}
          </label>
          <input
            id={tupla}
            type={dato}
            value={value}
            onChange={change}
            className="mt-2 h-8 block w-full border-[2px] rounded-2xl border-[#185866] p-3 bg-gray-50"
            placeholder={descripcion}
            name={tupla}
          />
        </div>
    </>
  );
}

export default tupla;
