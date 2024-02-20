const request = require('supertest');
const app = require('../app');

var connection = require('../library/database');

// Test catatan
describe('Catatan Routers', () => {
    it('2+2 equals 4', async () => {
        expect(2 + 2).toEqual(4);
    });
});