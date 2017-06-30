const assert = require('assert')
const request = require('supertest')
const should = require('should')

const server = require('../../../app')

describe('controllers', function() {
  describe('kv', function() {
    describe('should 400 if key invalid', function() {
      let invalidKey = "!!!"

      it('DELETE', function(done) {
        request(server)
          .del(`/kv/${invalidKey}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => done(err || undefined))
      })

      it('POST', function(done) {
        request(server)
          .post(`/kv/${invalidKey}`)
          .type('json')
          .send({VALUE: 1})
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => done(err || undefined))
      })

      it('GET', function(done) {
        // Test GET after POST, why?
        request(server)
          .get(`/kv/${invalidKey}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => done(err || undefined))
      })

    }) // invalid key

    describe('mixed operation', function() {
      let key = 'abcdeabcdeabcdeabcde'
      let value = 'bcdeabcdeabcdeabcde'
      
      it('get, post, delete, get', function(done) {
        let uri = `/kv/${key}`
        let agent = request.agent(server)
        
        agent
          .get(uri).expect(404)
          .then(() => 
            agent.post(uri).type('json').send({VALUE: value})
              .expect(200))
          .then(() => 
            agent.get(uri).expect(200))
              .then(res => assert(res.body.VALUE, value))
          .then(() => agent.del(uri).expect(200))
          .then(() => agent.get(uri).expect(404))
          .then(() => done(), err => done(err))
      });
    }); // mixed operation
  }); // kv
}); // controllers
