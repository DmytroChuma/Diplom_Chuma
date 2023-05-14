import React from "react"
import PropTypes from 'prop-types';

import ContextMenu from '../../Components/Menu/ContextMenu';
import ContexMenuItem from '../../Components/Menu/ContextMenuItem';

export default function RealtorMenu ({ cX, cY, id, name, menu, ...props }) {

    const deleteClick = () => {
        props.deleteHandler(id, name);
        menu('');
    }

    return(
        <ContextMenu cX={cX} cY={cY}>
            <ContexMenuItem text='Виключити з агентства' operation={deleteClick} icon='fa fa-times-circle'/>
        </ContextMenu>
    );
}

RealtorMenu.propTypes = {
    cX: PropTypes.number.isRequired,
    cY: PropTypes.number.isRequired,
    menu: PropTypes.func.isRequired,
}