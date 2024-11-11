import React from 'react';
import "../../i18n";
import { useTranslation } from 'react-i18next';
import { Overlay } from 'react-bootstrap';

const FormErrorMessage = ({ error, target }) => {
    const { t, i18next } = useTranslation();
    return (
        (error) && (
            <Overlay target={target.current} show={true} placement="right">
                {({
                    placement: _placement,
                    arrowProps: _arrowProps,
                    show: _show,
                    popper: _popper,
                    hasDoneInitialMeasure: _hasDoneInitialMeasure,
                    ...props
                }) => (
                    <div
                        {...props}
                        style={{
                            position: 'absolute',
                            backgroundColor: 'rgba(255, 100, 100, 0.85)',
                            padding: '2px 10px',
                            color: 'white',
                            borderRadius: 3,
                            zIndex:999,
                            ...props.style,
                        }}
                    >
                        {t(error)}
                    </div>
                )}
            </Overlay>
        )
    );
};

export default FormErrorMessage;