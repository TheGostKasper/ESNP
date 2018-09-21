const Vacation = require('./vacation-modal');

module.exports = function (app) {
    app.post('/api/vacation', (req, res) => {
        addVacationAsync(req.body).then((_dt) => {
            getLastAsync(req.body).then(data => {
                res.send({ data: data, message: "Vacation added successfully" });
            }).catch(err => {
                res.send({ data: null, err: err });
            });
        }).catch(err => console.log(err));
    });
    app.get('/api/vacation', (req, res) => {
        getVacationAsync().then(data => {
            res.send({ data: data, message: "Vacation found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.get('/api/vacation/:id', (req, res) => {
        getVacationAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "Vacation found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/vacation/:id', (req, res) => {
        Vacation.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, vacation) {
            if (err) {
                res.send({ data: null, err: err });
            } else {
                res.send({ data: vacation, message: "Vacation updated successfully" })
            }

        });
    });
    app.delete('/api/vacation/:id', (req, res) => {
        Vacation.findOneAndRemove({ _id: req.params.id }, function (err, vacation) {
            if (err) { res.send({ data: null, err: err }); }
            else {
                res.send({ data: vacation, message: "Vacation removed successfully" })
            }
        });
    })

    async function addVacationAsync(vacation) {
        return await new Vacation(vacation).save(function (err, results) {
            if (err) throw err;
            return results;
        });
    }

    async function getVacationAsync(option) {
        return await Vacation.find(option).exec();
    }
    async function getLastAsync(body) {
        try {
            return await Vacation.findOne(body).exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
}