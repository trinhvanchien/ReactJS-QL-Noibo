var Validator = require('../validate/common')
const customerData = require('../data/customer.data')
const constant = require('./constant')
const uuidv1 = require('uuid/v1');
var CustomerController = {
    /**
     * Get user paging.
     * @param {Number} pageNumber Page number
     * @param {Number} pageSize Page size
     * @param {Function} callback Function call back
     */
    /**
     * @para
     */
    getCustomer: function getCustomer(pageNumber, pageSize, index, sortBy, callback) {
        let limit = pageSize;
        let offset = pageSize * (pageNumber - 1);
        // var res_customer = []
        customerData.getCustomer(limit, offset, index, sortBy, async (data) => {
            // await data.data.customers.map((value, index) => {

            //     switch (value.dm_dv_trangthai) {
            //         case 'HD':
            //             value.dm_dv_trangthai_txt = 'Hoạt Động'
            //             break;
            //         case 'DHD':
            //             value.dm_dv_trangthai_txt = 'Dừng Hoạt Động'
            //             break;
            //         case 'GT':
            //             value.dm_dv_trangthai_txt = 'Giải Thể'
            //             break;

            //     }

            //     res_unit.push(value)
            // })
            // console.log(res_customer, 'data')
            // data.data.customer = res_unit
            callback(data);
        });
    },
    /**
    * Get user by Id.
    * @param {Number} Id The identify of user
    */

    // getcha: function getcha(callback) {
    //     unitData.getcha((data)=>{
    //         callback(data)
    //     })
    // },


    GetById: function GetById(Id, callback) {
        customerData.GetById(Id, (data) => {
            console.log('DATA', data)
            if (data == undefined) {
                callback({});
            }
            callback(data);
        })
    },

    DeleteCustomerbyId: async function deleteCustomerbyId(Id, callback) {
        customerData.deleteCustomerbyId(Id, (data) => {
            if (data.success === true) {
                callback({
                    success: data.success,
                    message: data.success === true ? constant.successDelete : constant.errorMessage
                })
            }
            callback(data, 400);
        })
    },

    insertCustomer: async function insertCustomer(customer, callback) {
        customer.kh_id = uuidv1();
        if (
            Validator.isInt(customer.dm_db_id_tinh, 'ID Tỉnh không đúng định dạng !!')
            & Validator.isInt(customer.dm_db_id_huyen, 'ID Huyện không đúng định dạng !!')
            & Validator.isInt(customer.dm_db_id_xa, 'ID Xã không đúng định dạng !!')
            & Validator.isInt(customer.kh_sodienthoai, 'Số điện thoại không đúng định dạng !!')
            & Validator.Name(customer.kh_ho, 'Họ không đúng định dạng !!')
            & Validator.Name(customer.kh_tenlot, 'Tên lót không đúng định dạng !!')
            & Validator.Name(customer.kh_ten, 'Tên không đúng định dạng !!')
        ) {
            if (
                await Validator.db.unique('khachhangs', 'kh_email', customer.kh_email, 'Email khách hàng này đã tồn tại !!')
                & await Validator.db.unique('khachhangs', 'kh_sodienthoai', customer.kh_sodienthoai, 'Số điện thoại khách hàng này đã tồn tại !!')
            ) {
                console.log('đã validate')
                customerData.insertCustomer(customer, (response) => {
                    var message = constant.successInseart;
                    var status = 200;
                    if (!response.success) {
                        Validator.error.push(constant.errorSys)
                        message = Validator.getError()
                        status = 400
                    }
                    callback({
                        message: message,
                        success: response.success
                    }, status);
                })
            }
            else {
                var eror = Validator.getError()
                console.log('lỗi trả về', eror)
                callback({
                    message: eror,
                    success: false
                }, 400);
            }
        }
    },
    updateCustomer: function updateCustomer(customer, callback) {
        customerData.updateCustomer(customer, (res) => {
            callback({
                success: res.success,
                message: res.success === true ? constant.successUpdate : callback.errorUpdate
            })
        })
    },
    search: function search(pageSize, pageNumber, textSearch, columnSearch, index, sortBy, callback) {
        let limit = pageSize;
        let offset = pageSize * (pageNumber - 1);
        customerData.search(limit, offset, textSearch, columnSearch, index, sortBy, (data) => {
            console.log(limit)
            console.log(offset)

            console.log('aaaaaaaaa', data)
            callback(data);
        })
    },

    validateCreate: (req, res, next) => {
        next()
    },
}
module.exports = CustomerController;