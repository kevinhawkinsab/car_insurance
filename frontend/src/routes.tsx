import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./auth/Register";
import Login from "./auth/Login";
import NotFound from "./pages/NotFound";
import History from "./pages/History";
import ProtectedRoute from "./guards/ProtectedRoute";


const appRoutes = createBrowserRouter([
    {
        path: '/',
        element: '',
        children: [
            {
                path: '/',
                element: <ProtectedRoute><Home /></ProtectedRoute>
            },
            {
                path: '/history',
                element: <ProtectedRoute><History /></ProtectedRoute>
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