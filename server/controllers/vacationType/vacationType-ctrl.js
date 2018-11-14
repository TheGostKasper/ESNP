const VacationType = require('./vacationType-modal');

module.exports = function (app) {
    app.post('/api/vacationType', (req, res) => {
        addVacationTypeAsync(req.body, res).then((_dt) => {
            getLastAsync(req.body).then(data => {
                console.log(data);
                res.send({ data: data, message: "VacationType added successfully" });
            }).catch(err => {
                res.send({ data: null, err: err });
            });
        }).catch(err => console.log(err));
    });
    app.get('/api/vacationType', (req, res) => {
        getVacationTypeAsync().then(data => {
            res.send({ data: data, message: "VacationType found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.get('/api/vacationType/:id', (req, res) => {
        getVacationTypeAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "VacationType found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.post('/api/vacationType/filterBy', (req, res) => {
        getVacationTypeAsync(req.body).then(data => {
            res.send({ data: data, message: "VacationType found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/vacationType/:id', (req, res) => {
        try {
            VacationType.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, vct) {
                if (err) {
                    res.send({ data: null, err: err });
                } else {
                    res.send({ data: vct, message: "VacationType updated successfully" })
                }

            });
        } catch (error) {
            res.send({ data: null, err: err });
        }

    });
    app.delete('/api/vacationType/:id', (req, res) => {

        try {
            VacationType.findOneAndRemove({ _id: req.params.id }, function (err, vct) {
                if (err) { res.send({ data: null, err: err }); }
                else {
                    res.send({ data: vct, message: "VacationType removed successfully" })
                }
            });
        } catch (error) {
            res.send({ data: null, err: error });
        }
    })

    async function getLastAsync(body) {
        try {
            return await VacationType.findOne(body).exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
    async function addVacationTypeAsync(vct, res) {
        try {
            return await new VacationType(vct).save(function (error, results) {
                if (error) res.send({ data: null, err: error });;
                return results;
            });
        } catch (error) {
            return res.send({ data: null, err: error });;
        }

    }

    async function getVacationTypeAsync(option) {
        try {
            return await VacationType.find(option).exec();
        } catch (error) {
            return error;
        }
    }

}