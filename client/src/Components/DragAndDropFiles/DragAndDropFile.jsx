import React, { useState } from 'react';
import axiosInstance from '../../Utils/Axios'
import ProgressBar from '../Inputs/ProgressBar';
import Element from './Element';


export default function DragAndDropFile(props){
    const [value, setValue] = useState([]);
    const [active, setActive] = useState(false);
    const [progress, setProgress] = useState('0');
    const [elements, setElements] = useState([]);
    const [showProgress, setShowProgress] = useState(false);

    let timeOut;

    function checkFiles(files){
        for(let file of files){
            if (!props.filter.includes('.' + file.type.split('/')[1])) {
                return false;
            }
        }
        return true;
    }

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === "dragenter" || e.type === "dragover") {
          setActive(true);
          
        } else if (e.type === "dragleave") {
          setActive(false);
 
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (!checkFiles(e.dataTransfer.files)){
                props.warning("Завантажити можна лише файти з розширенням: " + props.filter.join(', '));
                return;
            }
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    }

  

    const handleFiles = async (files) => {
        
        let elementsLoaded = elements === '' ? [] : [...elements];
        let files_loaded = value === '' ? [] : [...value];
        for (const file of files) {
            let formData = new FormData();
            formData.append('file', file);
            setShowProgress(true);

            await axiosInstance.post("/upload_file", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                onUploadProgress: data => {
                    let percent = Math.round((100 * data.loaded) / data.total);
                    setProgress(percent);
                },
            }).then((res) => {
                let path = res.data.path.split('\\');
                path.shift();
                path = path.join('/');
                elementsLoaded.push(<Element key={path} path={path} deleteHandler={deleteElementHandler}/>);
                files_loaded.push(path);
            });
        }
        clearTimeout( timeOut );
        timeOut = setTimeout(() => {
            setShowProgress(false);
        }, 1000);
        setElements(elementsLoaded);
        setValue(files_loaded);
        if (props.handleChange !== undefined) {
            props.handleChange(files_loaded);  
        }
    }

    const deleteElementHandler = (data) => {
        setElements((prev) =>
            prev.filter(
                (element) => element.props.path !== data)
        );

        setValue((prev) =>
            prev.filter(
                (element) => element !== data)
        );  

        if (props.handleChange !== undefined) {
            props.handleChange((prev) =>
                prev.filter(
                    (element) => element !== data)
            );  
        }
    }

    return(
        <div className='add-file-container'>
            <label onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} htmlFor="input-file-upload" className={'add-file-button ' + (active ? 'active' : '')}>
                <ProgressBar value={progress} show={showProgress} />
                <label className="file-upload" >Перетягніть файли сюди або оберіть їх</label>
                <input type="file" id="input-file-upload" onChange={handleChange} multiple={true} accept={props.filter.join(',')} />
            </label>
            <div className={'attached-file ' + (props.type === 'img' ? "attached-image" : "")}>{elements}</div>
        </div>
    );
}