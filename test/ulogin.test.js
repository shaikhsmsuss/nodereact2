const chai = require('chai');
const request = require('supertest');
const app = require('../server');
const expect = chai.expect;
const User = require('../models/User')
const validUserData = require('../test/test_common')
const validLoginInput = require('../validation/login')

describe('login authentication',()=>{
  before(done => {
    done();
  });

     let returnData = validLoginInput(validUserData);   

     context("Login invalid if...", () => {
        it("Email address is invalid", () => {
            returnData = validLoginInput({
              ...validUserData,
              email: "apple"
            });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("email");
            expect(returnData.errors.email).to.equal("Email is invalid");
          });

          it("Email address is omitted", () => {
            returnData = validLoginInput({
              ...validUserData,
              email: ""
            });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("email");
            expect(returnData.errors.email).to.equal("Email field is required");
        });
        it("Password is omitted", () => {
            returnData = validLoginInput({
              ...validUserData,
              password: ""
            });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("password");
            expect(returnData.errors.password).to.equal("Password field is required");
        });
    })
    context('login details',()=>{
      it("Email address does not exists in the database", done => {
          request(app)
            .post("/api/users/login")
            .send({ ...validUserData, email: "apple@apple.com",password:'1213256' }) // sending incorrect data
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404)
            .expect(response => {
              expect(response.body).to.have.ownProperty("email");
              expect(response.body.email).to.equal("User not found");
            })
            .end(err => {
              if (err) return done(err);
              done();
            });
        });
        it("Password is incorrect", done => {
          request(app)
            .post("/api/users/login")
            .auth({ ...validUserData, password: "aaa" }) // sending incorrect data
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .expect(response => {
              expect(response.body).to.have.ownProperty("password");
              expect(response.body.password).to.equal("Password field is required");
            })
            .end(err => {
              if (err) return done(err);
              done();
            });
        });
        // it("Received bearer jwt token as response", done => {
        //   request(app)
        //     .post("/api/users/login")
        //     .send(validUserData) // sending verified user data
        //     // .set("Accept", "application/json")
        //     .set('Authorization', 'Bearer ')
        //     .expect("Content-Type", /json/)
        //     .expect(200)
        //     .expect(response => {
        //       global.JwtToken = response.body.token;
        //       expect(response.body.success).to.be.true;
        //       expect(response.body).to.have.ownProperty("token");
        //       expect(response.body.token).to.be.a("string");
        //     })
        //     .end(err => {
        //       if (err) return done(err);
        //       done();
        //     });
        // });
    });
})
  
  