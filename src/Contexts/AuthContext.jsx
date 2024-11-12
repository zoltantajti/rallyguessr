import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserModel } from '../Datas/Models/UserModel';

const PublicRoute = () => {
    const user = UserModel.load();
    if(user) return <Navigate to="/start" />
    return <Outlet />
};

const PrivateRoute = () => {
    const user = UserModel.load();
    if(!user) return <Navigate to="/login" />
    return <Outlet />;
}

const AdminRoute = () => {
    const user = UserModel.load();
    if(user && user.__get('perm') >= 90) return <Outlet />
    return <Navigate to="/start" />
}

export { PrivateRoute, AdminRoute };
export default PublicRoute;
