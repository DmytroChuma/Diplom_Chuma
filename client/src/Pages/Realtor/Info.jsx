import React from "react";
import Title from "../../Components/Title";
import { Link } from "react-router-dom";

export default function Info ({data}) {

    if (!data) return

    console.log(data)

    return (
        <div className="realtor-info-container">
            <div className="realtor-user-info">
                <div className="image-realtor">
                    <img className='realtor-avatar' src={`http://localhost:3001/users/${data.avatar === '' ? 'avatar.png' : data.avatar}`} alt=''/>
                </div>
                <div className="realtor-info-container">
                    <div className="realtor-name">{`${data.first_name} ${data.last_name}`}</div>
                    <div className="realtor-info-i">Область: {data.region === "" ? 'Не вказано' : data.region }</div>
                    <div className="realtor-info-i">Місто: {data.city === "" ? 'Не вказано' : data.city }</div>

                </div>
            </div>
            <Title type='agency-t' text='Агентство' />
            <div className="agency-info-realtor">
                <div className="agency-logo-info-realtor">
                    <img className="image-agency-logo" src={data.logo === '' ? 'http://localhost:3001/images/default.png' : `http://localhost:3001/images/agency/${data.logo}`} alt=''/>
                </div>
                <div className="agency-info-basic">
                    <Link className="agency-name-info" to={`/agency/${data.id}/agency`}>{data.name}</Link>
                    <span className="agency-count">Кількість співробітників агентства: {data.count}</span>
                </div>
            </div>
            <Title type='contact' text='Контактні дані' />
            <div className="contact-realtor-container">
                <div className="contact-a-c">
                    <span className="contact-info">Телефон рієлтора</span>
                    <div className="contact-realtor">
                        {`(${data.phone.substring(0,3)}) ${data.phone.substring(3,6)} ${data.phone.substring(6)}`}
                    </div>   
                </div>
                <div className="contact-a-c">
                    <span className="contact-info">Електронна пошта рієлтора</span>
                    <div className="contact-realtor">
                        {data.email}
                    </div>
                </div>
            </div>
            <Title type='description' text='Інформація про рієлтора' />
            <div className="">
                {data.description === '' ? 'Рієлтор не залишив опис про себе.' : data.description }
            </div>
        </div>
    )
}