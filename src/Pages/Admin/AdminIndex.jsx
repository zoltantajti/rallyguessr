import "../../Styles/_Admin.scss";
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminNavbar from "./Widgets/AdminNavbar";
import AdminTracksAdd from "./Pages/AdminTracksAdd";
import AdminTracksList from "./Pages/AdminTracksList";
import AdminTracksDelete from "./Pages/AdminTracksDelete";

const AdminIndex = () => {
    
    return (
        <div className="adminPanel">
            <AdminNavbar />
            <Routes>
                <Route path="/tracks/add" element={<AdminTracksAdd />} />
                <Route path="/tracks/list" element={<AdminTracksList />} />
                <Route path="/tracks/edit/:id" element={<AdminTracksAdd />} />
                <Route path="/tracks/delete/:id" element={<AdminTracksDelete />} />
            </Routes>
        </div>
    );
};

export default AdminIndex;