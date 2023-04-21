import React from "react"
import PropTypes from 'prop-types';

import ContextMenu from '../../Components/Menu/ContextMenu';
import ContexMenuItem from '../../Components/Menu/ContextMenuItem';
import Separate from "../Menu/Separate";

export default function MessageMenu ({ cX, cY, text, id, menu, ...props }) {

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
        if (props.file) {
            props.deleteHandler(id, text);
        }
        else {
            props.deleteHandler(id);
        }
        menu('');
    }

    return(
        <ContextMenu cX={cX} cY={cY}>
            {(props.full && !props.file) && <ContexMenuItem text='Редагувати' operation={editClick} icon='fa fa-pencil'/> }
            {(props.full && !props.file) && <Separate />}
            {(props.full || props.options) && <ContexMenuItem text='Відповісти' operation={answearClick} icon='fa fa-long-arrow-left'/> }
            {(props.full || props.options) && <ContexMenuItem text='Копіювати' operation={copyClick} icon='fa fa-clone'/>}
            {(props.full && !props.file) && <Separate />}
            {(props.full || props.file) && <ContexMenuItem text='Видалити' operation={deleteClick} icon='fa fa-times-circle'/>}
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