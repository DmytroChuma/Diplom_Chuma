const fs = require('fs');
const path = require('path');
const con = require('../config/db_connector');
request = require("request");

let Advertisement = require("../models/Advertisement");
const stringHandler = require('../handlers/StringHandler');

let cours;
request(
  'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5',
  (err, res, body) => {
    cours = body;
  }
)

exports.publicate = (req, res) => {
  try{
    Advertisement.publicate(req.body.slug);
    res.json({success: 1});
  }catch(e){res.sendStatus(500)}
}

exports.addView = (req, res) => {
  try{
    Advertisement.addView(req.body.id)
    res.json({success: 1})
  }catch(e){res.sendStatus(500)}
}

exports.addPhone = (req, res) => {
  try{
    Advertisement.addPhone(req.body.id)
    res.json({success: 1})
  }catch(e){res.sendStatus(500)}
}

exports.addSelect = (req, res) => {
  try{
    Advertisement.addSelect(req.body.id, req.body.type)
    res.json({success: 1});
  }catch(e){res.sendStatus(400)}
}

exports.option = (req, res) => {
  try{
  let text = '';
  for (let value of req.body.data) {
    if (req.body.option === 'Додати в архів') {
      text = 'Додано до архіву';
      Advertisement.addToArchive(value);
    }
    else if (req.body.option === 'Опублікувати') {
      text = 'Опубліковано';
      Advertisement.publicate(value);
    }
    else {
      text = 'Видалено';
      fs.rmSync("./public/" + value, { recursive: true, force: true });
      Advertisement.delete(value);
    }
  }
  res.json({success: 1, text: text});
}catch(e){res.sendStatus(400)}
}

exports.deletePost = (req, res) => {
  try{
    fs.rmSync("./public/" + req.body.slug, { recursive: true, force: true });
    Advertisement.delete(req.body.slug);
    res.json({success: 1});
  }catch(e){res.sendStatus(500)}
}

function getFiles (folderPath) {
  let images = [];
  let files = fs.readdirSync(folderPath);
  
  files.forEach(file => {
    images.push(path.parse(file).name + path.extname(file));
  });

  return images;
}

function createRealtyArray(rows){
    let realtyArr = [];
    for (let i = 0; i < rows.length; i++) {
  
      let images = getFiles("./public/" + rows[i].slug);
  
      let formattedDate = stringHandler.formatDate(rows[i].date);

      let params = rows[i].params.split(',');
      let square;
      let tags = [];

      let price = rows[i].price;
      let priceinuah = JSON.parse(cours)[1].sale * price;
      if (rows[i].currency === 'грн') {
        priceinuah = rows[i].price;
        price = priceinuah / JSON.parse(cours)[1].sale;
      }
       
      switch(rows[i].realtyType){
        case 'Будинок':
        case 'Дача':
        case 'Частина будинку':
          tags.push({text: params[2], type: 'type', urlText: params[2], realty: rows[i].realtyType}, {text: params[1], type: 'houseType', urlText: params[1], realty: rows[i].realtyType});
          square = `${params[0]} м²`;
          break;
        case 'Квартира':
          tags.push({text: params[1], type: 'type', urlText: params[1], realty: rows[i].realtyType});
          square = `${params[0]} м² • ${params[2]} ${stringHandler.morph(params[2], ['кімната', 'кімнати', 'кімнат'])}`;
          break;
        case 'Гараж':
          tags.push({text: params[1], type: 'type', urlText: params[1], realty: rows[i].realtyType});
          square = `${params[0]} м² • машиномісць: ${params[2]}`;
          break;
        case 'Ділянка':
          square = `${params[0]} `+(params[1] === 'Сотка' ? stringHandler.morph(params[0], ['сотка', 'сотки', 'соток']) : params[1] === 'Гектар' ? stringHandler.morph(params[0], ['гектар', 'гектара', 'гектарів']) : `м²` );
          break;
      }
      tags.push(rows[i].auction == 1 ? {text :"Торг", type:'auction', urlText: 'Торг можливий'} : "");
  
      let realty = {
        id: rows[i].id,
        street: rows[i].street,
        city: rows[i].city,
        price: price,
        priceinua: priceinuah,
        square: square,
        description: rows[i].description,
        date: formattedDate,
        images: images,
        tags: tags,
        views: rows[i].views,
        phones: rows[i].phones,
        select: rows[i].select,
        slug: rows[i].slug
      }
     
      realtyArr.push(realty);
    }
    return realtyArr;
  
  }
  
  function loadAdvertisementInfo (advertisement, realtyParams) {
    let images = getFiles("./public/" + advertisement.slug);
    let formattedDate = stringHandler.formatDate(advertisement.date);

    let price = advertisement.price;
    let priceinuah = JSON.parse(cours)[1].sale * price;
    if (advertisement.currency === 'грн') {
      priceinuah = advertisement.price;
      price = priceinuah / JSON.parse(cours)[1].sale;
    }

    let unit = 'м²';
    if (advertisement.realtyType === 'Ділянка' || advertisement.realtyType === 'Будинок' || advertisement.realtyType === 'Дача' || advertisement.realtyType === 'Частина будинку') {
      switch(realtyParams.unit){
        case 'Сотка':
          if (advertisement.realtyType === 'Ділянка') {
            unit = 'сотку';
            realtyParams.unit = stringHandler.morph(realtyParams.square, ['сотка', 'сотки', 'соток']);
          }
          break;
        default:
          unit = realtyParams.unit.toLowerCase();
          if (realtyParams.unit === 'Гектар') {
            realtyParams.unit = stringHandler.morph(realtyParams.square, ['гектар', 'гектара', 'гектарів']);
          }
          break;
      }
    }

    let user = {
      id : advertisement.userId,
      firstName: advertisement.first_name,
      lastName: advertisement.last_name,
      phone: advertisement.phone,
      avatar: advertisement.avatar,
      type: advertisement.proposition === 'Від власника' ? 'Власник' : advertisement.permission > 0 ? 'Рієлтор' : 'Посередник'
    }

    let realty = {
      id: advertisement.id,
      realtyType: advertisement.realtyType,
      advertisementType: advertisement.advertisementType,
      region: advertisement.region,
      city: advertisement.city,
      district: advertisement.district,
      street: advertisement.street,
      description: advertisement.description,
      price: price,
      priceinuah: priceinuah,
      position: advertisement.position,
      unit: unit,
      auction: advertisement.auction,
      proposition: advertisement.proposition,
      user: user,
      date: formattedDate,
      images: images,
      slug: advertisement.slug,
      parameters: realtyParams,
      view: advertisement.views,
      select: advertisement.select
    };
    return realty
  }

  function isEmpty (obj) {
    return JSON.stringify(obj) === '{}';
}


exports.getAllAdvertisements = async (req, res) => {
  try{
    let rows;
    let data;
    let count;
    if(!isEmpty(req.query)){
      data = await filter(req.query);
      rows = data.rows;
      count = data.count;
    }
    else {
      let sql = `
      SELECT info.id, info.realtyType, info.city, info.street, info.description, info.price, info.currency, info.auction, info.date, info.slug, info.views, info.phones, info.select,
      CASE 
        WHEN info.realtyType = 'Будинок' OR info.realtyType = 'Дача' OR info.realtyType = 'Частина будинку' THEN (SELECT CONCAT_WS(',', house.general_square, house.house_type, house.dwelling_type) FROM house WHERE house.info = info.id)
        WHEN info.realtyType = 'Квартира' THEN (SELECT CONCAT_WS(',', flat.general_square, flat.type, flat.rooms_count, flat.floor_count) FROM flat WHERE flat.info = info.id)
        WHEN info.realtyType = 'Гараж' THEN (SELECT CONCAT_WS(',', garage.square, garage.type, garage.car) FROM garage WHERE garage.info = info.id)
        WHEN info.realtyType = 'Ділянка' THEN (SELECT CONCAT_WS(',', area.square, area.unit) FROM area WHERE area.info = info.id)
      END as params
      FROM info 
      WHERE info.archive = '0'
      ORDER BY date DESC
      LIMIT 0, 5`;
      rows = await con.execute(sql);
      count = await con.execute(`SELECT count(*) as count FROM info WHERE info.archive = '0'`);
  
    }

    if (count.length === 0) {
      count = 0;
    }
    else {
      count = count[0].count
    }

    let realty = createRealtyArray(rows); 
    res.json({realty: realty, count: count});
  }catch(e){
    console.log(e)
    res.sendStatus(400)
  }
}

function createFilterString (values, table) {
  let filt = '';
  if (Array.isArray(values)) {
    for (let value of values) {
      filt += `OR ${table} = "${value}"`
    }
    filt = 'AND (' + filt.slice(2) + ')';
  }
  else {
    filt += ` AND ${table} = "${values}"`;
  }
  return filt;
}

function createMultiTableFilterString(values, table, table2, table3){
  let filt = '';
  if (Array.isArray(values)) {
    for (let value of values) {
      filt += `OR (${table}.name = "${value}" AND ${table2}.${table3} = ${table}.id)`
    }
    filt = 'AND (' + filt.slice(2) + ')';
  }
  else {
    filt += ` AND (${table}.name = "${values}" AND ${table2}.${table3} = ${table}.id)`;
  }
  return filt;
}

function createAdvantagesFilterString (values, table, equals = '1') {
  let filt = '';
  if (Array.isArray(values)) {
    for (let value of values) {
      filt += `AND ${table}.${value} = '${equals}'`;
    }
    filt = 'AND (' + filt.slice(3)  + ')';
  }
  else {
    filt += ` AND ${table}.${values} = '${equals}'`;
  }
  return filt;
}

 

filter = async (params) => {

    let advetisementsCount = 5;
    if (params.count){
      advetisementsCount = params.count
    }

    let sort = 'ORDER BY info.date DESC';
  if (params.sort) {
    if (params.sort == "Найдорожчі"){
      sort = 'ORDER BY info.price DESC'
    }
    else if (params.sort == "Найдешевші") {
      sort = 'ORDER BY info.price ASC'
    }
  }
  let filter = '';
  if (params.realty && params.realty != 'Вся нерухомість') {
    filter += ` AND info.realtyType ='${params.realty}'`;
  }
  if (params.proposition && params.proposition != 'Всі варіанти') {
    filter += ` AND info.proposition ='${params.proposition}'`;
  }
  if (params.map && params.map != 'Всі варіанти') {
    if (params.map === 'Так') {
      filter += ` AND info.position !=''`;
    }
    else {
      filter += ` AND info.position =''`;
    }
  }
  if (params.auction && params.auction != 'Всі варіанти') {
    if (params.auction === 'Торг можливий') {
      filter += ` AND info.auction ='1'`;
    }
    else {
      filter += ` AND info.auction ='0'`;
    }
  }

  if(params.region) {
    filter += ` AND region.region = '${params.region}'`
  }

  if(params.city) {
    filter += ` AND info.city = '${params.city}'`
  }

  let divide = 1
  if(params.currency) {
    if (params.currency === 'грн')
      divide = JSON.parse(cours)[1].sale
  }

  if (params.pricemin && !params.pricemax) {
    filter += ` AND info.price >= '${params.pricemin / divide}'`
  }
  else if (params.pricemax && !params.pricemin) {
    filter += ` AND info.price <= '${params.pricemax / divide}'`
  }
  else if (params.pricemin && params.pricemax){
    let min = params.pricemin
    let max = params.pricemax
    if(parseInt(params.pricemin) > parseInt(params.pricemax)){
      min = params.pricemax
      max = params.pricemin
    }
    filter += ` AND info.price BETWEEN '${min / divide}' AND '${max / divide}'`
  }

  if (params.advertisement && params.advertisement != 'Всі оголошення') {
    if (params.advertisement === 'Продаж') {
      filter += ` AND info.advertisementType = 'Продаж'`;
    }
    else {
      filter += ` AND info.advertisementType != 'Продаж'`;
    }
  }

  if(params.agency) {
    filter += ` AND user.agency = '${params.agency}'`;
  }

  if (params.select) {
    if (params.select === '[]') {
      filter += ` AND (info.id = '0')`;
    }
    else {
      let selectArr = JSON.parse(params.select);
      filter += ` AND (`;
      let query = '';
      for (let id of selectArr) {
        query += ` OR info.id = '${id}'`;
      }
      filter += query.substring(3)
      filter += `)`;
    }
  }

  filter = filter === '' ? '' : filter;
  let realty = `
  CASE 
    WHEN info.realtyType = 'Будинок' OR info.realtyType = 'Дача' OR info.realtyType = 'Частина будинку' THEN (SELECT CONCAT_WS(',', house.general_square, house.house_type, house.dwelling_type) FROM house WHERE house.info = info.id)
    WHEN info.realtyType = 'Квартира' THEN (SELECT CONCAT_WS(',', flat.general_square, flat.type, flat.rooms_count, flat.floor_count) FROM flat WHERE flat.info = info.id)
    WHEN info.realtyType = 'Гараж' THEN (SELECT CONCAT_WS(',', garage.square, garage.type, garage.car) FROM garage WHERE garage.info = info.id)
    WHEN info.realtyType = 'Ділянка' THEN (SELECT CONCAT_WS(',', area.square, area.unit) FROM area WHERE area.info = info.id)
  END`;
  let filt = '';
  let tables = '';
  if (params.realty) {
    switch(params.realty){
      case 'Будинок':
      case 'Дача':
      case 'Частина будинку':
        if (params.type) {
          if (params.type !== 'Всі варіанти')
          filt += createFilterString(params.type, 'house.dwelling_type');
        }
        if (params.rooms){
          filt += createFilterString(params.rooms, 'house.rooms_count');
        }
      
        if (params.squaremin && !params.squaremax) {
          filt += ` AND house.general_square >= '${params.squaremin}'`
        }
        else if (params.squaremax && !params.squaremin) {
          filt += ` AND house.general_square <= '${params.squaremax}'`
        }
        else if (params.squaremin && params.squaremax){
          let min = params.squaremin
          let max = params.squaremax
          if(parseInt(params.squaremin) > parseInt(params.squaremax)){
            min = params.squaremax
            max = params.squaremin
          }
          filt += ` AND house.general_square BETWEEN '${min}' AND '${max}'`
        }

        if (params.houseType) {
          filt += createFilterString(params.houseType, 'house.house_type');
        }
        if (params.wall) {
          filt += createMultiTableFilterString(params.wall, 'wall_type', 'house', 'wall');
          tables += ', wall_type';
        }
        if (params.roof){
          filt += createMultiTableFilterString(params.roof, 'roof', 'house', 'roof');
          tables += ', roof';
        }
        if (params.heating) {
          filt += createFilterString(params.heating, 'house.heating');
        }
        if (params.plan) {
          if (params.plan === 'furniture' && !Array.isArray(params.plan)) {
            filt += createAdvantagesFilterString(params.plan, 'house', 'Без меблів');
          }
          else if (!Array.isArray(params.plan)){
            filt += createAdvantagesFilterString(params.plan, 'house');
          }
          else {
            filt += createAdvantagesFilterString(params.plan[0], 'house', params.plan[0] === 'furniture' ? 'Без меблів' : '1');
            filt += createAdvantagesFilterString(params.plan[1], 'house', params.plan[1] === 'furniture' ? 'Без меблів' : '1');
          }
        }
        if (params.advantages) {
          filt += createAdvantagesFilterString(params.advantages, 'house');
        }
        if (params.state){
          filt += createMultiTableFilterString(params.state,  'realty_state', 'house', 'state');
          tables += ', realty_state';
        }
        if (params.electricity){
          filt += createAdvantagesFilterString('electricity', 'house', params.electricity);
        }
        if (params.gas){
          filt += createAdvantagesFilterString('gas', 'house', params.electricity);
        }
        if (params.water){
          filt += createAdvantagesFilterString('water', 'house', params.electricity);
        }
        realty = `
        (SELECT CONCAT_WS(',', house.general_square, house.house_type, house.dwelling_type) 
        FROM house ${tables}
        WHERE house.info = info.id ${filt})`;
        break;
      case 'Квартира':
        if (params.type) {
          if (params.type !== 'Всі варіанти')
          filt += createFilterString(params.type, 'flat.type');
        }
        if (params.rooms){
          filt += createFilterString(params.rooms, 'flat.rooms_count');
        }

        if (params.squaremin && !params.squaremax) {
          filt += ` AND flat.general_square >= '${params.squaremin}'`
        }
        else if (params.squaremax && !params.squaremin) {
          filt += ` AND flat.general_square <= '${params.squaremax}'`
        }
        else if (params.squaremin && params.squaremax){
          let min = params.squaremin
          let max = params.squaremax
          if(parseInt(params.squaremin) > parseInt(params.squaremax)){
            min = params.squaremax
            max = params.squaremin
          }
          filt += ` AND flat.general_square BETWEEN '${min}' AND '${max}'`
        }

        if (params.wall) {
          filt += createMultiTableFilterString(params.wall, 'wall_type', 'flat', 'wall');
          tables += ', wall_type';
        }
        if (params.heating) {
          filt += createFilterString(params.heating, 'flat.heating');
        }
        if (params.plan) {
          filt += createAdvantagesFilterString(params.plan, 'flat');
        }
        if (params.advantages) {
          filt += createAdvantagesFilterString(params.advantages, 'flat');
        }
        if (params.state){
          filt += createMultiTableFilterString(params.state,  'realty_state', 'flat', 'state');
          tables += ', realty_state';
        }
        if (params.electricity){
          filt += createAdvantagesFilterString('electricity', 'flat', params.electricity);
        }
        if (params.gas){
          filt += createAdvantagesFilterString('gas', 'flat', params.electricity);
        }
        if (params.water){
          filt += createAdvantagesFilterString('water', 'flat', params.electricity);
        }
        realty = `
        (SELECT CONCAT_WS(',', flat.general_square, flat.type, flat.rooms_count, flat.floor_count) 
        FROM flat ${tables}
        WHERE flat.info = info.id ${filt})`;
        break;
      case 'Ділянка':
        if (params.relief) {
          filt += createMultiTableFilterString(params.relief,  'relief', 'area', 'relief');
          tables += ', relief';
        }

        let divide = 1
        if (params.unit) {
          if (params.unit === 'Сотка')
            divide = 100
          if (params.unit === 'Гектар')
            divide = 10000
        }

        if (params.squaremin && !params.squaremax) {
          let min = params.squaremin * divide
          filt += ` AND ((area.square >= '${min}' AND unit = 'м²') OR (area.square * 100 >= '${min}' AND unit = 'Сотка') OR (area.square * 10000 >= '${min}' AND unit = 'Гектар'))`
        }
        else if (params.squaremax && !params.squaremin) {
          let max = params.squaremax * divide
          filt += ` AND ((area.square <= '${max}' AND unit = 'м²') OR (area.square * 100 <= '${max}' AND unit = 'Сотка') OR (area.square * 10000 <= '${max}' AND unit = 'Гектар'))`
        }
        else if (params.squaremin && params.squaremax){
          let min = params.squaremin * divide
          let max = params.squaremax * divide
          if(parseInt(params.squaremin) > parseInt(params.squaremax)){
            min = params.squaremax * divide
            max = params.squaremin * divide
          }
          filt += ` AND ((area.square BETWEEN '${min}' AND '${max}' AND unit = 'м²') OR (area.square * 100 BETWEEN '${min}' AND '${max}' AND unit = 'Сотка') OR (area.square * 10000 BETWEEN '${min}' AND '${max}' AND unit = 'Гектар'))`
        }

        if (params.soil) {
          filt += createMultiTableFilterString(params.soil,  'soil', 'area', 'soil');
          tables += ', soil';
        }
        if (params.location) {
          filt += createAdvantagesFilterString(params.location, 'area');
        }
        realty = `
        (SELECT CONCAT_WS(',', area.square, area.unit) 
        FROM area ${tables}
        WHERE area.info = info.id ${filt})
        `;
        break;
      case 'Гараж':
        if (params.type) {
          if (params.type !== 'Всі варіанти')
          filt += createFilterString(params.type, 'garage.type');
        }
        if (params.rooms){
          filt += createFilterString(params.rooms, 'garage.car');
        }

        if (params.squaremin && !params.squaremax) {
          filt += ` AND garage.square >= '${params.squaremin}'`
        }
        else if (params.squaremax && !params.squaremin) {
          filt += ` AND garage.square <= '${params.squaremax}'`
        }
        else if (params.squaremin && params.squaremax){
          let min = params.squaremin
          let max = params.squaremax
          if(parseInt(params.squaremin) > parseInt(params.squaremax)){
            min = params.squaremax
            max = params.squaremin
          }
          filt += ` AND garage.square BETWEEN '${min}' AND '${max}'`
        }

        if (params.garageType) {
          filt += createMultiTableFilterString(params.garageType,  'garage_type', 'garage', 'garageType');
          tables += ', garage_type';
        }
        if (params.wall) {
          filt += createMultiTableFilterString(params.wall,  'garage_wall', 'garage', 'wall');
          tables += ', garage_wall';
        }
        if (params.roof) {
          filt += createMultiTableFilterString(params.roof,  'garage_roof', 'garage', 'roof');
          tables += ', garage_roof';
        }
        if (params.floor) {
          filt += createMultiTableFilterString(params.roof,  'garage_floor', 'garage', 'floor');
          tables += ', garage_floor';
        }
        if (params.advantages) {
          filt += createAdvantagesFilterString(params.advantages, 'garage');
        }
        if (params.state){
          filt += createMultiTableFilterString(params.state,  'realty_state', 'garage', 'state');
          tables += ', realty_state';
        }
        if (params.electricity){
          filt += createAdvantagesFilterString('electricity', 'garage', params.electricity);
        }
        realty = `
        (SELECT CONCAT_WS(',', garage.square, garage.type, garage.car) 
        FROM garage ${tables}
        WHERE garage.info = info.id ${filt})`;
        break;
    }
  }

  let page = params.page;
 
  if (page === 'undefined'){
    page = 1;
  }
 
let limit = (page-1)*advetisementsCount;
if (isNaN(limit)){
  limit = 0;
}

if (params.top) {
  sort = 'ORDER BY info.views AND info.select AND info.phones AND info.date DESC';
}

  let rows = await con.execute(`
  SELECT info.id, info.realtyType, info.city, info.street, info.description, info.price, info.currency, info.auction, info.date, info.slug, info.views, info.phones, info.select, 
      ${realty} as params
    FROM info, user, region
    WHERE info.region = region.id AND info.user = user.id AND info.archive = ${params.archive ? `'${params.archive}'` : '0'} ${params.user ? `AND info.user = '${params.user}'` : ''} ${filter} 
    HAVING params IS NOT NULL
  ` + sort + ` LIMIT ${limit}, ${advetisementsCount}`);

  let count = await con.execute(`
  SELECT COUNT(*) as count,
  ${realty} as params
FROM info, user, region
WHERE info.region = region.id AND info.user = user.id AND info.archive = ${params.archive ? `'${params.archive}'` : '0'} ${params.user ? `AND info.user = '${params.user}'` : ''} ${filter} 
HAVING params IS NOT NULL
  `);

return {rows: rows, count: count};
}

const loadInfoAboutRealty = async (slug) => {
  let advertisement = await con.execute(`
        SELECT info.id, info.realtyType, info.advertisementType, info.city, info.district, info.street, info.position, info.description, info.price, info.currency, info.auction, info.proposition, info.date, info.slug, info.views, info.select, region.region, user.first_name, user.id as userId, user.last_name, user.phone, user.avatar, user.permission
        FROM info, region
        INNER JOIN user
        WHERE info.slug = '${slug}' AND region.id = info.region AND region.id = info.region AND user.id = info.user;
    `);
    if (advertisement.length === 0) {
      return
    }
    let sql;
    switch (advertisement[0].realtyType) {
        case 'Будинок':
        case 'Дача':
        case 'Частина будинку':
            sql = `
                SELECT house.house_type, house.dwelling_type, house.rooms_count, house.floor_count, house.mansard, house.basement, 
                    wall.name as wall, house.heating, house.plan, house.furniture, house.general_square, house.living_square, house.area, 
                    house.unit, house.garage, house.fireplace, house.balcony, house.garden, state.name as state, roof.name as roof, communication.name as electricity,
                    (SELECT name FROM communication WHERE id = house.gas) as gas, (SELECT name FROM communication WHERE id = house.water) as water
                FROM house, wall_type as wall, realty_state as state, roof, communication
                WHERE house.info = '${advertisement[0].id}' AND wall.id = house.wall AND state.id = house.state AND roof.id = house.roof AND communication.id = house.electricity
            `;
            break;
        case 'Квартира':
            sql = `
                SELECT flat.type, flat.rooms_count, flat.floor_count, wall.name as wall, flat.heating, flat.plan, flat.multi, flat.furniture, flat.mansard,
                    flat.general_square, flat.living_square, state.name as state, communication.name as electricity,
                    (SELECT name FROM communication WHERE id = flat.gas) as gas, (SELECT name FROM communication WHERE id = flat.water) as water
                FROM flat, wall_type as wall, realty_state as state, communication
                WHERE flat.info = '${advertisement[0].id}' AND wall.id = flat.wall AND state.id = flat.state AND communication.id = flat.electricity
            `;
            break;
        case 'Ділянка':
            sql = `
                SELECT area.square, area.unit, relief.name as relief, soil.name as soil, area.river, area.lake
                FROM area, relief, soil
                WHERE area.info = '${advertisement[0].id}' AND relief.id = area.relief AND soil.id = area.soil
            `;
            break;
        case 'Гараж':
            sql = `
                SELECT garage.type, type.name as garageType, garage.car, wall.name as wall, roof.name as roof, floor.name as floor,
                    garage.square, garage.width, garage.length, garage.gateWidth, garage.height, garage.pit, garage.basement, garage.residential, 
                    garage.sectional, state.name as state, communication.name as electricity
                FROM garage, garage_type as type, garage_wall as wall, garage_roof as roof, garage_floor as floor, realty_state as state, communication
                WHERE garage.info = '${advertisement[0].id}' AND type.id = garage.garageType AND wall.id = garage.wall AND roof.id = garage.roof AND floor.id = garage.floor AND state.id = garage.state AND communication.id = garage.electricity
            `;
            break;
    }
    return {sql: sql, advertisement: advertisement};
}

exports.loadAdvertisement = async (req, res) => {
  try{
    let result = await loadInfoAboutRealty(req.params.slug)

    if (!result) {
      res.sendStatus(404)
      return
    }

    let realtyParams = await con.execute(result.sql);

    let realty = loadAdvertisementInfo(result.advertisement[0], realtyParams[0]);
  
    res.json(realty);
  }catch(e){res.sendStatus(400)}
}

function loadEditor (advertisement, realtyParams) {
  let images = getFiles("./public/" + advertisement.slug);

  let realty = {
    id: advertisement.id,
    realtyType: advertisement.realtyType,
    advertisementType: advertisement.advertisementType,
    region: advertisement.region,
    city: advertisement.city,
    district: advertisement.district,
    street: advertisement.street,
    description: advertisement.description,
    price: advertisement.price,
    currency: advertisement.currency,
    position: advertisement.position,
    auction: advertisement.auction,
    proposition: advertisement.proposition,
    images: images,
    slug: advertisement.slug,
    parameters: realtyParams,
  };
  return realty
}

exports.loadAdvertisementForEditor = async (req, res) => {
  try{
    let result = await loadInfoAboutRealty(req.params.slug)

    let realtyParams = await con.execute(result.sql);

    let realty = loadEditor(result.advertisement[0], realtyParams[0])

    res.json(realty)
  }catch(e){res.sendStatus(400)}
}

exports.createAdvertisement = async (req, res) => {
  try{
    const advertisement = new Advertisement(req.body.realtyType, req.body.advertisementType, req.body.region, req.body.city, req.body.district, req.body.street, 
                                            req.body.position, req.body.description, req.body.price, req.body.currency, req.body.auction === 'Ні' ? 0 : 1, 
                                            req.body.proposition, JSON.parse(req.body.files), req.body.user);
    
    let adv = await advertisement.addNewAdvertisement();
    switch(req.body.realtyType){
      case 'Будинок':
      case 'Дача':
      case 'Частина будинку':
        let House = require("../models/House");
        const house = new House(req.body.house_type, req.body.dwelling_type, req.body.rooms_count, req.body.floor_count, req.body.mansard === '' ? 0 : 1, req.body.basement === '' ? 0 : 1, 
                                req.body.wall, req.body.heating, req.body.plan === '' ? 0 : 1, req.body.furniture, req.body.general_square, req.body.living_square, req.body.area, req.body.unit, 
                                req.body.garage === '' ? 0 : 1, req.body.fireplace === '' ? 0 : 1, req.body.balcony === '' ? 0 : 1, req.body.garden === '' ? 0 : 1, req.body.state, req.body.roof, 
                                req.body.electricity, req.body.gas, req.body.water, adv.id);
        await house.create();
        break;
      case 'Квартира':
        let Flat = require("../models/Flat");
        const flat = new Flat(req.body.dwelling_type, req.body.rooms_count, req.body.floor_count, req.body.wall, req.body.heating,
                              req.body.plan === '' ? 0 : 1, req.body.multi === '' ? 0 : 1, req.body.furniture === '' ? 0 : 1, 
                              req.body.mansard === '' ? 0 : 1, req.body.general_square, req.body.living_square, req.body.state, 
                              req.body.electricity, req.body.gas, req.body.water, adv.id);
        await flat.create();
        break;
      case 'Ділянка':
        let Area = require("../models/Area");
        const area = new Area(req.body.square, req.body.unit, req.body.relief, req.body.soil, 
                              req.body.river === '' ? 0 : 1, req.body.lake === '' ? 0 : 1, adv.id);
        await area.create();
        break;
      case 'Гараж':
        let Garage = require("../models/Garage");
        const garage = new Garage(req.body.type, req.body.garageType, req.body.car, req.body.wall, req.body.roof, 
                                  req.body.floor, req.body.square, req.body.width, req.body.length, req.body.gateWidth, 
                                  req.body.height, req.body.pit === '' ? 0 : 1, req.body.basement === '' ? 0 : 1, req.body.residential === '' ? 0 : 1, req.body.sectional === '' ? 0 : 1, 
                                  req.body.state, req.body.electricity, adv.id);
        await garage.create();
        break;
    }
    res.json({success: 1, slug: adv.slug})
  }catch(err){console.log(err); res.json({success: 0})}
}

exports.updateAdvertisement = async (req, res) => {
  try{
    let id = await Advertisement.update(req.body.region, req.body.city, req.body.district, req.body.street, 
                                        req.body.position, req.body.description, req.body.price, req.body.currency, req.body.auction === 'Ні' ? 0 : 1, 
                                        JSON.parse(req.body.files), req.body.slug)
    switch(req.body.realtyType){
      case 'Будинок':
      case 'Дача':
      case 'Частина будинку':
        let House = require("../models/House");
        House.update(req.body.house_type, req.body.dwelling_type, req.body.rooms_count, req.body.floor_count, req.body.mansard === '' ? 0 : 1, req.body.basement === '' ? 0 : 1, 
                    req.body.wall, req.body.heating, req.body.plan === '' ? 0 : 1, req.body.furniture, req.body.general_square, req.body.living_square, req.body.area, req.body.unit, 
                    req.body.garage === '' ? 0 : 1, req.body.fireplace === '' ? 0 : 1, req.body.balcony === '' ? 0 : 1, req.body.garden === '' ? 0 : 1, req.body.state, req.body.roof, 
                    req.body.electricity, req.body.gas, req.body.water, id[0].id);
        break;
      case 'Квартира':
        let Flat = require("../models/Flat");
        Flat.update(req.body.dwelling_type, req.body.rooms_count, req.body.floor_count, req.body.wall, req.body.heating,
                    req.body.plan === '' ? 0 : 1, req.body.multi === '' ? 0 : 1, req.body.furniture === '' ? 0 : 1, 
                    req.body.mansard === '' ? 0 : 1, req.body.general_square, req.body.living_square, req.body.state, 
                    req.body.electricity, req.body.gas, req.body.water, id[0].id);
        break;
      case 'Ділянка':
        let Area = require("../models/Area");
        Area.update(req.body.square, req.body.unit, req.body.relief, req.body.soil, 
                    req.body.river === '' ? 0 : 1, req.body.lake === '' ? 0 : 1, id[0].id);
        break;
      case 'Гараж':
        let Garage = require("../models/Garage");
        Garage.update(req.body.type, req.body.garageType, req.body.car, req.body.wall, req.body.roof, 
                      req.body.floor, req.body.square, req.body.width, req.body.length, req.body.gateWidth, 
                      req.body.height, req.body.pit === '' ? 0 : 1, req.body.basement === '' ? 0 : 1, req.body.residential === '' ? 0 : 1, req.body.sectional === '' ? 0 : 1, 
                      req.body.state, req.body.electricity, id[0].id);
        break;
    }
    res.json({success: 1})
  }catch(err) {res.json({success: 0})}
}

exports.addToArchive = (req, res) => {
  try{
    Advertisement.addToArchive(req.body.slug);
    res.json({success: 1});
  }catch(e){res.sendStatus(400)}
}