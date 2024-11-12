import React, { useEffect, useState } from 'react';
import "../../i18n";
import SwitchLang from '../../Widgets/Global/SwitchLang';
import { UserModel } from '../../Datas/Models/UserModel';
import ProfileBox from '../../Widgets/Private/ProfileBox';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getFantasyName, getLevelMax, getLevelMaxInMySkill, getLevelMin, getLevelName } from '../../Datas/Levels';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Utils/Firebase';


const Profile = () => {
    const user = UserModel.load();
    const { t, i18next } = useTranslation();
    //Played matches and scores
    const [sp_orb, setSPOrb] = useState({games: 0, avgScore: 0, maxScore: 0});
    const [sp_erc, setSPErc] = useState({games: 0, avgScore: 0, maxScore: 0});
    const [sp_wrc, setSPWrc] = useState({games: 0, avgScore: 0, maxScore: 0});
    
    //Raking on SP categories
    const [orbRaking, setORBRaking] = useState(null);
    const [ercRaking, setERCRaking] = useState(null);
    const [wrcRaking, setWRCRaking] = useState(null);

    const fetchSPResults = async () => {
        const sp_orb_query = query(collection(db,"results"), where("uid","==",user.__get('uid')), where("gamemode","==","singleplayer"), where("topic","==","ORB"));
        const sp_orb_snapshot = await getDocs(sp_orb_query);
        const fetched_orb_results = sp_orb_snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if(fetched_orb_results.length > 0){
            const points = fetched_orb_results.map(result => result.point);
            const max = Math.max(...points);
            const average = points.reduce((sum,value) => sum + value, 0) / points.length;
            setSPOrb({ 
                games: (fetched_orb_results.length === 0) ? "-" : fetched_orb_results.length, 
                avgScore: (average === 0) ? '-' : average, 
                maxScore: (max === 0) ? '-' : max
            });
        };

        const sp_erc_query = query(collection(db,"results"), where("uid","==",user.__get('uid')), where("gamemode","==","singleplayer"), where("topic","==","ERC"));
        const sp_erc_snapshot = await getDocs(sp_erc_query);
        const fetched_erc_results = sp_erc_snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if(fetched_erc_results.length > 0){
            const e_points = fetched_erc_results.map(result => result.point);
            const e_max = Math.max(...e_points);
            const e_average = e_points.reduce((sum,value) => sum + value, 0) / e_points.length;
            setSPErc({ 
                games: (fetched_erc_results.length === 0) ? '-' : fetched_erc_results.length, 
                avgScore: e_average, 
                maxScore: e_max 
            });
        };

        const sp_wrc_query = query(collection(db,"results"), where("uid","==",user.__get('uid')), where("gamemode","==","singleplayer"), where("topic","==","ERC"));
        const sp_wrc_snapshot = await getDocs(sp_wrc_query);
        const fetched_wrc_results = sp_wrc_snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if(fetched_wrc_results.length > 0){
            const w_points = fetched_wrc_results.map(result => result.point);
            const w_max = Math.max(...w_points);
            const w_average = w_points.reduce((sum,value) => sum + value, 0) / w_points.length;
            setSPWrc({ games: fetched_erc_results.length, avgScore: w_average, maxScore: w_max });
        };
    }
    const fetchAndRankUsers = async () => {
        /*ORB & Singleplayer Ranks*/
        const orbQuery = query(collection(db,"results"), where("gamemode","==","singleplayer"), where("topic","==","ORB"));
        const orbSnapshot = await getDocs(orbQuery);
        const orbUsers = orbSnapshot.docs.map(doc => ({ id: doc.id, userID: doc.data().uid, point: doc.data().point}));
        const sortedOrbUsers = orbUsers.sort((a, b) => b.point - a.point);
        const orbRank = sortedOrbUsers.findIndex(_user => _user.userID === user.__get('uid')) + 1;
        setORBRaking((orbRank === 0) ? "--" : orbRank);
        /*ERC & Singleplayer Ranks*/
        const ercQuery = query(collection(db,"results"), where("gamemode","==","singleplayer"), where("topic","==","ERC"));
        const ercSnapshot = await getDocs(ercQuery);
        const ercUsers = ercSnapshot.docs.map(doc => ({ id: doc.id, userID: doc.data().uid, point: doc.data().point}));
        const sortedErcUsers = ercUsers.sort((a, b) => b.point - a.point);
        const ercRank = sortedErcUsers.findIndex(_user => _user.userID === user.__get('uid')) + 1;
        setERCRaking((ercRank === 0) ? "--" : ercRank);
        /*ERC & Singleplayer Ranks*/
        const wrcQuery = query(collection(db,"results"), where("gamemode","==","singleplayer"), where("topic","==","WRC"));
        const wrcSnapshot = await getDocs(wrcQuery);
        const wrcUsers = wrcSnapshot.docs.map(doc => ({ id: doc.id, userID: doc.data().uid, point: doc.data().point}));
        const sortedWrcUsers = wrcUsers.sort((a, b) => b.point - a.point);
        const wrcRank = sortedWrcUsers.findIndex(_user => _user.userID === user.__get('uid')) + 1;
        setWRCRaking((wrcRank === 0) ? "--" : wrcRank);
    }


    useEffect(() => {
        fetchSPResults();
        fetchAndRankUsers();
    },[]);

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
                        <span className="sectionTitle oswald-700">{t('statisticTitle')}: {t('stat_singleplayer')}</span>
                        <div className="sectionBars"></div>
                    </div>
                    <Row>
                        {/*Singleplayer: WRC Stat*/}
                        <Col md={3} className="mb-3">
                            <div className="statisticBoard text-center" style={{position:'relative'}}>
                                <span className="sectionTitle oswald-700">{t('stat_playedGame')}</span><br/>
                                <span className="sectionTitle size-24 oswald-700 color-yellow">{t('stat_rank_wrc')}</span>
                                <div className="sectionTitle color-white size-48 oswald-700">{sp_wrc.games}</div>
                                <div className="sectionTitle text-center" style={{position:'absolute',left:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(sp_wrc.avgScore).toFixed(0)}</b>
                                    <div className="oswald oswald-700 size-16 text-center">{t('avgScore')}</div>
                                </div>
                                <div className="sectionTitle text-center" style={{position:'absolute',right:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(sp_wrc.maxScore).toFixed(0)}</b>
                                    <div className="oswald oswald-700 size-16 text-center">{t('maxScore')}</div>
                                </div>
                            </div>
                        </Col>
                        {/*Singleplayer: ERC Stat*/}
                        <Col md={3} className="mb-3">
                            <div className="statisticBoard text-center" style={{position:'relative'}}>
                                <span className="sectionTitle oswald-700">{t('stat_playedGame')}</span><br/>
                                <span className="sectionTitle size-24 oswald-700 color-yellow">{t('stat_rank_erc')}</span>
                                <div className="sectionTitle color-white size-48 oswald-700">{sp_erc.games}</div>
                                <div className="sectionTitle text-center" style={{position:'absolute',left:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(sp_erc.avgScore).toFixed(0)}</b>
                                    <div className="oswald oswald-700 size-16 text-center">{t('avgScore')}</div>
                                </div>
                                <div className="sectionTitle text-center" style={{position:'absolute',right:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(sp_erc.maxScore).toFixed(0)}</b>
                                    <div className="oswald oswald-700 size-16 text-center">{t('maxScore')}</div>
                                </div>
                            </div>
                        </Col>
                        {/*Singleplayer: ORB Stat*/}
                        <Col md={3} className="mb-3">
                            <div className="statisticBoard text-center" style={{position:'relative'}}>
                                <span className="sectionTitle oswald-700">{t('stat_playedGame')}</span><br/>
                                <span className="sectionTitle size-24 oswald-700 color-yellow">{t('stat_rank_orb')}</span>
                                <div className="sectionTitle color-white size-48 oswald-700">{sp_orb.games}</div>
                                <div className="sectionTitle text-center" style={{position:'absolute',left:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(sp_orb.avgScore).toFixed(0)}</b>
                                    <div className="oswald oswald-700 size-16 text-center">{t('avgScore')}</div>
                                </div>
                                <div className="sectionTitle text-center" style={{position:'absolute',right:'30px',bottom:'30px'}}>
                                    <b className="text-white size-20">{parseFloat(sp_orb.maxScore).toFixed(0)}</b>
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
                                <div className="sectionTitle color-white size-48 oswald-700">{wrcRaking}</div>
                            </div>
                        </Col>
                        <Col md={3} className="mb-3">
                            <div className="statisticBoard text-center">
                                <span className="sectionTitle oswald-700">{t('stat_rank')}</span><br/>
                                <span className="sectionTitle size-24 oswald-700 color-yellow">{t('stat_rank_erc')}</span>
                                <div className="sectionTitle color-white size-48 oswald-700">{ercRaking}</div>
                            </div>
                        </Col>
                        <Col md={3} className="mb-3">
                            <div className="statisticBoard text-center">
                                <span className="sectionTitle oswald-700">{t('stat_rank')}</span><br/>
                                <span className="sectionTitle size-24 oswald-700 color-yellow">{t('stat_rank_orb')}</span>
                                <div className="sectionTitle color-white size-48 oswald-700">{orbRaking}</div>
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