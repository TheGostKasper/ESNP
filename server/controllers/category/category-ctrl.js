const Category = require('./category-modal');

module.exports = function (app) {
    app.post('/api/category', (req, res) => {
     
        addCategoryAsync(req.body, res).then((_dt) => {
            getLastAsync(req.body).then(data => {
                res.send({ data: data, message: "Category added successfully" });
            }).catch(err => {
                res.send({ data: null, err: err });
            });
        }).catch(err => console.log(err));
    });
    app.get('/api/category', (req, res) => {
        getCategoryAsync().then(data => {
            res.send({ data: data, message: "Category found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });


    app.get('/api/category/:id', (req, res) => {
        getCategoryAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "Category found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.post('/api/category/filterBy', (req, res) => {
        getCategoryAsync(req.body).then(data => {
            res.send({ data: data, message: "Category found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/category/:id', (req, res) => {
        try {
            Category.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, option) {
                if (err) {
                    res.send({ data: null, err: err });
                } else {
                    res.send({ data: option, message: "Category updated successfully" })
                }

            })
        } catch (error) {
            res.send({ data: null, err: err });
        }

    });
    app.delete('/api/category/:id', (req, res) => {

        try {
            Category.findOneAndRemove({ _id: req.params.id }, function (err, option) {
                if (err) { res.send({ data: null, err: err }); }
                else {
                    res.send({ data: option, message: "Category removed successfully" })
                }
            });
        } catch (error) {
            res.send({ data: null, err: error });
        }
    })

    async function getLastAsync(body) {
        try {
            return await Category.findOne(body).exec();
        } catch (error) {
            res.send({ data: null, err: error });
        }
    }
    async function addCategoryAsync(option, res) {
        try {
            return await new Category(option).save(function (error, results) {
                if (error) res.send({ data: null, err: error });;
                return results;
            });
        } catch (error) {
            return res.send({ data: null, err: error });;
        }

    }

    async function getCategoryAsync(option) {
        try {
            return await Category.find(option).exec();
        } catch (error) {
            return error;
        }
    }

}