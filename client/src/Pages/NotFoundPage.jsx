import React, { Component } from "react";

import Header from "../Components/Header/Header";

import notFound from "../404.svg";

export default class NotFoundPage extends Component {
    render () {
        return (
            <div className="app-screen">
                <Header />
                <div className="container nf">
                    <img className='notFountImg' src={notFound} alt=''/>
                    <div className="notFound404">404</div>
                    <div className="notFountText">Такої сторінки не існує!</div>
                </div>
            </div>
        )
    }
}