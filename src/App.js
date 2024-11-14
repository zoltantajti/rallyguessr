import { Route, Routes } from "react-router-dom";
import "./Styles/_App.scss";
import PublicRoute, { PrivateRoute, AdminRoute } from "./Contexts/AuthContext";
import Index from "./Pages/Index";
import Privacy from "./Pages/Privacy";
import Terms from "./Pages/Terms";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Activate from "./Pages/Auth/Activate";
import Start from "./Pages/Private/Start";
import Profile from "./Pages/Private/Profile";
import Account from "./Pages/Private/Account";
import AdminIndex from "./Pages/Admin/AdminIndex";
import PrepareSinglePlayer from "./Pages/SinglePlayer/PrepareSinglePlayer";
import SinglePlayerGame from "./Pages/SinglePlayer/SinglePlayerGame";
import Scoreboard from "./Pages/Private/Scoreboard";
import ProfileExternal from "./Pages/Private/ProfileExternal";
import PrepareMultiPlayer from "./Pages/Multiplayer/PrepareMultiPlayer";
import MPMatchmaking from "./Pages/Multiplayer/MPMatchmaking";
import { WSProvider } from "./WebSocket/WSProvider";
import MultiPlayerDuel from "./Pages/Multiplayer/MultiPlayerDuel";
import { isMobile } from "react-device-detect";
import MobileWarning from "./Widgets/MobileWarning";

function App() {
  /*if(isMobile){ return ( <MobileWarning /> ) };*/
  return (
    <Routes>
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />        
      <Route path="/profile/:uid" element={<ProfileExternal />} />
      <Route element={<PublicRoute />} >
        <Route path="/" element={<Index />} />  
        <Route path="/login" element={<Login />} />        
        <Route path="/register" element={<Register />} />
        <Route path="/activate" element={<Activate />} />
      </Route>
      <Route element={<PrivateRoute />} >
        <Route path="/start" element={<Start />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/account" element={<Account />} />
        {/*Singleplayer*/}
        <Route path="/prepare_singleplayer" element={<PrepareSinglePlayer />} />
        <Route path="/game/singleplayer" element={<SinglePlayerGame />} />
        {/*Multiplayer*/}
        <Route element={<WSProvider />}>
          <Route path="/prepare_multiplayer" element={<PrepareMultiPlayer />} />
          <Route path="/game/matchmaking" element={<MPMatchmaking />} />
          <Route path="/game/duel" element={<MultiPlayerDuel />} />
        </Route>
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route element={<AdminRoute />} >
          <Route path="/admin/*" element={<AdminIndex />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
