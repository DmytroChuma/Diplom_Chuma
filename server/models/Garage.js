const e = require('express');
const con = require('../config/db_connector');

class Garage{
    constructor(type, garageType, car, wall, roof, floor, square, width, length, gateWidth,
                height, pit, basement, residential, sectional, state, electricity, info) {
        this.type = type;
        this.garageType = garageType;
        this.car = car;
        this.wall = wall;
        this.roof = roof;
        this.floor = floor;
        this.square = square;
        this.width = width;
        this.length = length;
        this.gateWidth = gateWidth;
        this.height = height;
        this.pit = pit;
        this.basement = basement;
        this.residential = residential;
        this.sectional = sectional;
        this.state = state;
        this.electricity = electricity;
        this.info = info;
    }
    
    async create(){
        let result = await con.execute(`
        SELECT garage_type.id as type, garage_wall.id as wall, garage_roof.id as roof, garage_floor.id as floor, realty_state.id as state, communication.id as electricity
        FROM garage_type, garage_wall, garage_roof, garage_floor, realty_state, communication
        WHERE garage_type.name = '${this.garageType}' AND garage_wall.name = '${this.wall}' AND garage_roof.name = '${this.roof}' AND garage_floor.name = '${this.floor}' AND realty_state.name = '${this.state}' AND communication.name = '${this.electricity}'`);
        const { type, wall, roof, floor, state, electricity } = result[0];

        let sql = `
            INSERT INTO garage(
                type,
                garageType,
                car,
                wall,
                roof,
                floor,
                square,
                width,
                length,
                gateWidth,
                height,
                pit,
                basement,
                residential,
                sectional,
                state,
                electricity,
                info
            )
            VALUES(
                '${this.type}',
                '${type}',
                '${this.car}',
                '${wall}',
                '${roof}',
                '${floor}',
                '${this.square}',
                '${this.width}',
                '${this.length}',
                '${this.gateWidth}',
                '${this.height}',
                '${this.pit}',
                '${this.basement}',
                '${this.residential}',
                '${this.sectional}',
                '${state}',
                '${electricity}',
                '${this.info}'
            )
        `;

        con.execute(sql);
    }
}

module.exports = Garage;