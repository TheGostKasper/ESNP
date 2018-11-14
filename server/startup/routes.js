module.exports = function (app) {
    var middleware = require(`./../common/middleware.js`)(app);
    var sections = require(getUrl('section'))(app)
    var distributes = require(getUrl('distribute'))(app)
    var serviceArea = require(getUrl('serviceArea'))(app)
    var employeeType = require(getUrl('employeeType'))(app)
    var employee = require(getUrl('employee'))(app)
    var salary = require(getUrl('salary'))(app)
    var attendance = require(getUrl('attendance'))(app)
    var vacation = require(getUrl('vacation'))(app)
    var vacationType = require(getUrl('vacationType'))(app)
    var exchange = require(getUrl('exchange'))(app)
    var category = require(getUrl('category'))(app)
    var subCategory = require(getUrl('subCategory'))(app)
    var item = require(getUrl('item'))(app)
    var registrations = require(getUrl('registration'))(app)


    function getUrl(ctrl) {
        return `./../controllers/${ctrl}/${ctrl}-ctrl.js`;
    }
}