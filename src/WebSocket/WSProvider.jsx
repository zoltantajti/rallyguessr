import React, { createContext, useContext } from "react";
import wsi from "./WSService";
import { Outlet } from "react-router-dom";

const WebSocketContext = createContext(null);

export const WSProvider = () => {
    return (
        <WebSocketContext.Provider value={wsi}>
            <Outlet />
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);