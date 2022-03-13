const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

const { rebuildDB } = require('../db/seedData');
const { client, getUserById, getUserByUsername, updateUser } = require('../db');
const { getUser } = require('../db');

describe('Database', () => {
  beforeAll(async () => {
    await rebuildDB();
  })
  afterAll(async () => {
    await client.end();
  })
  // user db testing
  describe('Users', () => {
    let userCredentials = {
      id: 1,
      username: 'jenny',
      password: 'jen99',
      email: 'jenny99@mail.com'
    };
    describe('getUser({ username, password })', () => {
      let verifiedUser;
      beforeAll(async () => {
        verifiedUser = await getUser(userCredentials);
      })
      it('Checks the unincrypted password against the hashed password in the database, returning the user only if the bcrypt.compare returns truthy', async () => {
        const unVerifiedUser = await getUser({username: userCredentials.username, password: "supersecurepassword"});
        expect(verifiedUser).toBeTruthy();
        expect(verifiedUser.username).toBe(userCredentials.username);
        expect(unVerifiedUser).toBeFalsy();
      })
      it('Does NOT return the password', async () => {
        expect(verifiedUser.password).toBeFalsy();
      })
    })
    describe('getUserById', () => {
      let user;
      beforeAll(async () => {
        user = await getUserById(userCredentials.id)
      })
      it('Gets a user using a user Id', async () => {
        expect(user).toBeTruthy();
        expect(user.id).toBe(userCredentials.id);
      })
      it('Does NOT return the password', async () => {
        expect(user.password).toBeFalsy();
      })
    })
    describe('getUserByUsername', () => {
      let user;
      beforeAll(async () => {
        user = await getUserByUsername(userCredentials.username)
      })
      it('Gets a user using a username', async () => {
        expect(user).toBeTruthy();
        expect(user.username).toBe(userCredentials.username);
      })
      it('Does NOT return the password', async () => {
        expect(user.password).toBeFalsy();
      })
    })
    describe('updateUser', () => {
      let user;
      let updatedUserFields;
      let updatedUserWithoutPassword;
      beforeAll(async () => {
        updatedUserFields = {
          id: 1,
          username: 'jennifer',
          password: 'jenny99',
          email: 'jenny44@mail.com',
          isAdmin: false
        }
        updatedUserWithoutPassword = {
          id: 1,
          username: 'jennifer',
          email: 'jenny44@mail.com',
          isAdmin: false
        }
        user = await updateUser(updatedUserFields)
      })
      it('Updates the username, password, and email without changing the ID. returns updated user WITHOUT the password', async () => {
        expect(user).toEqual(updatedUserWithoutPassword);
      })
      it('properly hashes the new updated password before storing it in the table', async () => {
        const hashedCorrectly = await getUser(updatedUserFields);
        expect(hashedCorrectly).toBeTruthy();
      })
    })
  })
})