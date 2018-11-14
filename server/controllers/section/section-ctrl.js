const Section = require('./section-modal');

module.exports = function (app) {
    app.post('/api/section', (req, res) => {
        console.log(req.body)
        addSectionAsync(req.body, res).then((_dt) => {
            getLastAsync(req.body).then(data => {
                res.send({ data: data, message: "Section added successfully" });
            }).catch(err => {
                res.send({ data: null, err: err });
            });
        }).catch(err => console.log(err));
    });
    app.get('/api/section', (req, res) => {
        getSectionAsync().then(data => {
            res.send({ data: data, message: "Section found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });


    app.get('/api/section/:id', (req, res) => {
        getSectionAsync({ _id: req.params.id }).then(data => {
            res.send({ data: data, message: "Section found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });
    app.post('/api/section/filterBy', (req, res) => {
        getSectionAsync(req.body).then(data => {
            res.send({ data: data, message: "Section found" });
        }).catch(err => {
            res.send({ data: null, err: err });
        });
    });

    app.put('/api/section/:id', (req, res) => {
        try {
            Section.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, function (err, section) {
                if (err) {
                    res.send({ data: null, err: err });
                } else {
                    res.send({ data: section, message: "Section updated successfully" })
                }

            });
} catch (error) {
    res.send({ data: null, err: err });
}

    });
app.delete('/api/section/:id', (req, res) => {

    try {
        Section.findOneAndRemove({ _id: req.params.id }, function (err, section) {
            if (err) { res.send({ data: null, err: err }); }
            else {
                res.send({ data: section, message: "Section removed successfully" })
            }
        });
    } catch (error) {
        res.send({ data: null, err: error });
    }
})

async function getLastAsync(body) {
    try {
        return await Section.findOne(body).populate('vacationType').exec();
    } catch (error) {
        res.send({ data: null, err: error });
    }
}
async function addSectionAsync(section, res) {
    try {
        return await new Section(section).save(function (error, results) {
            if (error) res.send({ data: null, err: error });;
            return results;
        });
    } catch (error) {
        return res.send({ data: null, err: error });;
    }

}

async function getSectionAsync(option) {
    try {
        return await Section.find(option).populate('vacationType').exec();
    } catch (error) {
        return error;
    }
}

}