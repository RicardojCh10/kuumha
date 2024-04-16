// import React from "react";
import { Outlet } from "react-router-dom";

function title() {
  return (
    <>
      <div className="h-20 w-full bg-[#185866]  text-white uppercase text-4xl font-bold ">
        <h1 className="text-center py-5">APP KUUMHA</h1>
      </div>
      <Outlet />
    </>
  );
}

export default title;
