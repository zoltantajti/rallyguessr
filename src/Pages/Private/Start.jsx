import React, { useEffect } from 'react';

import "../../i18n";
import { useTranslation } from 'react-i18next';
import SwitchLang from '../../Widgets/Global/SwitchLang';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProfileBox from '../../Widgets/Private/ProfileBox';
import MyStorage from '../../Utils/MyStorage';

const Start = () => {
    const { t, i18n } = useTranslation();
    

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="loginLayout"><SwitchLang onlyBrandImage={true}/></div>
            <div className="app">
                <div className="menuBox">
                    <ListGroup className="menuBox-list">
                        <ListGroupItem as={Link} to="/prepare_singleplayer">{t('mode_singleplayer')}</ListGroupItem>
                        <ListGroupItem as={Link} disabled className="disabled" to="/prepare_game">{t('mode_multiplayer')}</ListGroupItem>
                        <ListGroupItem style={{borderBottom:'1px solid transparent'}} as={Link} disabled className="disabled" to="/prepare_game">{t('mode_champion')}</ListGroupItem>
                        <ListGroupItem as={Link} to="/scoreboard">{t('scoreboard')}</ListGroupItem>
                    </ListGroup>
                </div>
                <ProfileBox />
            </div>            
        </div>
    );
};

export default Start;