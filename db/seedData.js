const {
    client,
    // declare your model imports here
    // for example, User
  } = require('./');
  
  async function buildTables() {
    try {
      client.connect();
  
      // drop tables in correct order
      console.log('Dropping All Tables...');

      await client.query(`
        DROP TABLE IF EXISTS products; 
      `);
  
      // build tables in correct order
      console.log('Starting to build tables...');

      await client.query(`
        CREATE TABLE products(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) UNIQUE NOT NULL,
          description VARCHAR(255) NOT NULL,
          price DECIMAL(38, 2) NOT NULL,
          "inventoryQuantity" INTEGER NOT NULL,
          "imgURL" VARCHAR(255)
        );
      `);
    } catch (error) {
      throw error;
    }
  }
  
  async function populateInitialData() {
    try {
      // create useful starting data by leveraging your
      // Model.method() adapters to seed your db, for example:
      // const user1 = await User.createUser({ ...user info goes here... })
    } catch (error) {
      throw error;
    }
  }
  
  buildTables()
    .then(populateInitialData)
    .catch(console.error)
    .finally(() => client.end());