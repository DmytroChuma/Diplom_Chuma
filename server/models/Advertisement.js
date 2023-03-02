const con = require('../config/db_connector');

class Advertisement{
    constructor(realty_type, advert_type, region, city, district, street,
                position, description, price, currency, auction, proposition) {
        this.realty_type = realty_type;
        this.advert_type = advert_type;
        this.region = region;
        this.city = city;
        this.district = district;
        this.street = street;
        this.position = position;
        this.description = description;
        this.price = price;
        this.currency = currency;
        this.auction = auction;
        this.proposition = proposition;
    }
    
    async addNewAdvetisement() {
        let sql = `
        INSERT INTO info(

        )
        VALUES(

        )
        `;
    }
}