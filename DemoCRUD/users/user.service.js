const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {

        // const { hash, ...userWithoutHash } = user.toObject();
        const { hash, ...userWithoutHash } = { "active": user.active,
                                                "id": user._id,
                                                "firstName": user.firstName,
                                                "lastName": user.lastName,
                                                "username": user.username
                                            };
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    let user = await User.findById(id).select('-hash');
    const temp = { "active": user.active,
                   "id": user._id,
                   "firstName": user.firstName,
                   "lastName": user.lastName,
                   "username": user.username,
                  "token": user.token
                 };
    //console.log(temp);
    return temp;
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    
    //console.log("UPDATE USER : "+user);
    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
    const temp = { "active": user.active,
                   "id": user._id,
                   "firstName": user.firstName,
                   "lastName": user.lastName,
                   "username": user.username,
                  "token": user.token
                 };
    console.log(temp);
    return temp;

}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}