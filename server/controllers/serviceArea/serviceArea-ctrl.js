const ServiceArea = require('./serviceArea-modal');

module.exports = function (app) {
    app.post('/api/serviceArea', (req, res) => {
        // testing 
        if (req.body.length > 1)
            req.body.forEach(function (element) {
                addServiceAreaAsync(element).then((data) => { }).catch(err => console.log(err));
            }, this);
        else {
            addServiceAreaAsync(req.body, res).then((_dt) => {
                getLastAsync(req.body).then(data => {
                    res.send({ data: data, message: "Service Area added successfully" });
                }).catch(err => {
                    res.send({ data: null, err: err });
                });
            }).catch(err => res.send({ data: null, err: err }));
        }
        // res.send({ data: req.body, message: "Service Area added successfully" })
    });
    app.get('/api/serviceArea', (req, res) => {
        getServiceAreaAsync().then(data => {
            res.send({ data: data, message: "Service Area found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.get('/api/serviceArea/:id', (req, res) => {
        getServiceAreaAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "Service Area found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/serviceArea/:id', (req, res) => {
        ServiceArea.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, serviceArea) {
            if (err) {
                res.send({ data: null, err: err });
            } else {
                res.send({ data: serviceArea, message: "Service Area updated successfully" })
            }

        });
    });
    app.delete('/api/serviceArea/:id', (req, res) => {
        ServiceArea.findOneAndRemove({ _id: req.params.id }, function (err, serviceArea) {
            if (err) { res.send({ data: null, err: err }); }
            else {
                res.send({ data: serviceArea, message: "Service Area removed successfully" })
            }
        });
    })

    async function addServiceAreaAsync(serviceArea) {
        return await new ServiceArea(serviceArea).save(function (err, results) {
            if (err) throw err;
            return results;
        });
    }

    async function getServiceAreaAsync(option) {
        return await ServiceArea.find(option).sort({ priority: 1 }).exec();
    }
    async function getLastAsync(body) {
        try {
            return await ServiceArea.findOne(body).exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
    
}