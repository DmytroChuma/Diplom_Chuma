import React from "react";

import axiosInstance from "../../Utils/Axios";
import { useLocation } from "react-router";

export default function Files ({ modalHandler, files, socket, user }) {

    const location = useLocation()

    const sendHandler = async () => {
        let loaded = []
        for (const file of files) {
            let formData = new FormData();
            formData.append('file', file);
            await axiosInstance.post("/upload_file", formData, {
                headers: {
                "Content-Type": "multipart/form-data",
                }
            }).then((res) => {
                let path = res.data.path.split('\\');
                path.shift();
                path = path.join('/');
                loaded.push(path)
            })
        }
        await fetch('https://diplomchuma-production.up.railway.app/save_files', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({files: loaded})
          })
          for (let i = 0; i < files.length; i++){
            socket.emit('send_message', 
          {
            message: '', 
            date: new Date(), 
            user_id: user.id, 
            avatar: user.avatar, 
            inbox: location.hash.replace('#', ''), 
            answear: 0,
            a_message: '',
            file: {path: loaded[i].split('/')[1], type: files[i].type}
          });
          }
          modalHandler('')
    }

    return (
        <div className="modal-window">
            <div className="modal-panel">
                <button className="exit-btn" onClick={()=>{modalHandler('')}}></button>
                <div className="file-modal-panel">
                    {files.map((element, index) => {
                        return(
                            <div key={index} className="file-container">
                                {element.type.split('/')[0] === 'image' &&
                                    <img className='modal-file' src={URL.createObjectURL(element)} alt=''/>
                                }
                                <span className={"file-name " + (element.type.split('/')[0] === 'image' ? '' : 'file-dummy')}>{element.name}</span>
                            </div>
                        )
                    })}
                </div>
                <button onClick={sendHandler} className="btn">Надіслати</button>
            </div>
        </div>
    )
}