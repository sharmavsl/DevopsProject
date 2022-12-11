const db = require('../persistence');
const {v4 : uuid} = require('uuid');

module.exports = async (req, res) => {
    const item = {
        id: uuid(),
        name: req.body.name,
        quantity: req.body.quantity
    };

    await db.storeItem(item);
    res.send(item);
};
