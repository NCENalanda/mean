/*
import * as express from 'express'
import * as multer from 'multer'
import * as cors from 'cors'
import * as fs from 'fs'
import * as path from 'path'
import * as Loki from 'lokijs'
*/
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Loki = require('lokijs')
// setup
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const upload = multer({ dest: `${UPLOAD_PATH}/` }); // multer configuration
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });
const router = express.Router();
//const app = express();
/*
import {
    loadCollection
} from './utils';
*/
const loadCollection = require('./util');
router.post('/profile', upload.single('avatar'), async (req, res) => {
    try {
        const col = await loadCollection(COLLECTION_NAME, db);
        const data = col.insert(req.file);

        db.saveDatabase();
        res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname });
    } catch (err) {
        res.sendStatus(400);
    }
})



router.get('/', async (req, res) => {

    // default route

    res.send(`

        <h1>Demo file upload</h1>

        <p>Please refer to <a href="https://scotch.io/tutorials/express-file-uploads-with-multer">my tutorial</a> for details.</p>

        <ul>

            <li>GET /images   - list all upload images</li>

            <li>GET /images/{id} - get one uploaded image</li>

            <li>POST /profile - handle single image upload</li>

            <li>POST /photos/upload - handle multiple images upload</li>

        </ul>

    `);

})




router.post('/photos/upload', upload.array('photos', 12), async (req, res) => {

    try {

        const col = await loadCollection(COLLECTION_NAME, db)

        let data = [].concat(col.insert(req.files));



        db.saveDatabase();

        res.send(data.map(x => ({ id: x.$loki, fileName: x.filename, originalName: x.originalname })));

    } catch (err) {

        res.sendStatus(400);

    }

})



router.get('/images', async (req, res) => {

    try {

        const col = await loadCollection(COLLECTION_NAME, db);

        res.send(col.data);

    } catch (err) {

        res.sendStatus(400);

    }

})

router.get('/images/:id', async (req, res) => {

    try {

        const col = await loadCollection(COLLECTION_NAME, db);
        const result = col.get(req.params.id);
        if (!result) {
            res.sendStatus(404);
            return;
        };
        res.setHeader('Content-Type', result.mimetype);
        fs.createReadStream(path.join(UPLOAD_PATH, result.filename)).pipe(res);

    } catch (err) {

        res.sendStatus(400);

    }

})

module.exports = router;