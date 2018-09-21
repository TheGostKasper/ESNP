const Employee = require('./employee-modal');

module.exports = function (app) {
    app.post('/api/employee', (req, res) => {
        addEmployeeAsync(req.body).then((_dt) => {
            getLastAsync({ militaryId: req.body.militaryId }).then(data => {
                res.send({ data: data, message: "Solider added successfully" });
            }).catch(err => {
                res.send({ data: null, err: err });
            });
        }).catch(err => console.log(err));
    });
    app.get('/api/employee', (req, res) => {
        getEmployeeAsync().then(data => {
            res.send({ data: data, message: "Employee found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.get('/api/employee/:id', (req, res) => {
        getEmployeeAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "Employee found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.post('/api/employee/filterBy', (req, res) => {
        getEmployeeAsync(req.body).then(data => {
            res.send({ data: data, message: "Employee found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    // app.post('/api/employee/filter', (req, res) => {
    //     getEmployeeFilterAsync(req.body).then(data => {
    //         res.send({ data: data, message: "Employee found" });
    //     }).catch(err => {
    //         res.send({ data: null, err: err });
    //     });
    // });
    app.put('/api/employee/:id', (req, res) => {
        Employee.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, employee) {
            if (err) {
                res.send({ data: null, err: err });
            } else {
                res.send({ data: employee, message: "Employee updated successfully" })
            }

        });
    });
    app.delete('/api/employee/:id', (req, res) => {
        Employee.findOneAndRemove({ _id: req.params.id }, function (err, employee) {
            if (err) { res.send({ data: null, err: err }); }
            else {
                res.send({ data: employee, message: "Employee removed successfully" })
            }
        });
    })
    // Shift Areas 
    app.post('/api/employee/shiftAreas/:id', (req, res) => {
        addSubArray(req.params.id, { "extra.shiftAreas": req.body.extra.shiftAreas })
            .then((data) =>
                res.send({ data: data, message: "Shift Areas sent successfully" })
            ).catch(err => res.send({ data: null, err: err }));

    });
    app.delete('/api/employee/shiftAreas/:id', (req, res) => {
        delSubArray({ "extra.shiftAreas": { _id: req.params.id } })
            .then((data) =>
                res.send({ data: data, message: "Shift Areas deleted successfully" })
            ).catch(err => res.send({ data: null, err: err }));
    });
    async function delSubArray(option) {
        return await Employee.update({},
            { $pull: option },
            { multi: true }
        ).exec();
    }
    async function addSubArray(id, option) {
        return await Employee.findOneAndUpdate({ _id: id }, {
            $push: option
        }).exec();
    }
    async function addEmployeeAsync(employee) {
        return await new Employee(employee).save(function (err, results) {
            if (err) throw err;
            return results;
        });
    }

    async function getEmployeeAsync(option) {
        return await Employee.find(option).populate('section').sort({ onDuty: 1 }).exec();
    }
    // async function getEmployeeFilterAsync(config) {

    //     return await Employee.find(config.option).populate('section').sort({ name: 1 }).exec();
    // }
    async function getLastAsync(body) {
        try {
            return await Employee.findOne(body).populate('section').exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
}