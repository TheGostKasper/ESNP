const SubCategory = require('./subCategory-modal');

module.exports = function (app) {
    app.post('/api/subCategory', (req, res) => {
        addSubCategoryAsync(req.body, res).then((_dt) => {
            getLastAsync(req.body).then(data => {
                res.send({ data: data, message: "SubCategory added successfully" });
            }).catch(err => {
                res.send({ data: null, err: err });
            });
        }).catch(err => console.log(err));
    });
    app.get('/api/subCategory', (req, res) => {
        getSubCategoryAsync().then(data => {
            res.send({ data: data, message: "SubCategory found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });


    app.get('/api/subCategory/:id', (req, res) => {
        getSubCategoryAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "SubCategory found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.post('/api/subCategory/filterBy', (req, res) => {
        getSubCategoryAsync(req.body).then(data => {
            res.send({ data: data, message: "SubCategory found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/subCategory/:id', (req, res) => {
        try {
            SubCategory.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, option) {
                if (err) {
                    res.send({ data: null, err: err });
                } else {
                    res.send({ data: option, message: "SubCategory updated successfully" })
                }

            })
        } catch (error) {
            res.send({ data: null, err: err });
        }

    });
    app.delete('/api/subCategory/:id', (req, res) => {

        try {
            SubCategory.findOneAndRemove({ _id: req.params.id }, function (err, option) {
                if (err) { res.send({ data: null, err: err }); }
                else {
                    res.send({ data: option, message: "SubCategory removed successfully" })
                }
            });
        } catch (error) {
            res.send({ data: null, err: error });
        }
    })

    async function getLastAsync(body) {
        try {
            return await SubCategory.findOne(body).populate('category').exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
    async function addSubCategoryAsync(option, res) {
        try {
            return await new SubCategory(option).save(function (error, results) {
                if (error) res.send({ data: null, err: error });;
                return results;
            });
        } catch (error) {
            return res.send({ data: null, err: error });;
        }

    }

    async function getSubCategoryAsync(option) {
        try {
            return await SubCategory.find(option).populate('category').exec();
        } catch (error) {
            return error;
        }
    }

}