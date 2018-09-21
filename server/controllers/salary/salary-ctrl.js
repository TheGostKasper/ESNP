const Salary = require('./salary-modal');

module.exports = function (app) {
    app.post('/api/salary', (req, res) => {
        // testing 
        if (req.body.length > 1)
            req.body.forEach(function (element) {
                addSalaryAsync(element).then((data) => { }).catch(err => console.log(err));
            }, this);
        else {
            addSalaryAsync(req.body).then((_dt) => {
                getLastAsync({ employee: req.body.employee }).then(dt => {
                    res.send({ data: dt, message: "Money added successfully" });
                }).catch(err => {
                    res.send({ data: null, err: err });
                });
             }).catch(err => console.log(err));
        }
        // res.send({ data: req.body, message: "Salary added successfully" })
    });
    app.get('/api/salary', (req, res) => {
        getSalaryAsync().then(data => {
            res.send({ data: data, message: "Salary found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.get('/api/salary/:id', (req, res) => {
        getSalaryAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "Salary found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.post('/api/salary/filterBy', (req, res) => {
        getSalaryAsync(req.body).then(data => {
            res.send({ data: data, message: "Salary found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/salary/:id', (req, res) => {
        Salary.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, salary) {
            if (err) {
                res.send({ data: null, err: err });
            } else {
                res.send({ data: salary, message: "Salary updated successfully" })
            }

        });
    });
    app.delete('/api/salary/:id', (req, res) => {
        Salary.findOneAndRemove({ _id: req.params.id }, function (err, salary) {
            if (err) { res.send({ data: null, err: err }); }
            else {
                res.send({ data: salary, message: "Salary removed successfully" })
            }
        });
    })

    async function addSalaryAsync(salary) {
        return await new Salary(salary).save(function (err, results) {
            if (err) throw err;
            return results;
        });
    }

    async function getSalaryAsync(option) {
        return await Salary.find(option).populate('employee').exec();
    }
    async function getLastAsync(body) {
        try {
            return await Salary.findOne(body).populate('employee').exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
}