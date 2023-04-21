import React from "react";

import Header from "../Components/Header/Header";

import forbidden from "../403.svg";

export default function Forbidden () {
    return(
        <div className="app-screen">
            <Header />
            <div className="container nf">
                <img className='notFountImg' src={forbidden} alt=''/>
                <div className="notFound404">403</div>
                <div className="notFountText">У вас немає дозволу на доступ до цієї сторінки</div>
            </div>
        </div>
    )
}