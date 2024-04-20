import React from 'react';
import { FiHome, FiUser, FiBell } from 'react-icons/fi';

function Sidebar() {
    return (
        <>
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-screen w-16 bg-[#0D245D] flex flex-col items-center justify-center z-50">
    
            {/* Logo */}
            <div className="flex flex-col items-center mb-4">
                <img src="kuumha.png" alt="Logo de KUMMHA" className="h-15 w-15"/>
            </div>
    
            {/* Link HOME */}
            <div className="flex flex-col items-center">
                <FiHome className="text-white text-2xl" />
                <span className="mt-2 text-xs text-white">MENU</span>
            </div>
    
            {/* Link PROFILE */}
            <div className="flex flex-col items-center mt-8">
                <FiUser className="text-white text-2xl" />
                <span className="mt-2 text-xs text-white">PERLFIL</span>
            </div>
        </div>
    </>
    
    );
}

export default Sidebar;
