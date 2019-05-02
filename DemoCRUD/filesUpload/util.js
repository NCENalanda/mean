//import * as del from 'del';
const del = require('del');
const db = require('lokijs');
//import * as Loki from 'lokijs';

const loadCollection = function (colName, db) {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);
            resolve(_collection);
        })
    });
}

module.exports = loadCollection; 