import React from "react";

import Title from "../../Components/Title";

export default function AgencyInfo ({data}) {   

    if (!data) return

    return (
        <div className="agency-info-container">
            <div className="agency-info">
                <div className="agency-logo-info">
                    <img className="image-agency-logo" src={data.logo === '' ? 'http://192.168.0.105:3001/images/default.png' : `http://192.168.0.105:3001/images/agency/${data.logo}`} alt=''/>
                </div>
                <div className="agency-info-basic">
                    <span className="agency-name-info">Агентство: {data.name}</span>
                    <span className="agency-location">Область: {data.region}</span>
                    <span className="agency-location">Місто: {data.city}</span>
                </div>
            </div>
            <Title type='contact' text='Контактні дані' />
            <div className="contact-agency-container">
                <div className="contact-a-c">
                    <span className="contact-info">Телефони агентства</span>
                    {
                        data.phones.split(',').map((element, index) => {
                            return(
                                <div key={index} className="contact-agency">
                                    {`(${element.substring(0,3)}) ${element.substring(3,6)} ${element.substring(6)}`}
                                </div>
                            )
                        })
                    }
                </div>
                <div className="contact-a-c">
                    <span className="contact-info">Електронні пошти агентства</span>
                    {
                        data.emails.split(',').map((element, index) => {
                            return (
                                <div key={index} className='contact-agency'>
                                    {element}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            
            <Title type='description' text='Опис агентства' />
            <div className="agency-description">
                {data.description}
            </div>
        </div>
    )
}