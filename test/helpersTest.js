var assert = require('assert');
const {userLookUpWithEmail} =require('../helpers')


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "test@example.com",
    password: "ez123"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('userLookUpWithEmail', function() {
  it('should return a user with valid email', function() {
    const user = userLookUpWithEmail("test@example.com", users)
    const expectedOutput = "userRandomID";
    assert.strictEqual(expectedOutput, "userRandomID")
  });
});
