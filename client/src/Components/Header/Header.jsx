import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Header extends Component {
    render () {
        return (
            <div className="navArea">
                <div className="btnContainer">
                    <Link className="logo" to='/'>Logo</Link>
                    <Link className="headerNavBtn" to='/search'>Купити</Link>
                    <Link className="headerNavBtn" to='/search'>Орендувати</Link>
                </div>
                <div className="btnContainer">
                    <Link className="headerNavBtn addAdvertisement" to='/add-new-advertisement'>Додати оголошення</Link>
                    <Link className="headerBtn signIn" to='/auth/login'>Вхід</Link>
                </div>
            </div>
        )
    }
}