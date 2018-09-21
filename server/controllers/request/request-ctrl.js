const Item = require('./item-modal');

module.exports = function (app) {
    app.post('/api/item', (req, res) => {
        // testing 
        if (req.body.length > 1)
            req.body.forEach(function (element) {
                addItemAsync(element).then((data) => { }).catch(err => console.log(err));
            }, this);
        else {
            addItemAsync(req.body).then((data) => { }).catch(err => console.log(err));
        }
        res.send({ data: req.body, message: "Item added successfully" })
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
        Item.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, item) {
            if (err) {
                res.send({ data: null, err: err });
            } else {
                res.send({ data: item, message: "Item updated successfully" })
            }

        });
    });
    app.delete('/api/item/:id', (req, res) => {
        Item.findOneAndRemove({ _id: req.params.id }, function (err, item) {
            if (err) { res.send({ data: null, err: err }); }
            else {
                res.send({ data: item, message: "Item removed successfully" })
            }
        });
    })

    async function addItemAsync(item) {
        return await new Item(item).save(function (err, results) {
            if (err) throw err;
            return results;
        });
    }

    async function getItemAsync(option) {
        return await Item.find(option).exec();
    }

}