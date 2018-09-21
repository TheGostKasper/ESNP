const Attendace = require('./attendance-modal');

module.exports = function (app) {
    app.post('/api/attendance', (req, res) => {
            addAttendaceAsync(req.body, res).then((_dt) => {
                getLastAsync(req.body).then(data => {
                    res.send({ data: data, message: "Attendace added successfully" });
                }).catch(err => {
                    res.send({ data: null, err: err });
                });
            }).catch(err => console.log(err));
    });
    app.get('/api/attendance', (req, res) => {
        getAttendaceAsync().then(data => {
            res.send({ data: data, message: "Attendace found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.get('/api/attendance/:id', (req, res) => {
        getAttendaceAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "Attendace found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/attendance/:id', (req, res) => {
        Attendace.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, attendace) {
            if (err) {
                res.send({ data: null, err: err });
            } else {
                res.send({ data: attendace, message: "Attendace updated successfully" })
            }

        });
    });
    app.delete('/api/attendance/:id', (req, res) => {
        Attendace.findOneAndRemove({ _id: req.params.id }, function (err, attendace) {
            if (err) { res.send({ data: null, err: err }); }
            else {
                res.send({ data: attendace, message: "Attendace removed successfully" })
            }
        });
    })
    async function getLastAsync(body) {
        try {
            return await Attendace.findOne(body).exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
    async function addAttendaceAsync(attendace) {
        return await new Attendace(attendace).save(function (err, results) {
            if (err) throw err;
            return results;
        });
    }

    async function getAttendaceAsync(option) {
        return await Attendace.find(option).exec();
    }

}