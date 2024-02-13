var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');


/* GET majelis listing. */
router.get('/', function (req, res, next) {
    res.render('majelis/index', { title: 'Data Majelis' });
});

/* GET majelis list. */
router.get('/json', function (req, res, next) {
    //query
    connection.query('SELECT * FROM majelis', function (err, rows) {
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

// Get Majelis with ID
router.get('/json/:id', function (req, res, next) {
    const majelisId = req.params.id;
    // Query
    connection.query('SELECT * FROM majelis WHERE majelis_id = ?', majelisId, function (err, rows) {
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
    }
    )
});

router.post('/create', function (req, res, next) {

    let nama = req.body.nama;
    let wilayah = req.body.wilayah;
    let gelar = req.body.gelar;
    let errors = false;

    // Validation
    if (nama.length === 0 && wilayah.length === 0 && gelar.length === 0) {
        errors = true;
        res.status(400).json({
            status: 400,
            message: 'Tolong isi semua input'
        })
    }

    [[nama, 'Nama'], [wilayah, 'Wilayah'], [gelar, 'Gelar']].forEach(function (item) {
        if (item[0].length === 0) {
            errors = true;
            res.status(400).json({
                status: 400,
                message: 'Tolong isi input ' + item[1]
            })
        }
    })

    if (!errors) {
        let majelis = {
            nama: nama,
            wilayah: wilayah,
            gelar: gelar
        }

        // insert query
        connection.query('INSERT INTO majelis SET ?', majelis, function (err, result) {
            if (err) {
                console.log(err.code);
                switch (err.code) {
                    case 'ER_DUP_ENTRY':
                        res.status(400).json({
                            status: 400,
                            message: 'Majelis sudah ada!'
                        });
                        break;

                    default:
                        res.status(500).json({
                            status: 500,
                            message: err
                        });
                        break;
                }
            } else {
                // Retrieve the inserted data using the insertId
                const insertedMajelisId = result.insertId;

                // You might need to perform another SELECT query to get the full majelis data
                connection.query('SELECT * FROM majelis WHERE majelis_id = ?', insertedMajelisId, function (selectErr, selectResult) {
                    if (selectErr) {
                        res.status(500).json({
                            status: 500,
                            message: selectErr
                        });
                    } else {
                        res.status(200).json({
                            status: 200,
                            message: 'Berhasil menambah majelis',
                            majelis: selectResult[0] // Assuming only one row is returned
                        });
                        console.log(selectResult[0]);
                    }
                });
            }
        });

    }
})

router.put('/update/:id', function (req, res, next) {
    let majelisId = req.params.id;
    let nama = req.body.nama;
    let wilayah = req.body.wilayah;
    let gelar = req.body.gelar;
    let errors = false;

    // Validation
    if (nama.length === 0 && wilayah.length === 0 && gelar.length === 0) {
        errors = true;
        res.status(400).json({
            status: 400,
            message: 'Tolong isi semua input'
        })
    }

    [[nama, 'Nama'], [wilayah, 'Wilayah'], [gelar, 'Gelar']].forEach(function (item) {
        if (item[0].length === 0) {
            errors = true;
            res.status(400).json({
                status: 400,
                message: 'Tolong isi input ' + item[1]
            })
        }
    })

    if (!errors) {
        let majelis = {
            nama: nama,
            wilayah: wilayah,
            gelar: gelar
        }

        // Update query
        connection.query('UPDATE majelis SET ? WHERE majelis_id = ?', [majelis, majelisId], function (err, result) {
            if (err) {
                console.log(err.code);
                switch (err.code) {
                    case 'ER_DUP_ENTRY':
                        res.status(400).json({
                            status: 400,
                            message: 'Majelis sudah ada!'
                        });
                        break;

                    default:
                        res.status(500).json({
                            status: 500,
                            message: err
                        });
                        break;
                }
            } else {
                res.status(200).json({
                    status: 200,
                    message: 'Majelis berhasil diupdate'
                });
            }
        });
    }
});


router.delete('/delete/:id', function (req, res, next) {
    const majelisId = req.params.id;
    connection.query('DELETE FROM majelis WHERE majelis_id = ?', majelisId, function (err, result) {
        if (err) {
            res.status(500).json({
                status: 500,
                message: err
            });
        } else {
            res.status(200).json({
                status: 200,
                message: 'Majelis berhasil dihapus'
            });
        }
    });
});

module.exports = router;
