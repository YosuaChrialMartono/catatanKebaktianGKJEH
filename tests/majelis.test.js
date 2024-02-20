const request = require('supertest');
const app = require('../app');

var connection = require('../library/database');

// Test Majelis Routers
describe('Majelis Routers', () => {
    const majelis1 = {
        majelis_id: 1,
        nama: 'Test Majelis',
        wilayah: 'Test Wilayah',
        gelar: 'Test Gelar'
    }

    const majelis2 = {
        majelis_id: 1,
        nama: 'Test Majelis 2',
        wilayah: 'Test Wilayah 2',
        gelar: 'Test Gelar 2'
    }

    // Get all Majelis
    it('Get Majelis', async () => {
        const res = await request(app)
            .get('/majelis/json');

        expect(res.statusCode).toBe(200);
    });

    it('Get Majelis by ID from first majelis in all should succeed', async () => {
        try {
            // Fetch majelisList using await to make it asynchronous
            const majelisList = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM majelis', function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });

            if (majelisList.length === 0) {
                // Handle the case where majelisList is empty
                throw new Error('Majelis list is empty');
            }

            const majelisId = majelisList[0].majelis_id;

            const res = await request(app)
                .get(`/majelis/json/${majelisId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toEqual(majelisList[0]);
        } catch (error) {
            // Handle any errors that might occur during the test
            console.error('Error:', error);
            throw error; // Re-throw the error to fail the test
        }
    });

    it('Get Majelis by ID should fail', async () => {
        const res = await request(app)
            .get('/majelis/json/0');

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Majelis tidak ditemukan');
    });

    // function to delete test majelis
    async function deleteTestMajelis(majelis) {
        return new Promise((resolve, reject) => {
            let query = 'DELETE FROM majelis WHERE ';
            query += 'majelis_id = ' + majelis.majelis_id;
            query += ' AND nama = "' + majelis.nama + '"';
            query += ' AND wilayah = "' + majelis.wilayah + '"';
            query += ' AND gelar = "' + majelis.gelar + '"';
            connection.query(query, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // Create Majelis
    it('Create Majelis success route', async () => {
        // Delete majelis1 if exist
        try {
            await deleteTestMajelis(majelis1);
        } catch (error) {
            console.error('Error:', error);
        }

        const createRes = await request(app)
            .post('/majelis/create')
            .send(majelis1);

        expect(createRes.statusCode).toBe(200);
        expect(createRes.body.message).toBe('Majelis berhasil ditambahkan');

        const checkRes = await request(app)
            .get('/majelis/json/' + majelis1.majelis_id);

        expect(checkRes.statusCode).toBe(200);
        expect(checkRes.body.data).toEqual(majelis1);
    });

    it('Create Majelis input validation failed', async () => {
        const res = await request(app)
            .post('/majelis/create')
            .send({
                nama: "",
                wilayah: "",
                gelar: ""
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Tolong isi semua input');
    });

    it('Create Majelis partial input validation failed', async () => {
        const res = await request(app)
            .post('/majelis/create')
            .send({
                nama: 'Test Majelis',
                wilayah: '',
                gelar: ''
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Tolong isi input Wilayah, Gelar');
    });

    it('Create Majelis duplicate entry failed', async () => {
        const res = await request(app)
            .post('/majelis/create')
            .send(majelis1);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Majelis sudah ada!');
    });

    // Update Majelis
    it('Update Majelis success route', async () => {
        const updateRes = await request(app)
            .put('/majelis/update/' + majelis1.majelis_id)
            .send(majelis2);

        expect(updateRes.statusCode).toBe(200);
        expect(updateRes.body.message).toBe('Majelis berhasil diupdate');

        const checkRes = await request(app)
            .get('/majelis/json/' + majelis1.majelis_id);

        expect(checkRes.statusCode).toBe(200);
        expect(checkRes.body.data).toEqual(majelis2);
    });

    it('Update Majelis input validation failed', async () => {
        const res = await request(app)
            .put('/majelis/update/' + majelis2.majelis_id)
            .send({
                nama: "",
                wilayah: "",
                gelar: ""
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Tolong isi semua input');
    });

    it('Update Majelis partial input validation failed', async () => {
        const res = await request(app)
            .put('/majelis/update/' + majelis2.majelis_id)
            .send({
                nama: 'Test Majelis',
                wilayah: '',
                gelar: ''
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Tolong isi input Wilayah, Gelar');
    });

    it('Update non existing majelis should fail', async () => {
        const res = await request(app)
            .put('/majelis/update/0')
            .send(majelis1);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Majelis tidak ditemukan');
    });

    // Delete Majelis
    it('Delete Majelis success route', async () => {
        const deleteRes = await request(app)
            .delete('/majelis/delete/' + majelis2.majelis_id);

        expect(deleteRes.statusCode).toBe(200);
        expect(deleteRes.body.message).toBe('Majelis berhasil dihapus');
    });

    it('Delete non existing majelis should fail', async () => {
        const res = await request(app)
            .delete('/majelis/delete/0');

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Majelis tidak ditemukan');
    });


});