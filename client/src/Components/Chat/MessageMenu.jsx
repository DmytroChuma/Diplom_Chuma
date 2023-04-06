import React from "react"
import PropTypes from 'prop-types';

import ContextMenu from '../../Components/Menu/ContextMenu';
import ContexMenuItem from '../../Components/Menu/ContextMenuItem';
import Separate from "../Menu/Separate";

export default function MessageMenu ({ cX, cY, socket }) {
    
    const menuClick = () => {
        console.log(socket);
    }

    return(
        <ContextMenu cX={cX} cY={cY}> 
            <ContexMenuItem text='test' operation={menuClick}/>
            <Separate />
            <ContexMenuItem text='test2' operation={menuClick}/>
        </ContextMenu>
    );
}

ContextMenu.propTypes = {
    cX: PropTypes.number.isRequired,
    cY: PropTypes.number.isRequired,
    socket: PropTypes.object,
}