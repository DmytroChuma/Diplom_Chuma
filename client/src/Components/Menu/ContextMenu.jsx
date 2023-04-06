import React from 'react';

import PropTypes from 'prop-types';

export default function ContextMenu({ children, cX, cY }) {
  const style = {
    position: 'absolute',
    left: cX,
    top: cY
  };

    return(
      <div className="contex-menu" id="contex-menu" style={style}>
        {children}
      </div>
    )
  }

  ContextMenu.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element.isRequired
    ]),
    cX: PropTypes.number.isRequired,
    cY: PropTypes.number.isRequired,
  }