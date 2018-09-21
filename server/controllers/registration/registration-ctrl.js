const jwt = require('jsonwebtoken');
const Employee = require('./../employee/employee-modal');

module.exports = function (app) {
    app.post('/login', (req, res) => {
        var _body = req.body;
        login(_body.type, { militaryId: _body.militaryId, password: _body.password })
            .then(data => {
                if (data === null) {
                    return res.json(displayError());
                }
                else {
                    return res.json({ data: data, token: getToken(data), message: "Welcome back! " });
                }
            }).catch(err => {
                return res.json(displayError());
            });
    });

    app.post('/signUp', (req, res) => {
        addEmployeeAsync(req.body).then((data) => { 
            getLastAsync(req.body).then(dt => {
                res.send({ data: dt, token: getToken(dt), message: "Solider added successfully" });
            }).catch(err => {
                res.send(displayError(message = err));
            });
        }).catch(err => console.log(err));
    })

    // get token
    function getToken(user) {
        const payload = {
            user: user
        };
        return jwt.sign(payload, app.get('superSecret'));
    }
   
    async function addEmployeeAsync(employee) {
        return await new Employee(employee).save(function (err, results) {
            if (err) throw err;
            return results;
        });
    }
   
    async function getLastAsync(body) {
        try {
            return await Employee.findOne(body).exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
    // diff login
    async function login(type, filter) {
        return await Employee.findOne(filter).exec();
    }

    function displayError(data = null, message = "Authentication faild, Username or password is incorect") {
        return { data: data, message: message }
    }

    // validate token

    // encrypt password


}