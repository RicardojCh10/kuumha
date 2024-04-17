import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Perfil from '../pages/Perfil';
import Test from '../pages/Test';


const isAuth = localStorage.getItem("token");
const permission = localStorage.getItem("permission");

const RoutesComponent = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/Register" element={<Register/>} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Perfil" element={<Perfil />} />
                <Route path="/Test" element={<Test/>} />
            </Routes>
        </Router>
    );
};

export default RoutesComponent;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from '../pages/Login';
// import Home from '../pages/Home';
// // import Title from "../components/title";

// import Register from '../pages/Register';
// import { RouterPrivate } from "../components/routerPrivate/routerPrivate";
// // import Perfil from '../pages/Perfil';

// const isAuth = localStorage.getItem("token");
// const permission = localStorage.getItem("permission");

// const RoutesComponent = () => {
//     return (
//         <Router>
//             <Routes>
//                 <Route exact path="/" element={<Login />} />
//                 <Route path="/Register" element={<RouterPrivate isAuth={isAuth !== null} permission={permission == 2}><Register /></RouterPrivate>} />
//                 <Route path="/Home" element={<RouterPrivate isAuth={isAuth !== null} permission={permission == 1}><Home /></RouterPrivate>} />
//             </Routes>
//         </Router>
//     );
// };

// export default RoutesComponent;


// // export const routes = createBrowserRouter([
// //     {
// //       path: "",
// //       element: <Title />,
// //       children: [
// //         {
// //           path: "/",
// //           element: <Login />,
// //         },
// //         {
// //           path: '/Perfil',
// //           element: <RouterPrivate isAuth={isAuth !== null}  permission={ permission == 1 }>
// //           <Perfil/>
// //           </RouterPrivate>
// //         },
// //       ],
// //     },
// //     {
// //       path: "/Register",
// //       element: <RouterPrivate isAuth={isAuth !== null}  permission={ permission == 2 }>
// //       <Register/>,
// //       </RouterPrivate>
// //     },
// //     {
// //       path:'/Home',
// //       element: <RouterPrivate isAuth={isAuth !== null}  permission={ permission == 1 }>
// //       <Home/>
// //       </RouterPrivate>
// //     }
// //   ]);