const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../server');

const{
    stopIfNotTestEnv,
  getCurrentNodeEnv,
  getCurrentMongo,
  getTestMongo,
  canConnectToDB,
  purgeDB

} = require('../test/test_common');

const currentEnv = getCurrentNodeEnv();

describe('testing environment requirements',()=>{
    before(done=>{
        canConnectToDB(getTestMongo()).catch(err => {
            done(new Error("DB Server not available! Aborting!"));
          });
        stopIfNotTestEnv(currentEnv);
        done();
    });
    after(done => {
        purgeDB().then(() => {
          done();
        });
    });
    context("Running tests if...", () => {
        it("current NODE_ENV is `test`", () => {
          expect(currentEnv).to.be.equal("test");
        });
    
        it("test environment specific MongoDB URI is loaded", () => {
          expect(getCurrentMongo()).to.be.equal(getTestMongo());
        });
    });
    it("MongoDB server is connected", async function() {
      this.timeout(10000);
      const DBConnected = await canConnectToDB(getTestMongo());
      if (!DBConnected) {
        throw new Error("Can't connect to Database! Aborting!");
      }
      expect(DBConnected).to.be.true;
    });
    
    
});
