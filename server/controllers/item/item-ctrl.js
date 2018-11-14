const Item = require('./item-modal');

module.exports = function (app) {
    app.post('/api/item', (req, res) => {
        addItemAsync(req.body, res).then((_dt) => {
            getLastAsync(req.body).then(data => {
                res.send({ data: data, message: "Item added successfully" });
            }).catch(err => {
                res.send({ data: null, err: err });
            });
        }).catch(err => console.log(err));
    });
    app.get('/api/item', (req, res) => {
        getItemAsync().then(data => {
            res.send({ data: data, message: "Item found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });


    app.get('/api/item/:id', (req, res) => {
        getItemAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "Item found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.post('/api/item/filterBy', (req, res) => {
        getItemAsync(req.body).then(data => {
            res.send({ data: data, message: "Item found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/item/:id', (req, res) => {
        try {
            Item.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, option) {
                if (err) {
                    res.send({ data: null, err: err });
                } else {
                    res.send({ data: option, message: "Item updated successfully" })
                }

            })
        } catch (error) {
            res.send({ data: null, err: err });
        }

    });
    app.delete('/api/item/:id', (req, res) => {

        try {
            Item.findOneAndRemove({ _id: req.params.id }, function (err, option) {
                if (err) { res.send({ data: null, err: err }); }
                else {
                    res.send({ data: option, message: "Item removed successfully" })
                }
            });
        } catch (error) {
            res.send({ data: null, err: error });
        }
    })

    async function getLastAsync(body) {
        try {
            return await Item.findOne(body).populate('section').populate('subCategory').exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
    async function addItemAsync(option, res) {
        try {
            return await new Item(option).save(function (error, results) {
                if (error) res.send({ data: null, err: error });;
                return results;
            });
        } catch (error) {
            return res.send({ data: null, err: error });;
        }

    }

    async function getItemAsync(option) {
        try {
            return await Item.find(option).populate('section').populate('subCategory').exec();
        } catch (error) {
            return error;
        }
    }

}