const assert = require('assert')
const request = require('supertest')
const should = require('should')

const server = require('../../../app')

describe('controllers', function() {
  describe('encrypt', function() {
    describe('should 400 with invalid hex input', function() {
      it('input out-of-range', function(done) {
        request(server)
          .post(`/encrypt`)
          .type('json')
          .send({plaintext: 'zzzz'})
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => done(err || undefined))
      })
    }) // invalid hex input

    describe('example', function() {
      it('encrypts `deadbeef`', function(done) {
        this.timeout(5000)
        request(server)
          .post(`/encrypt`)
          .type('json')
          .send({plaintext: 'deadbeef'})
          .expect('Content-Type', /json/)
          .expect(200)
          .then(res => assert(res.body.ciphertext, 'c3cc3debd65d2473930406f810a6c482'))
          .then(() => done(), err => done(err))
      }) 
    }) // example
  }); // kv
}); // controllers
