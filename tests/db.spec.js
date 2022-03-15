const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

const { rebuildDB } = require('../db/seedData');
const { client, getUserById, getUserByUsername, updateUser, addProductToOrder, createOrder, updateOrderProduct, destroyOrderProduct } = require('../db');
const { getUser } = require('../db');
const { getAllOrders, getAllOrdersByUser, updateOrder, destroyOrder, getOrderById } = require('../db/models/orders');

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
    let order_product;
    let product1 = {
        id: 1,
        title: 'In Keeping Secrets Of Silent Earth: 3',
        artist: 'Coheed and Cambria',
        description: 'The album is the second installment of a tetralogy about the ongoing saga of the Keywork in The Amory Wars. The Amory Wars is also the name of the graphic novel series written by lead singer Claudio Sanchez that details the events foretold in greater detail. There are three notable singles on this album: "A Favor House Atlantic", "Blood Red Summer" and "In Keeping Secrets of Silent Earth: 3".',
        price: 10.00,
        inventoryQuantity: 13,
        imgURL: '../assets/In_Keeping_Secrets_of_Silent_Earth_3_cover.jpg'
    }
    beforeAll(async () => {
      newOrder = await createOrder({ creatorId: 3, subtotal: 1 })
      order_product = await addProductToOrder({ orderId: newOrder.id, productId: product1.id, quantity: 4, price: product1.price})
    })
    describe('addProductToOrder', () => {
      it('properly stores the price from the product being attached', async () => {
        expect(order_product).toBeTruthy();
        expect(order_product.price).toBe('10.00')
        product1.price = 12.00;
        expect(order_product.price).not.toBe(product1.price)
      })
    })
    describe('updateOrderProduct', () => {
      it('properly updates the quantity', async () => {
        const updatedOrderProduct = await updateOrderProduct({id: order_product.id, quantity: 1});
        expect(updatedOrderProduct.quantity).toEqual(1)
      })
    })
    describe('destroyOrderProduct', () => {
      it('deletes the order_product, returning only the id', async () => {
        const deletedOrderProductId = await destroyOrderProduct(order_product.id)
        expect(deletedOrderProductId).toEqual({id: order_product.id})
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
      let user5;
      beforeAll(async () => {
        const user1 = await getUserById(1);
        const user2 = await getUserById(2);
        user5 = await getUserById(5);
        user1order = await getAllOrdersByUser(user1);
        user2order = await getAllOrdersByUser(user2);
      })
      it('grabs the orders by username if they exist', async () => {
        expect(user1order).toBeTruthy();
        expect(user2order).toBeTruthy();
      })
      it('throws an error if there are no orders that belong to that user', async () => {
        try {
          noOrder = await getAllOrdersByUser(user5);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      })
    })
    describe('createOrder', () => {
      let user1;
      beforeAll(async () => {
        user1 = await getUserById(1);
      })
      it('properly creates the order', async () => {
        const order = await createOrder({ creatorId: user1.id, subtotal: 0 });
        expect(order).toBeTruthy();
      })
      it('properly adds an empty products array to the orders object before returning', async () => {
        const order = await createOrder({ creatorId: user1.id, subtotal: 0 });
        expect(order.products).toBeTruthy(); 
      })
      it('can create an order as a guest', async () => {
        const order = await createOrder({ subtotal: 0 });
        expect(order).toBeTruthy();
        console.log(order)
      })
    })
    describe('updateOrder', () => {
      let user1;
      let updatedOrder;
      beforeAll(async () => {
        user1 = await getUserById(1);
        const order = await createOrder({ creatorId: user1.id, subtotal: 0 });
        updatedOrder = await updateOrder({ id: order.id, subtotal: 10 });
      })
      it('can update the subtotal', async () => {
        expect(updatedOrder.subtotal).toEqual('10.00');
      })
      it('returns our ideal orders object, with the products appended to it', async () => {
        expect(updatedOrder.products).toBeTruthy();
      })
    })
    describe('destroyOrder', () => {
      let user1;
      let order;
      beforeAll(async () => {
        user1 = await getUserById(1);
        order = await createOrder({ creatorId: user1.id, subtotal: 0 });
      })
      it('destroys the order_products and orders info in the correct order, returning only the deleted orders Id', async () => {
        const deletedOrderId = await destroyOrder(order.id);
        expect(deletedOrderId).toEqual({id: order.id});
      })
    })
    describe('getOrderById', () => {
      let user1;
      let order;
      beforeAll(async () => {
        user1 = await getUserById(1);
        order = await createOrder({ creatorId: user1.id, subtotal: 0 });
      })
      it('grabs the order by id', async () => {
        const orderById = await getOrderById(order.id);
        expect(orderById).toBeTruthy();
      })
      it('properly appends the products onto the order object', async () => {
        const orderById = await getOrderById(order.id);
        expect(orderById.products).toBeTruthy();
      })
      it('properly appends the username as creatorName to the order object', async () => {
        const orderById = await getOrderById(order.id);
        expect(orderById.creatorName).toBeTruthy();
      })
    })
  })
})