import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { usePromiseTracker } from 'react-promise-tracker';
import App from './App';
import './i18n'; 

const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker();

  return ( promiseInProgress && 
      <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.75)",
          position: "fixed",
          top: "0px",
          left: "0px",
          zIndex: "600"
        }}>
          <TailSpin color="#fff" height={100} width={100} /><br/>
        </div>   
  );
};

const routing = (
  <Router>
    <App />
  </Router>
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <LoadingIndicator />
    {routing}
  </>
);