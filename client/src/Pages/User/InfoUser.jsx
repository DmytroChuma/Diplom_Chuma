import React from "react";
import CabinetCard from "../../Components/Cards/CabinetCard";

export default function InfoUser () {
    return(
        <div className="cabinet-container">
            <div className="user-info-card">
                <div className="">
                    <img className="" src='' alt=''/>
                    <span></span>
                </div>
                <div className="">

                </div>
                <div className="">
                    
                </div>
            </div>
            <div className="separator"></div>
            <div className="cabinet-cards-container">
                <CabinetCard link='/add-new-advertisement' linkText='Створити нове'>
                    <div>Всього опубліковано оголошень  </div>
                </CabinetCard>
                <CabinetCard link='/user/cabinet/archive' linkText='В архів'>
                    <div>Оголошень в архіві  </div>
                </CabinetCard>
                <CabinetCard link='/select' linkText='Переглянути всі'>
                    <div>Обрані оголошення</div>
                </CabinetCard>
                <CabinetCard link='/add-new-advertisement' linkText='Додати запит'>
                    <div>Запити на пошук нерухомості  </div>
                </CabinetCard>
                <CabinetCard link='/user/cabinet/add-agency' linkText='Створити агентство'>
                    <div>Агентство  </div>
                </CabinetCard>
            </div>
        </div>
    )
}