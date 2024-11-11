import { deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../Utils/Firebase';

const AdminTracksDelete = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        deleteDoc(doc(db,"tracks",id));
        navigate('/admin/tracks/list', {state: {success: false, message: 'Pálya sikeresen törölve!'}});
    },[]);

    return (
        <div>
            
        </div>
    );
};

export default AdminTracksDelete;