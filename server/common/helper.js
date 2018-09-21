var path = require('path');
var fs = require('fs');
var path = require('path');


module.exports = function (app) {

    uploadImage =async function (req) {
        var data = req.image.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');
        return await fs.writeFileSync(`./images/${req.id}.png`, buf, { encoding: 'base64' });
    }



    return {
        uploadImage: uploadImage
    }
}