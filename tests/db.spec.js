const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

const { rebuildDB } = require('../db/seedData');
const { client, getUserById, getUserByUsername, updateUser, addProductToOrder, createOrder } = require('../db');
const { getUser } = require('../db');
const { getAllOrders, getAllOrdersByUser } = require('../db/models/orders');

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
        expect(verifiedUser).toBeTruthy();
        expect(verifiedUser.username).toBe(userCredentials.username);
      })
      it('Throws an error if the password is incorrect', async () => {
        let errResponse;
        try {
          const unVerifiedUser = await getUser({username: userCredentials.username, password: "supersecurepassword"});
        } catch (error) {
          errResponse = error;
        }
        expect(errResponse).toBeTruthy();
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
  describe('Order_Products', () => {
    let newOrder;
    let product1 = {
        id: 1,
        title: 'In Keeping Secrets Of Silent Earth: 3',
        artist: 'Coheed and Cambria',
        description: 'The album is the second installment of a tetralogy about the ongoing saga of the Keywork in The Amory Wars. The Amory Wars is also the name of the graphic novel series written by lead singer Claudio Sanchez that details the events foretold in greater detail. There are three notable singles on this album: "A Favor House Atlantic", "Blood Red Summer" and "In Keeping Secrets of Silent Earth: 3".',
        price: 10.00,
        inventoryQuantity: 13,
        imgURL: '../assets/In_Keeping_Secrets_of_Silent_Earth_3_cover.jpg'
    }
    let product2 = {
        id: 2,
        title: 'always EP',
        artist: 'Keshi',
        description: '"Always", stylized as "always", is the fourth extended play (EP) by American singer-songwriter keshi. It was released through Island Records on October 23rd, 2020.',
        price: 15.99,
        inventoryQuantity: 20,
        imgURL: '../assets/Always_EP_Keshi.jpg'
    }
    describe('addProductToOrder', () => {
      beforeAll(async () => {
        newOrder = await createOrder({ creatorId: 3, subtotal: 1 })
      })
      it('properly stores the price from the product being attached', async () => {
        let order_product = await addProductToOrder({ orderId: newOrder.id, productId: product1.id, quantity: 4, price: product1.price})
        expect(order_product).toBeTruthy();
        expect(order_product.price).toBe(product1.price)
        product1.price = 12.00;
        expect(order_product.price).not.toBe(product1.price)
      })
    })
  })
  describe('Orders', () => {
    // let expectedOrder = {
    //   id: 1,
    //   subtotal: 
    // }
    describe('getAllOrders', () => {
      let orders;
      beforeAll(async () => {
        orders = await getAllOrders();
      })
      it('properly grabs all orders', async () => {
        expect(orders).toBeTruthy();
      })
      it('attaches the products to the orders object', () => {
        expect(orders[0].products).toBeTruthy();
        expect(orders[3].products).toBeTruthy();
      })
    })
    describe('getAllOrdersByUser', () => {
      let user1order;
      let user2order;
      let noOrder;
      let noUser;
      beforeAll(async () => {
        const user1 = await getUserById(1);
        const user2 = await getUserById(2);
        user1order = await getAllOrdersByUser(user1);
        user2order = await getAllOrdersByUser(user2);
      })
      it('grabs the orders by username if they exist', async () => {
        expect(user1order).toBeTruthy();
        expect(user2order).toBeTruthy();
      })
    })
  })
})