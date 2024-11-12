import React, { useEffect, useState } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import UserButton from './UserButton';
import { auth } from '../../Utils/Firebase';
import { UserModel } from '../../Datas/Models/UserModel';


const ProfileBox = () => {    

    const user = UserModel.load();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [personalMenu, setPersonalMenu] = useState(false);
    const openPersonalMenu = () => { setPersonalMenu(!personalMenu); };
    const handleLogout = () => { 
        auth.signOut(); 
        user.dispose();
        navigate('/login'); 
    }
    useEffect(() => {const windowClickHandler = (e) => {if(personalMenu && !e.target.closest('.profileBox')){setPersonalMenu(false);}};window.addEventListener('click', windowClickHandler);return () => { window.removeEventListener('click', windowClickHandler); };},[personalMenu]);


    if(typeof user !== "class") return null;
    return (
        <div className="profileBox">
            <Button variant="light" onClick={openPersonalMenu}>
                <UserButton user={user} />
            </Button>
            {(personalMenu) && (
                <ListGroup className="profileMenu">
                    <ListGroupItem as={Link} to="/account">{t('btn_myAccount')}</ListGroupItem>
                    <ListGroupItem as={Link} to="/profile">{t('btn_myProfile')}</ListGroupItem>
                    {(user.__get('perm') >= 98) && (<ListGroupItem as={Link} to="/admin">{t('btn_admin')}</ListGroupItem>)}
                    <ListGroupItem as={Button} onClick={handleLogout}>{t('btn_signOut')}</ListGroupItem>
                </ListGroup>
            )}
        </div>
    );
};

export default ProfileBox;