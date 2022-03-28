const db = require('../db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { userName: params.userName } })) {
        throw 'User "' + params.userName + '" is already exist';
    }

    const user = new db.User(params);
    
    // save user
    await user.save();

    return user;
}


async function getAll() {
    const users = await db.User.findAll({
        raw: true
    });
    return users;
}

async function getById(id) {
    const user = await getUser(id);
    return user;
}

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

async function update(id, params) {
    const user = await getUser(id);

    // copy params to user and save
    Object.assign(user, params);
    user.updated = Date.now();
    await user.save();

    return user;
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}