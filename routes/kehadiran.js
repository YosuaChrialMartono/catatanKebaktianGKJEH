var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');

// Get All Kehadiran
router.get('/all', function (req, res, next) {
    //query
    connection.query('SELECT * FROM kehadiran_jemaat', function (err, rows) {
        if (err) {
            res.status(500).json({
                status: 500,
                message: err
            })
        } else {
            res.status(200).json({
                status: 200,
                data: rows
            })
        }
    });
});

// Get Kehadiran by ID kebaktian
router.get('/:id', function (req, res, next) {
    let id = req.params.id;

    connection.query('SELECT * FROM kehadiran_jemaat WHERE id_kebaktian = ?', id, function (err, rows) {
        if (err) {
            res.status(500).json({
                status: 500,
                message: err
            })
        } else {
            res.status(200).json({
                status: 200,
                data: rows
            })
        }
    });
});

// create kehadiran
router.post('/create', function (req, res, next) {
    let data = {};
    let errors = false;

    if (req.body.id_kebaktian === undefined || req.body.id_kebaktian === '' || req.body.id_kebaktian === null) {
        errors = true;
        res.status(400).json({
            status: 400,
            message: "id_kebaktian dibutuhkan"
        });
    } else {
        data.id_kebaktian = req.body.id_kebaktian;
    }

    req.body.data.forEach(function (element) {
        data[element.label] = element.value;
    });

    if (!errors) {
        connection.query('INSERT INTO kehadiran_jemaat SET ?', data, function (err, result) {
            if (err) {
                switch (err.code) {
                    case 'ER_DUP_ENTRY':
                        res.status(400).json({
                            status: 400,
                            message: "Data kehadiran sudah ada"
                        });
                        break;

                    case 'ER_NO_REFERENCED_ROW_2':
                        res.status(400).json({
                            status: 400,
                            message: "ID kebaktian tidak ditemukan"
                        });
                        break;
                    case 'ER_BAD_FIELD_ERROR':
                        res.status(400).json({
                            status: 400,
                            message: "Salah satu Field tidak ditemukan"
                        });
                        break;
                    default:
                        res.status(500).json({
                            status: 500,
                            message: err
                        });
                }
            } else {
                res.status(200).json({
                    status: 200,
                    message: "Data kehadiran berhasil disimpan"
                });
            }
        });
    }



});

module.exports = router;