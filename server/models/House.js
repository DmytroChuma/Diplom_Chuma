const con = require('../config/db_connector');

class House{
    constructor(houseType, dwellingType, rooms, floor, mansard, basement, wall, heating, plan, furniture, generalSquare, livingSquare, area, unit, garage, fireplace, balcony, garden,
        state, roof, electricity, gas, water, info) {
        this.houseType = houseType;
        this.dwellingType = dwellingType;
        this.rooms = rooms;
        this.floor = floor;
        this.mansard = mansard;
        this.basement = basement;
        this.wall = wall;
        this.heating = heating;
        this.plan = plan;
        this.furniture = furniture;
        this.generalSquare = generalSquare;
        this.livingSquare = livingSquare;
        this.area = area;
        this.unit = unit;
        this.garage = garage;
        this.fireplace = fireplace;
        this.balcony = balcony;
        this.garden = garden;
        this.state = state;
        this.roof = roof;
        this.electricity = electricity;
        this.gas = gas;
        this.water = water;
        this.info = info;
    }
    
    async create(){
        let result = await con.execute(`
        SELECT wall_type.id as wall, realty_state.id as state, communication.id as electricity,
        (SELECT id FROM communication WHERE name = '${this.gas}') as gas,
        (SELECT id FROM communication WHERE name = '${this.water}') as water, roof.id as roof
        FROM wall_type, realty_state, communication, roof
        WHERE wall_type.name = '${this.wall}' AND realty_state.name = '${this.state}' AND communication.name = '${this.electricity}' AND roof.name = '${this.roof}' `);
        const { wall, state, electricity, gas, water, roof } = result[0];

        let sql = `
            INSERT INTO house(
                house_type,
                dwelling_type,
                rooms_count,
                floor_count,
                mansard,
                basement,
                wall,
                heating,
                plan,
                furniture,
                general_square,
                living_square,
                area,
                unit,
                garage,
                fireplace,
                balcony,
                garden,
                state,
                roof,
                electricity,
                gas,
                water,
                info
            )
            VALUES (
                '${this.houseType}',
                '${this.dwellingType}',
                '${this.rooms}',
                '${this.floor}',
                '${this.mansard}',
                '${this.basement}',
                '${wall}',
                '${this.heating}',
                '${this.plan}',
                '${this.furniture}',
                '${this.generalSquare}',
                '${this.livingSquare}',
                '${this.area}',
                '${this.unit}',
                '${this.garage}',
                '${this.fireplace}',
                '${this.balcony}',
                '${this.garden}',
                '${state}',
                '${roof}',
                '${electricity}',
                '${gas}',
                '${water}',
                '${this.info}'
            )
        `;
        con.execute(sql);
    }

}

module.exports = House;