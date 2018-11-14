const Exchange = require('./exchange-modal');

module.exports = function (app) {
    app.post('/api/exchange', (req, res) => {
        addExchangeAsync(req.body, res).then((_dt) => {
            getLastAsync(req.body).then(data => {
                res.send({ data: data, message: "Exchange added successfully" });
            }).catch(err => {
                res.send({ data: null, err: err });
            });
        }).catch(err => console.log(err));
    });
    app.get('/api/exchange', (req, res) => {
        getExchangeAsync().then(data => {
            res.send({ data: data, message: "Exchange found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.get('/api/exchange/:id', (req, res) => {
        getExchangeAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "Exchange found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.post('/api/exchange/filterBy', (req, res) => {
        getExchangeAsync(req.body).then(data => {
            res.send({ data: data, message: "Exchange found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/exchange/:id', (req, res) => {
        try {
            Exchange.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, vct) {
                if (err) {
                    res.send({ data: null, err: err });
                } else {
                    res.send({ data: vct, message: "Exchange updated successfully" })
                }

            });
        } catch (error) {
            res.send({ data: null, err: err });
        }

    });
    app.delete('/api/exchange/:id', (req, res) => {

        try {
            Exchange.findOneAndRemove({ _id: req.params.id }, function (err, vct) {
                if (err) { res.send({ data: null, err: err }); }
                else {
                    res.send({ data: vct, message: "Exchange removed successfully" })
                }
            });
        } catch (error) {
            res.send({ data: null, err: error });
        }
    })

    async function getLastAsync(body) {
        try {
            return await Exchange.findOne(body).exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
    async function addExchangeAsync(vct, res) {
        try {
            return await new Exchange(vct).save(function (error, results) {
                if (error) res.send({ data: null, err: error });;
                return results;
            });
        } catch (error) {
            return res.send({ data: null, err: error });;
        }

    }

    async function getExchangeAsync(option) {
        try {
            return await Exchange.find(option).populate('target').populate('replaced').populate('dist').exec();
        } catch (error) {
            return error;
        }
    }

}