import React, { useState } from 'react';

import "../../i18n";
import { useTranslation } from 'react-i18next';
import SwitchLang from '../../Widgets/Global/SwitchLang';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProfileBox from '../../Widgets/Private/ProfileBox';
import DemoAlert from '../../Widgets/Private/DemoAlert';
import FaIcon from '../../Widgets/Global/FaIcon';
import Settings from '../../Widgets/Private/Settings';

const Start = () => {
    const { t } = useTranslation();
    const [settingsShow, setSettingsShow] = useState(false);
    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="loginLayout"><SwitchLang onlyBrandImage={true}/></div>
            <div className="app">
                <div className="menuBox">
                    <ListGroup className="menuBox-list">
                        <ListGroupItem as={Link} to="/prepare_singleplayer">{t('mode_singleplayer')}</ListGroupItem>
                        <ListGroupItem as={Link} to="/prepare_multiplayer">{t('mode_multiplayer')}</ListGroupItem>
                        <ListGroupItem style={{borderBottom:'1px solid transparent'}} as={Link} disabled className="disabled" to="/prepare_game">{t('mode_champion')}</ListGroupItem>
                        <ListGroupItem as={Link} to="/scoreboard">{t('scoreboard')}</ListGroupItem>
                    </ListGroup>
                </div>
                <ProfileBox />
                <Settings show={settingsShow} handleClose={() => setSettingsShow(false)}/>
                <DemoAlert />
                <div style={{position:"absolute",bottom:"25px",left:"25px",zIndex:3}} aria-label='Social'>
                    <Link to="/" style={{marginRight:"20px"}}><FaIcon type="brands" icon="facebook-f" size="2x" /></Link>
                    <Link variant="off" onClick={() => setSettingsShow(!settingsShow)} ><FaIcon type="solid" icon="cogs" size="2x" /></Link>
                </div>
                <div style={{position:"absolute",bottom:"25px",right:"25px",zIndex:3}} aria-label='Terms'>
                    <Link to="/privacy">Privacy</Link> | <Link to="/terms">Terms</Link>
                </div>
            </div>            
        </div>
    );
};

export default Start;