const Distribute = require('./distribute-modal');

module.exports = function (app) {
    app.post('/api/distribute', (req, res) => {
        addDistributeAsync(req.body, res).then((_dt) => {
            console.log(_dt);
            getLastAsync(req.body).then(data => {
                res.send({ data: data, message: "Distribute added successfully" });
            }).catch(err => {

                res.send({ data: null, err: err });
            });
        }).catch(err => console.log(err));
    });
    app.get('/api/distribute', (req, res) => {
        getDistributeAsync().then(data => {
            res.send({ data: data, message: "Distribute found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    //api/distribute/date
    app.get('/api/distribute/last', (req, res) => {
        getDistributeAsync().then(data => {
            res.send({ data: data[data.length - 1], message: "Distribute found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.get('/api/distribute/last', (req, res) => {
        getDistributeAsync({ created_at: req.params.date }).then(data => {
            res.send({ data: data, message: "Distribute found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.post('/api/distribute/filterBy', (req, res) => {
        getDistributeAsync(req.body).then(data => {
            res.send({ data: data, message: "Distribute found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/distribute/:id', (req, res) => {
        try {
            Distribute.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, data) {
                if (err) {
                    res.send({ data: null, err: err });
                } else {
                    res.send({ data: data, message: "Distribute updated successfully" })
                }

            });
        } catch (error) {
            res.send({ data: null, err: err });
        }

    });
    app.delete('/api/distribute/:id', (req, res) => {

        try {
            Distribute.findOneAndRemove({ _id: req.params.id }, function (err, data) {
                if (err) { res.send({ data: null, err: err }); }
                else {
                    res.send({ data: data, message: "Distribute removed successfully" })
                }
            });
        } catch (error) {
            res.send({ data: null, err: error });
        }
    })

    async function getLastAsync(body) {
        try {
            return await Distribute.findOne(body).exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
    async function addDistributeAsync(data, res) {
        try {
            return await new Distribute(data).save(function (error, results) {
                if (error) res.send({ data: null, err: error });
                return results;
            });
        } catch (error) {
            return res.send({ data: null, err: error });;
        }

    }

    async function getDistributeAsync(option) {
        try {
            return await Distribute.find(option).populate('soliders.srcSolds').exec();
        } catch (error) {
            return error;
        }
    }

}