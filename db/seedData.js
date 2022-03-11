const {
  client,
  createOrder,
  // declare your model imports here
  // for example, User
} = require("./");

// drop tables in correct order
async function dropTables() {
  try {
    console.log("Dropping All Tables...");
    client.query(`
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS users;      
      DROP TABLE IF EXISTS products;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error while dropping tables!");
    throw error;
  }
}
// build tables in correct order
async function buildTables() {
  try {
    console.log("Starting to build tables...");
    await client.query(`
        CREATE TABLE products(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) UNIQUE NOT NULL,
          description VARCHAR(255) NOT NULL,
          price DECIMAL(38, 2) NOT NULL,
          "inventoryQuantity" INTEGER NOT NULL,
          "imgURL" VARCHAR(255)
        );

        CREATE TABLE users(
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL
        );

        CREATE TABLE orders(
          id SERIAL PRIMARY KEY,
          "creatorId" INTEGER REFERENCES users(id),
          name VARCHAR(255) UNIQUE NOT NULL,
          subtotal DECIMAL(38,2) 
        );
      `);

    console.log("Finished constructing tables");
  } catch (error) {
    console.error(error);
    throw "Error constructing tables!";
  }
}
async function createInitialOrders() {
  try {
    console.log("starting to create orders...");

    const ordersToCreate = [
      {
        creatorId: 2,
        name: "Hungry Hippy",
        subtotal: 11.11,
      },
      {
        creatorId: 1,
        name: "Campy Carnivore",
        subtotal: 19.55,
      },
      {
        creatorId: 3,
        name: "Single Mom",
        subtotal: 20.22,
      },
      {
        creatorId: 2,
        name: "Hungry Hippy",
        subtotal: 21.1,
      },
    ];
    const orders = await Promise.all(
      ordersToCreate.map((order) => createOrder(order))
    );
    console.log("Orders Created: ", orders);
    console.log("Finished creating orders");
  } catch (error) {
    throw error;
  }
}
// async function populateInitialData() {
//   try {
//     // create useful starting data by leveraging your
//     // Model.method() adapters to seed your db, for example:
//     // const user1 = await User.createUser({ ...user info goes here... })
//   } catch (error) {
//     throw error;
//   }
// }
async function rebuildDB() {
  try {
    console.log("buildingdb");
    client.connect();
    await dropTables();
    await buildTables();
    await createInitialOrders();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

module.exports = {
  rebuildDB,
};
