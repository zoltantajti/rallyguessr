import React from 'react';

const FaIcon = ({type, icon, size = '1x', anim = '', text = '', args = '', style = {}, onClick}) => {
    return (
        <>
            <i className={`fa-${type} fa-${icon} fa-${size} ${anim} ${args}`} style={style} onClick={onClick}></i>
            {text && (
                <>
                    <br/>
                    {text}
                </>
            )}
        </>
    );
};

export default FaIcon;