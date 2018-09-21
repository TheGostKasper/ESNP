const ServiceType = require('./serviceType-modal');

module.exports = function (app) {
    app.post('/api/serviceType', (req, res) => {
        // testing 
        if (req.body.length > 1)
            req.body.forEach(function (element) {
                addServiceTypeAsync(element).then((data) => { }).catch(err => console.log(err));
            }, this);
        else {
            addServiceTypeAsync(req.body).then((data) => { }).catch(err => console.log(err));
        }
        res.send({ data: req.body, message: "ServiceType added successfully" })
    });
    app.get('/api/serviceType', (req, res) => {
        getServiceTypeAsync().then(data => {
            res.send({ data: data, message: "ServiceType found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.get('/api/serviceType/:id', (req, res) => {
        getServiceTypeAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "ServiceType found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/serviceType/:id', (req, res) => {
        ServiceType.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, serviceType) {
            if (err) {
                res.send({ data: null, err: err });
            } else {
                res.send({ data: serviceType, message: "ServiceType updated successfully" })
            }

        });
    });
    app.delete('/api/serviceType/:id', (req, res) => {
        ServiceType.findOneAndRemove({ _id: req.params.id }, function (err, serviceType) {
            if (err) { res.send({ data: null, err: err }); }
            else {
                res.send({ data: serviceType, message: "ServiceType removed successfully" })
            }
        });
    })
   
    async function addServiceTypeAsync(serviceType) {
        return await new ServiceType(serviceType).save(function (err, results) {
            if (err) throw err;
            return results;
        });
    }

    async function getServiceTypeAsync(option) {
        return await ServiceType.find(option).exec();
    }

}