const chai = require('chai')
const sinon = require('sinon')
const User = require('../models/user');
// importing the function which is needed to be tested 
const getAllUsers = require('../controllers/userController');
const expect = chai;

describe('getAllUsers', () => {
    let findAllStub;
    let req;
    let res;

    beforeEach(() => {
        findAllStub = sinon.stub(User, 'findAll');
        req = {};
        res = {
          send: sinon.stub(),
          status: sinon.stub().returnsThis(),
          json: sinon.stub(),
        };
      });
      afterEach(() => {
        findAllStub.restore();
      });
    
      it('should send all users when successful', async () => {
        const fakeUsers = [{ name: 'User 1' }, { name: 'User 2' }];
        findAllStub.resolves(fakeUsers);
    
        await getAllUsers(req, res);
    
        expect(findAllStub.calledOnce).to.be.true;
        expect(res.send.calledWith(fakeUsers)).to.be.true;
      });
    
      it('should handle UnauthorizedError', async () => {
        const unauthorizedError = new Error('UnauthorizedError');
        unauthorizedError.name = 'UnauthorizedError';
        findAllStub.rejects(unauthorizedError);
    
        await getAllUsers(req, res);
    
        expect(findAllStub.calledOnce).to.be.true;
        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ message: 'Unauthorized' })).to.be.true;
      });
    
      it('should handle other errors', async () => {
        const errorMessage = 'Some error message';
        const error = new Error(errorMessage);
        findAllStub.rejects(error);
    
        await getAllUsers(req, res);
    
        expect(findAllStub.calledOnce).to.be.true;
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: errorMessage })).to.be.true;
      });
});