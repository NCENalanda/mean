const express = require('express');
const router = express.Router();
//const adminService = require('./admin.service');
const userService = require('../users/user.service');


router.get('/getusers', getAllUsers);
router.get('/getuser/id', getUser);

module.exports = router;

function getAllUsers(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getUser(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}