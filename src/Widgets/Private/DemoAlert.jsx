import React from 'react';
import "../../i18n";
import { useTranslation } from 'react-i18next';

const DemoAlert = () => {
    const { t, i18next } = useTranslation();
    return (
        <div style={{position:'absolute',bottom:'100px',right:'100px',zIndex:'99'}} className="animDemo">
            {t('DEMOALERT')}
        </div>
    );
};

export default DemoAlert;