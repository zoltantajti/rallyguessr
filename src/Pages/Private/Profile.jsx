import React, { useEffect, useState } from 'react';
import "../../i18n";
import SwitchLang from '../../Widgets/Global/SwitchLang';
import { UserModel } from '../../Datas/Models/UserModel';
import ProfileBox from '../../Widgets/Private/ProfileBox';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getFantasyName, getLevelMax, getLevelMaxInMySkill, getLevelMin, getLevelName } from '../../Datas/Levels';


const Profile = () => {
    const user = UserModel.load();
    const { t, i18next } = useTranslation();
    const [sp, setSp] = useState({games: 0, avgScore: 0, maxScore: 0});
    const [mp, setMp] = useState({games: 0, avgScore: 0, maxScore: 0});
    const [ch, setCp] = useState({games: 0, avgScore: 0, maxScore: 0});


    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="loginLayout"><SwitchLang onlyBrandImage={true} /></div>
            <div className="app">
                <ProfileBox user={user} />
                <Container style={{marginTop:'20px'}}>
                    <Row>
                        <Col md={4}>
                            <img src={user.__get('avatar')} style={{width:"100%"}} alt="ProfileAvatar"/>
                        </Col>
                        <Col md={8} className="profile-user-box">
                            <div className="sectionTitle-frame mb-3">
                                <span className="sectionTitle oswald-700">{t(getFantasyName(user.__get('level')))}</span>
                            </div>
                            <div className="userName">
                                {user.__get('username')}
                                {(user.__get('country') !== "N/A") && (<img style={{ position: 'relative', top: '-1px', left: '5px' }} src={`https://flagsapi.com/${user.__get('country')}/shiny/24.png`} alt="flag" />)}
                                <div className="displayLevel">
                                    <span className="levelName">{getLevelName(user.__get('level'))}</span>
                                    <progress style={{color:"#000"}} className="levelProgress" min={getLevelMin(user.__get('level'))} max={getLevelMax(user.__get('level'))} value={user.__get('exp')}/>
                                    <span className="levelName" style={{position:'relative',left:'15px'}}> {user.__get('exp')} / {getLevelMaxInMySkill(user.__get('exp'))}</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    {/*Statisztikák*/}
                    <div className="sectionTitle-frame mb-3" style={{marginTop:"15px",marginBottom:"15px"}}>
                        <span className="sectionTitle oswald-700">{t('statisticTitle')}</span>
                        <div className="sectionBars"></div>
                    </div>
                    <Row>
                        {/*SinglePlayer stat*/}
                        <Col md={3} className="mb-3">
                            <div className="statisticBoard text-center" style={{position:'relative'}}>
                                <span className="sectionTitle oswald-700">{t('stat_playedGame')}</span><br/>
                                <span className="sectionTitle size-24 oswald-700 color-yellow">{t('stat_singleplayer')}</span>
                                <div className="sectionTitle color-white size-48 oswald-700">{sp.games}</div>
                                <div className="sectionTitle text-center" style={{position:'absolute',left:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(sp.avgScore).toFixed(0)}</b>
                                    <div className="oswald oswald-700 size-16 text-center">{t('avgScore')}</div>
                                </div>
                                <div className="sectionTitle text-center" style={{position:'absolute',right:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(sp.maxScore).toFixed(0)}</b>
                                    <div className="oswald oswald-700 size-16 text-center">{t('maxScore')}</div>
                                </div>
                            </div>
                        </Col>
                        {/*Párbaj (Többjátékos)*/}
                        <Col md={3} className="mb-3">
                            <div className="statisticBoard text-center" style={{position:'relative'}}>
                                <span className="sectionTitle oswald-700">{t('stat_playedGame')}</span><br/>
                                <span className="sectionTitle size-24 oswald-700 color-yellow">{t('stat_multiplayer')}</span>
                                <div className="sectionTitle color-white size-48 oswald-700">{mp.games}</div>
                                <div className="sectionTitle text-center" style={{position:'absolute',left:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(mp.avgScore).toFixed(0)}</b>
                                    <div className="oswald oswald-700 size-16 text-center">{t('avgScore')}</div>
                                </div>
                                <div className="sectionTitle text-center" style={{position:'absolute',right:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(mp.maxScore).toFixed(0)}</b>
                                    <div className="oswald oswald-700 size-16 text-center">{t('maxScore')}</div>
                                </div>
                            </div>
                        </Col>
                        {/*Bajnokság*/}
                        <Col md={3} className="mb-3">
                            <div className="statisticBoard text-center" style={{position:'relative'}}>
                                <span className="sectionTitle oswald-700">{t('stat_playedGame')}</span><br/>
                                <span className="sectionTitle size-24 oswald-700 color-yellow">{t('stat_champion')}</span>
                                <div className="sectionTitle color-white size-48 oswald-700">{ch.games}</div>
                                <div className="sectionTitle text-center" style={{position:'absolute',left:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(ch.avgScore).toFixed(0)}</b>
                                    <div className="oswald oswald-700 size-16 text-center">{t('avgScore')}</div>
                                </div>
                                <div className="sectionTitle text-center" style={{position:'absolute',right:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(ch.maxScore).toFixed(0)}</b>
                                    <div className="oswald oswald-700 size-16 text-center">{t('maxScore')}</div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} className="mb-3">
                            <div className="statisticBoard text-center">
                                <span className="sectionTitle oswald-700">{t('stat_rank')}</span><br/>
                                <span className="sectionTitle size-24 oswald-700 color-yellow">{t('stat_rank_wrc')}</span>
                                <div className="sectionTitle color-white size-48 oswald-700">0</div>
                            </div>
                        </Col>
                        <Col md={3} className="mb-3">
                            <div className="statisticBoard text-center">
                                <span className="sectionTitle oswald-700">{t('stat_rank')}</span><br/>
                                <span className="sectionTitle size-24 oswald-700 color-yellow">{t('stat_rank_erc')}</span>
                                <div className="sectionTitle color-white size-48 oswald-700">0</div>
                            </div>
                        </Col>
                        <Col md={3} className="mb-3">
                            <div className="statisticBoard text-center">
                                <span className="sectionTitle oswald-700">{t('stat_rank')}</span><br/>
                                <span className="sectionTitle size-24 oswald-700 color-yellow">{t('stat_rank_orb')}</span>
                                <div className="sectionTitle color-white size-48 oswald-700">0</div>
                            </div>
                        </Col>
                    </Row>
                    {/*Trófeák*/}
                    <div className="sectionTitle-frame mb-3" style={{marginTop:"15px",marginBottom:"15px"}}>
                        <span className="sectionTitle oswald-700">{t('trophyTitle')}</span>
                        <div className="sectionBars"></div>
                    </div>
                    <Row>
                        <Col md={12}>
                            <div className="trophyBoard text-center">
                                {t('noTrophy')}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Profile;