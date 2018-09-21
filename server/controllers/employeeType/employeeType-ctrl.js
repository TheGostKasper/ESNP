const EmployeeType = require('./employeeType-modal');

module.exports = function (app) {
    app.post('/api/employeeType', (req, res) => {
        // testing 
        if (req.body.length > 1)
            req.body.forEach(function (element) {
                addEmployeeTypeAsync(element).then((data) => { }).catch(err => console.log(err));
            }, this);
        else {
            addEmployeeTypeAsync(req.body).then((data) => { }).catch(err => console.log(err));
        }
        res.send({ data: req.body, message: "EmployeeType added successfully" })
    });
    app.get('/api/employeeType', (req, res) => {
        getEmployeeTypeAsync().then(data => {
            res.send({ data: data, message: "EmployeeType found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.get('/api/employeeType/:id', (req, res) => {
        getEmployeeTypeAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "EmployeeType found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/employeeType/:id', (req, res) => {
       EmployeeType.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, employeeType) {
            if (err) {
                res.send({ data: null, err: err });
            } else {
                res.send({ data: employeeType, message: "EmployeeType updated successfully" })
            }

        });
    });
    app.delete('/api/employeeType/:id', (req, res) => {
       EmployeeType.findOneAndRemove({ _id: req.params.id }, function (err, employeeType) {
            if (err) { res.send({ data: null, err: err }); }
            else {
                res.send({ data: employeeType, message: "EmployeeType removed successfully" })
            }
        });
    })
   
    async function addEmployeeTypeAsync(employeeType) {
        return await new EmployeeType(employeeType).save(function (err, results) {
            if (err) throw err;
            return results;
        });
    }

    async function getEmployeeTypeAsync(option) {
        return await EmployeeType.find(option).exec();
    }

}