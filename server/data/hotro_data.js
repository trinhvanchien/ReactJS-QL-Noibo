var knex = require('./common/DB')

module.exports = {
    getHotro: (limit, offset, index, sortBy, callback) => {
        knex.raw("select  hotro.* , dm_da.dm_duan_ten, khh.kh_hovaten, nhs.ns_hovaten from hotros hotro left join (select da.dm_duan_ten dm_duan_ten, da.dm_duan_id dm_duan_id from duans da) as dm_da on dm_da.dm_duan_id = hotro.dm_duan_id left join (select kh.kh_ho || ' ' ||  kh.kh_tenlot  || ' ' || kh.kh_ten as kh_hovaten, kh.kh_id kh_id from khachhangs kh) as khh on khh.kh_id = hotro.kh_id left join (select ns.ns_ho || ' ' ||  ns.ns_tenlot  || ' ' || ns.ns_ten as ns_hovaten, ns.ns_id ns_id from nhansu ns) as nhs on nhs.ns_id = hotro.ns_id_nguoitao order by " + index + ' ' + sortBy + ' offset ' + offset + ' limit ' + limit)
            // knex.select('*').from('hotros').orderBy(index, sortBy).limit(limit).offset(offset)    
            .then((res) => {
                knex('hotros').count()
                    .then((resCount) => {
                        console.log("hien thi count ", resCount[0].count)
                        callback({
                            success: true,
                            data: {
                                hotros: res.rows,
                                // hotros: res,
                                count: resCount[0].count
                            }
                        })
                    }).catch((err) => {
                        console.log(err),
                            callback({
                                success: false
                            })
                    })
            }).catch((err) => {
                console.log(err),
                    callback({
                        success: false
                    })
            })
    },

    getIdDuan(callback) {
        knex.select('dm_duan_id', 'dm_duan_ten').from('duans').then((res) => {
            callback({
                data: {
                    hotros: res
                }
            })
        })
    },

    getNhanSu(callback) {
        knex.select('ns_id', knex.raw("coalesce (ns_ho, '') || ' ' || coalesce (ns_tenlot, '') || ' ' || coalesce (ns_ten, '') as ns_hovaten")).from('nhansu').then((res) => {
            callback({
                data: {
                    nhansu: res
                }
            })
        })
    },

    getKhachHang(callback) {
        knex.select('kh_id', knex.raw("kh_ho || ' ' || coalesce(kh_tenlot, '') || ' ' || kh_ten as kh_hovaten")).from('khachhangs').then((res) => {
            callback({
                data: {
                    khachhangs: res
                }
            })
        })
    },

    insertHotro: function (hotros, callback) {
        knex.from('hotros').insert(hotros).then(res => {
            callback({
                success: true
            })
            console.log('DaTa =>: ', hotros)
        }).catch(err => {
            console.log(err)
            callback({
                success: false
            })
        })
    },

    updateHotro: function (hotros, callback) {
        console.log("hien thi ho tro ", hotros)
        console.log("hien thi hotros.ht_thoigian_dukien_hoanthanh ",hotros.ht_thoigian_dukien_hoanthanh)
        knex.from('hotros').where('ht_id', hotros.ht_id).update(hotros).then(res => {
            callback({
                success: true,
            })
        }).catch(err => {
            console.log(err)
            callback({
                success: false
            })
        })
    },

    deleteHotro: function (ht_id, callback) {
        knex.from('hotros').whereIn('ht_id', ht_id).del().then(res => {
            callback({
                success: true
            })
        }).catch(err => {
            console.log(err)
            callback({
                success: false
            })
        })
    },

    selectHotro: function (hotros, callback) {
        knex.from('hotros').select('*').where('ht_id', hotros.ht_id).then(res => {
            callback(res[0])
        }).catch(err => {
            console.log(err)
            callback({ success: false })
        })
    }
}