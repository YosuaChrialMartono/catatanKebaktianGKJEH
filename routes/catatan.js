var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');

//import pasal
var list_kitab = require('../public/data/list_pasal.json');

/**
 * INDEX Catatan Kebaktian
 */
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM catatan_kebaktian', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('catatan', {
                data: ''
            });
        } else {
            res.render('catatan/index', {
                data: rows
            });
        }
    });
});

/**
 * CREATE Catatan Kebaktian
 */
router.get('/create', function (req, res, next) {
    res.render('catatan/create', {
        list_kitab: list_kitab,
        title: "Form Catatan Kebaktian"
    })
})

/**
 * STORE POST
 */
router.post('/store', function (req, res, next) {

    let errors = false;

    for (col in req.body) {
        if (req.body[col].length === 0) {
            errors = true;

            res.status(400).json({
                message: 'Please fill all required fields.'
            })
        }
    }

    // Check for perikop_bacaan
    if (req.body.kitab && req.body.pasal && req.body.ayat_awal && req.body.ayat_akhir) {
        if (parseInt(req.body.ayat_awal) > parseInt(req.body.ayat_akhir)) {
            errors = true;

            res.status(400).json({
                message: 'Ayat awal tidak boleh lebih besar dari ayat akhir.'
            })
        }
    }

    let catatan = {
        jenis_kebaktian: req.body.jenis_kebaktian,
        tanggal_kebaktian: req.body.tanggal_kebaktian,
        waktu_kebaktian: req.body.waktu_kebaktian,
        perikop_bacaan: req.body.kitab + ' ' + req.body.pasal + ':' + req.body.ayat_awal + '-' + req.body.ayat_akhir,
        pic_ibdah: req.body.pic_ibdah,
        majelis_pembuat: req.body.majelis_pembuat,
        tema_renungan: req.body.tema_renungan,
        peserta_perjamuan_kudus: req.body.peserta_perjamuan_kudus,
        organis: req.body.organis,
        prokantor: req.body.prokantor,
        operator_lcd: req.body.operator_lcd,
        program_director: req.body.program_director,
        tanggal_pembuatan: req.body.tanggal_pembuatan,
        evaluasi_baik_kebaktian: req.body.evaluasi_baik_kebaktian,
        evaluasi_buruk_kebaktian: req.body.evaluasi_buruk_kebaktian,
    }

    // if no error
    if (!errors) {

        // insert query
        connection.query('INSERT INTO catatan_kebaktian SET ?', catatan, function (err, result) {
            //if(err) throw err
            if (err) {
                switch (err.code) {
                    case 'ER_DUP_ENTRY':
                        res.status(500).json({
                            message: "Catatan Kebaktian dengan jenis, tanggal dan waktu yang sama sudah ada!"
                        })
                        break;

                    default:
                        res.status(500).json({
                            message: err
                        })
                        break;
                }
            } else {
                res.status(200).json({
                    message: 'Catatan Kebaktian berhasil ditambahkan!',
                    catatan: result
                })
            }
        })
    }

})

// /** Update Catatan Kebaktian */
// router.get('/update/:id', function (req, res, next) {
//     let id = req.params.id;

//     connection.query('SELECT * FROM catatan_kebaktian WHERE id = ?', id, function (err, rows) {
//         if (err) throw err

//         // if user not found
//         if (rows.length <= 0) {
//             req.flash('error', 'Catatan Kebaktian tidak ditemukan dengan id = ' + id)
//             res.redirect('/catatan')
//         } else { // if user found
//             // render to edit.ejs
//             res.render('catatan/update', {
//                 id: rows[0].id,
//                 jenis_kebaktian: rows[0].jenis_kebaktian,
//                 tanggal_kebaktian: rows[0].tanggal_kebaktian,
//                 waktu_kebaktian: rows[0].waktu_kebaktian,
//                 perikop_bacaan: rows[0].perikop_bacaan,
//                 pic_ibdah: rows[0].pic_ibdah,
//                 majelis_pembuat: rows[0].majelis_pembuat,
//                 tema_renungan: rows[0].tema_renungan,
//                 peserta_perjamuan_kudus: rows[0].peserta_perjamuan_kudus,
//                 organis: rows[0].organis,
//                 prokantor: rows[0].prokantor,
//                 operator_lcd: rows[0].operator_lcd,
//                 program_director: rows[0].program_director,
//                 tanggal_pembuatan: rows[0].tanggal_pembuatan,
//                 evaluasi_baik_kebaktian: rows[0].evaluasi_baik_kebaktian,
//                 evaluasi_buruk_kebaktian: rows[0].evaluasi_buruk_kebaktian,
//             })
//         }
//     })
// })

module.exports = router;