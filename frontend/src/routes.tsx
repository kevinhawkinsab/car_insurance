import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./auth/Register";
import Login from "./auth/Login";
import NotFound from "./pages/NotFound";
import History from "./pages/History";


const appRoutes = createBrowserRouter([
    {
        path: '/',
        element: '',
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/history',
                element: <History />
            }
        ]
    },
    {
        path: '/auth',
        children: [
            {
                path: '/auth/register',
                element: <Register />
            },
            {
                path: '/auth/login',
                element: <Login />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound /> 
    }
]);

export default appRoutes;