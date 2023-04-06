import React from 'react';

import PropTypes from 'prop-types';

export default function ContexMenuItem({ text, operation, icon = '' }) {
    return (
        <div className={'context-menu-item'} onClick={operation}>
            <div className={ icon + ' menu-item-icon' }></div>
            {text}
        </div>
    );
}

ContexMenuItem.propTypes = {
    text: PropTypes.string.isRequired,
    operation: PropTypes.func.isRequired,
    icon: PropTypes.string,
}