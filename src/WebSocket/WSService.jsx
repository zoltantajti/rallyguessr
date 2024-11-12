const wsi = new WebSocket("ws://localhost:8080");

wsi.onopen = () => {
    console.log("WebSocket connected");
};

wsi.onclose = () => {
    console.log("WebSocket disconnected");
};

wsi.onmessage = (message) => {
    message = message.data;
    console.log(message);
}

wsi.onerror = (error) => {
    console.error("WebSocket error", error);
};

export default wsi;
export const WSISend = (message) => { if(wsi && wsi.readyState === WebSocket.OPEN){ wsi.send(message); }else{ console.warn("Websocket is not open!"); }; };
export const WSIClose = () => { wsi.close(); console.warn("Websocket disconnected!"); };