var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');


/* GET pelayan firman listing. */
router.get('/', function (req, res, next) {
    res.render('pelayan_firman/index', { title: 'Data Pelayan Firman' });
});

/* GET pelayan firman list. */
router.get('/json', function (req, res, next) {
    //query
    connection.query("SELECT * FROM pelayan_firman", function (err, rows) {
        if (err) {
            res.status(500).json({
                status: 500,
                data: '',
                message: err
            });
        } else {
            res.status(200).json({
                status: 200,
                data: rows
            });
        }
    });
});

// Get Pelayan Firman with ID
router.get('/json/:id', function (req, res, next) {
    const pelayanFirmanId = req.params.id;
    // Query
    connection.query('SELECT * FROM pelayan_firman WHERE pelayan_firman_id = ?',
        pelayanFirmanId, function (err, rows) {
            if (err) {
                res.status(500).json({
                    status: 500,
                    data: '',
                    message: err
                });
            }
            else {
                res.status(200).json({
                    status: 200,
                    data: rows[0]
                });
            }
        });
});

router.post('/create', function (req, res, next) {
    let nama = req.body.nama;
    let asal = req.body.asal;
    let errors = false;

    // Validation
    if (nama.length === 0 || asal.length === 0) {
        errors = true;
        res.status(400).json({
            status: 400,
            data: '',
            message: 'Nama dan Asal harus diisi'
        });
    }

    [[nama, 'Nama'], [asal, 'Asal']].forEach(function (item) {
        if (item[0].length === 0) {
            errors = true;
            res.status(400).json({
                status: 400,
                message: 'Tolong isi input ' + item[1]
            })
        }
    })

    if (!errors) {
        let pelayanFirman = {
            nama: nama,
            asal: asal
        }

        // Insert Query
        connection.query('INSERT INTO pelayan_firman SET ?', pelayanFirman, function (err, result) {
            if (err) {
                console.log(err.code);
                switch (err.code) {
                    case 'ER_DUP_ENTRY':
                        res.status(400).json({
                            status: 400,
                            data: '',
                            message: 'Pelayan Firman sudah ada'
                        });
                        break;

                    default:
                        res.status(500).json({
                            status: 500,
                            data: '',
                            message: err
                        });
                        break;
                }
            } else {
                res.status(200).json({
                    status: 200,
                    data: result,
                    message: 'Pelayan Firman berhasil ditambahkan'
                });
            }
        });
    }
})

router.put('/update/:id', function (req, res, next) {
    let pelayanFirmanId = req.params.id;
    let nama = req.body.nama;
    let asal = req.body.asal;
    let errors = false;

    // Validation
    if (nama.length === 0 && asal.length === 0) {
        errors = true;
        res.status(400).json({
            status: 400,
            data: '',
            message: 'Nama dan Asal harus diisi'
        });
    }

    [[nama, 'Nama'], [asal, 'Asal']].forEach(function (item) {
        if (item[0].length === 0) {
            errors = true;
            res.status(400).json({
                status: 400,
                message: 'Tolong isi input ' + item[1]
            })
        }
    })

    if (!errors) {
        let pelayanFirman = {
            nama: nama,
            asal: asal
        }

        // Update Query
        connection.query('UPDATE pelayan_firman SET ? WHERE pelayan_firman_id = ?', [pelayanFirman, pelayanFirmanId], function (err, result) {
            if (err) {
                res.status(500).json({
                    status: 500,
                    data: '',
                    message: err
                });
            } else {
                res.status(200).json({
                    status: 200,
                    data: result,
                    message: 'Pelayan Firman berhasil diupdate'
                });
            }
        });
    }
})

module.exports = router;
