const mongoose = require('mongoose');
const User = require('../models/User');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();


chai.use(chaiHttp);

describe('user',()=>{
    beforeEach((done)=>{
        User.remove({},(err)=>{
            done();
        });
    });
    describe('/POST user',()=>{
        it('should register the user',(done)=>{
            let user = {
                name:"shaikh",
                email:"shaikh.shoeb96@gmail.com",
               
            }
            chai.request(server)
                .post(api/users/register)
                .send(user)
                .end((errors,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('password');
                    res.body.errors.pages.should.have.property('kind').eql('required')
                    done();

                });
        });
    });
})