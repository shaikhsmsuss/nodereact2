const app = require('../server');
const chai = require('chai');
const request = require('supertest');
const sinon = require("sinon");
const expect = chai.expect;
// const User = require('../models/User'); 
 const validRegisterInput = require('../validation/register');

const { purgeDB, validUserData } = require("./test_common");

const longString = "Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";


describe('user.test.js', () => {
    before(done =>{
        purgeDB();
        done();
    });
    let returnData = validRegisterInput(validUserData);

    context('Registration valid if', ()=>{
        it('all validators successfull',()=>{
            expect(returnData.isValid).to.be.true;
            expect(returnData.errors).to.be.an('object').that.is.empty;
        });

        it("Sending incorrect data to server results in 400 user not created response", done => {
            request(app)
              .post("/api/users/register")
              .send({}) // sending incorrect data
              .set("Accept", "application/json")
              .expect("Content-Type", /json/)
              .expect(400)
              .end(err => {
                if (err) return done(err);
                done();
              });
          });

         it('user record was created in the database',function(done){
            this.timeout(15000);
            request(app)
            .post('/api/users/register')
            .send(validUserData)
            .set('Accept','application/json')
            .expect('content-Type', /json/)
            .expect(200)
            .expect(response =>{
                let{ name,email,_id} = response.body;
                expect(_id).to.be.a('string');
                expect(name).to.be.a('string');
                expect(name).equal(validUserData.name);
                expect(email).to.be.a('string');
                expect(email).equal(validUserData.email);
            })
            .end(err=>{
                if(err) return done(err);
                done();
            })
          })
    });//context

    context("Registration invalid if...", () => {
        it("Name is omitted", () => {
            returnData = validRegisterInput({ ...validUserData, name: '' });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty('name');
            expect(returnData.errors.name).to.equal( 'Name field is required');
            
             
          });

          it("First Name is less than 2 characters", () => {
            returnData = validRegisterInput({ ...validUserData, name: 'a' });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty('name');
            expect(returnData.errors.name).to.equal(
              'Name must be between 2 and 30 characters'
            );
          });


        it("Email address is omitted", () => {
            returnData = validRegisterInput({ ...validUserData, email: "" });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("email");
            expect(returnData.errors.email).to.equal("Email is invalid");
          });

          it("Email address is invalid", () => {
            returnData = validRegisterInput({
              ...validUserData,
              email: "apple"
            });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("email");
            expect(returnData.errors.email).to.equal("Email is invalid");
          });
          it("Password is omitted or it is less than 6 characters", () => {
            returnData = validRegisterInput({ ...validUserData, password: '' });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty('password');
            expect(returnData.errors.password).to.equal(
              "Password must be at least 6 characters"
            );
          });
          it("Confirm Password is omitted / Password and Confirm Password do not match", () => {
            returnData = validRegisterInput({ ...validUserData, password2: "" });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("password2");
            expect(returnData.errors.password2).to.equal("Passwords must match");
          });
          it("Password is less than 6 characters", () => {
            returnData = validRegisterInput({
              ...validUserData,
              password: "abc",
              password2: "abc"
            });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("password");
            expect(returnData.errors.password).to.equal(
              "Password must be at least 6 characters"
            );
          });
          it("Password is greater than 30 characters", () => {
            returnData = validRegisterInput({
              ...validUserData,
              password: longString + "1*",
              password2: longString + "1*"
            });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("password");
            expect(returnData.errors.password).to.equal(
              "Password must be at least 6 characters"
            );
          });
          it("Email address already exists in the database", function(done) {
            this.timeout(10000);
            request(app)
              .post("/api/users/register")
              .send(validUserData) // sending correct data
              .set("Accept", "application/json")
              .expect("Content-Type", /json/)
              .expect(400)
              .expect(response => {
                expect(response.body).to.have.ownProperty("email");
                expect(response.body.email).to.equal("Email already exists");
              })
              .end(err => {
                if (err) return done(err);
                done();
              });
          });
    })//context 
});//describe  
 
  
  
  