import React from "react"
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import ContextMenu from '../../Components/Menu/ContextMenu';
import ContexMenuItem from '../../Components/Menu/ContextMenuItem';
import Separate from "../Menu/Separate";

export default function MessageMenu ({ cX, cY, text, id, menu, ...props }) {
    
    let location = useLocation();

    const editClick = () => {
        props.editHandler(text, id, 'edit');
        menu('');
    }

    const answearClick = () => {
        props.editHandler(text, id, 'long-arrow-left');
        menu('');
    }

    const copyClick = () => {
        navigator.clipboard.writeText(text)
        menu('');
    }

    const deleteClick = () => {
        props.deleteHandler(id);
        menu('');
    }

    return(
        <ContextMenu cX={cX} cY={cY}> 
            {props.full && <ContexMenuItem text='Редагувати' operation={editClick} icon='fa fa-pencil'/> }
            {props.full && <Separate />}
            <ContexMenuItem text='Відповісти' operation={answearClick} icon='fa fa-long-arrow-left'/>
            <ContexMenuItem text='Копіювати' operation={copyClick} icon='fa fa-clone'/>
            {props.full && <Separate />}
            {props.full && <ContexMenuItem text='Видалити' operation={deleteClick} icon='fa fa-times-circle'/>}
        </ContextMenu>
    );
}

MessageMenu.propTypes = {
    cX: PropTypes.number.isRequired,
    cY: PropTypes.number.isRequired,
    text: PropTypes.string,
    id: PropTypes.number,
    menu: PropTypes.func.isRequired,
}