import React from 'react';

import PropTypes from 'prop-types';

export default function ContexMenuItem({ text, operation, icon }) {
    return (
        <div className={'context-menu-item'} onClick={operation}>
            {text}
        </div>
    );
}

ContexMenuItem.propTypes = {
    text: PropTypes.string.isRequired,
    operation: PropTypes.func.isRequired,
    icon: PropTypes.object,
}