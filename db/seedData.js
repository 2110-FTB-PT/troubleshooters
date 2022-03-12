const {
  client,
  createOrder,
  getOrdersWithoutProducts,
  getProductsOnly,
  addProductToOrder,
  createUser,
  createProduct
  // declare your model imports here
  // for example, User
} = require("./");

// drop tables in correct order
async function dropTables() {
  try {
    console.log("Dropping All Tables...");
    client.query(`
      DROP TABLE IF EXISTS order_products;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS users; 
      DROP TABLE IF EXISTS categories;     
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
          artist VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(38, 2) NOT NULL,
          "inventoryQuantity" INTEGER NOT NULL,
          "imgURL" VARCHAR(255)
        );
        
        CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL
        );

        CREATE TABLE users(
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          "isAdmin" BOOLEAN DEFAULT false
        );

        CREATE TABLE orders(
          id SERIAL PRIMARY KEY,
          "creatorId" INTEGER REFERENCES users(id),
          name VARCHAR(255) NOT NULL,
          subtotal DECIMAL(38,2) 
        );

        CREATE TABLE order_products(
          id SERIAL PRIMARY KEY,
          "orderId" INTEGER REFERENCES orders(id),
          "productId" INTEGER REFERENCES products(id),
          quantity INTEGER,	
          price DECIMAL(38,2),
          UNIQUE("orderId", "productId")
        );
      `);

    console.log("Finished constructing tables");
  } catch (error) {
    console.error(error);
    throw "Error constructing tables!";
  }
}

async function createInitialProducts() {
  try {
    console.log('Starting to create products...');

    const productsToCreate = [
      {
        title: 'In Keeping Secrets Of Silent Earth: 3',
        artist: 'Coheed and Cambria',
        description: 'The album is the second installment of a tetralogy about the ongoing saga of the Keywork in The Amory Wars. The Amory Wars is also the name of the graphic novel series written by lead singer Claudio Sanchez that details the events foretold in greater detail. There are three notable singles on this album: "A Favor House Atlantic", "Blood Red Summer" and "In Keeping Secrets of Silent Earth: 3".',
        price: 10.00,
        inventoryQuantity: 13,
        imgURL: '../assets/In_Keeping_Secrets_of_Silent_Earth_3_cover.jpg'
      },
      {
        title: 'always EP',
        artist: 'Keshi',
        description: '"Always", stylized as "always", is the fourth extended play (EP) by American singer-songwriter keshi. It was released through Island Records on October 23rd, 2020.',
        price: 15.99,
        inventoryQuantity: 20,
        imgURL: '../assets/Always_EP_Keshi.jpg'
      },
      {
        title: 'My Way',
        artist: 'Frank Sinatra',
        description: `My Way is an album by American singer Frank Sinatra, released in 1969 on his own Reprise label. The album is mainly a collection of then-contemporary pop songs, such as Simon and Garfunkel's "Mrs. Robinson", and The Beatles' "Yesterday", French songs such as "If You Go Away", and the anthemic title song "My Way", which effectively became Sinatra's theme song in this stage of his career.`,
        price: 14.99,
        inventoryQuantity: 50,
        imgURL: '../assets/SinatraMyWay.jpg'
      },
      {
        title: 'Live at the Apollo',
        artist: 'James Brown',
        description: `Live at the Apollo is the first live album by James Brown and the Famous Flames, recorded at the Apollo Theater in Harlem and released in 1963 by King Records.
        The album is included in Robert Christgau's "Basic Record Library" of 1950s and 1960s recordings, published in Christgau's Record Guide: Rock Albums of the Seventies (1981). In 2000 it was voted number 248 in Colin Larkin's All Time Top 1000 Albums. In 2003, the album was ranked number 25 on Rolling Stone magazine's list of The 500 Greatest Albums of All Time, maintaining the rating in a 2012 revised list, and re-ranking at number 65 in a 2020 reboot of the list. In 2004, it was one of 50 recordings chosen that year by the Library of Congress to be added to the National Recording Registry.`,
        price: 12.99,
        inventoryQuantity: 12,
        imgURL: '../assets/James_Brown-Live_at_the_Apollo_(album_cover).jpg'
      },
      {
        title: 'Let It Bleed',
        artist: 'The Rolling Stones',
        description: `Let It Bleed is the 8th British and 10th American studio album by the English rock band the Rolling Stones, released on 28 November 1969 London Records in the United States and shortly thereafter by Decca Records in the United Kingdom. Released shortly after the band's 1969 American Tour, it is the follow-up to 1968's Beggars Banquet. As with Beggars Banquet, the album marks a return to the group's more blues-sound approach that was prominent in the pre-Aftermath period of their career. Additional sounds on the album draw influence from gospel, country blues and country rock.`,
        price: 12.99,
        inventoryQuantity: 14,
        imgURL: '../assets/LetitbleedRS.jpg'
      },
      {
        title: `All My Friends We're Glorious`,
        artist: 'Panic! at the Disco',
        description: `All My Friends We're Glorious (or All My Friends We're Glorious: Death of a Bachelor Tour Live) is the fourth live album by Panic! at the Disco and their first as a solo project, fronted by Brendon Urie. It was released on December 15, 2017, in digital versions and as a limited edition double vinyl LP, and documents the band's 2017 Death of a Bachelor Tour concert tour following the release of their fifth album, Death of a Bachelor.`,
        price: 15.99,
        inventoryQuantity: 6,
        imgURL: '../assets/Panic_AllMyFriends.jpg'
      },
      {
        title: 'Innervisions',
        artist: 'Stevie Wonder',
        description: `Innervisions is the sixteenth studio album by American singer, songwriter and musician Stevie Wonder, released August 3, 1973, on the Tamla label for Motown Records, a landmark recording of his "classic period". It is also regarded as Wonder's transition from Little Stevie Wonder and romantic ballads to a more musically mature, conscious and grown-up artist. With Wonder being the first major artist to experiment with the revolutionary TONTO (The Original New Timbral Orchestra) synth, developed by Malcolm Cecil and Robert Margouleff, and the ARP synthesizer on a large scale, Innervisions became hugely influential on the subsequent future of commercial soul and black music.`,
        price: 10.99,
        inventoryQuantity: 15,
        imgURL: '../assets/Steviewonder_innervisions.jpg'
      },
    ]
    const products = await Promise.all(
      productsToCreate.map((product) => createProduct(product))
    );
    console.log("Products Created: ", products);
    console.log("Finished creating products");
  } catch (error) {
    throw error;
  }
}

async function createInitialOrders() {
  try {
    console.log("starting to create orders...");

    const ordersToCreate = [
      {
        creatorId: 2,
        name: "Steve",
        subtotal: 11.11,
      },
      {
        creatorId: 1,
        name: "albert",
        subtotal: 19.55,
      },
      {
        creatorId: 3,
        name: "Howard",
        subtotal: 20.22,
      },
      {
        creatorId: 2,
        name: "Steve",
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

async function createInitialOrderProducts() {
  try {
    console.log("Starting to create order_products...");
    const [orderOne, orderTwo, orderThree, orderFour] =
      await getOrdersWithoutProducts();
    const [product1, product2, product3, product4, product5, product6, product7] =
      await getProductsOnly();
    console.log(orderOne, orderFour);
    const orderProductsToCreate = [
      {
        orderId: orderOne.id,
        productId: product1.id,
        quantity: 7,
        price: 11,
      },
      {
        orderId: orderOne.id,
        productId: product2.id,
        quantity: 3,
        price: 16,
      },
      {
        orderId: orderTwo.id,
        productId: product3.id,
        quantity: 6,
        price: 22,
      },
      {
        orderId: orderTwo.id,
        productId: product4.id,
        quantity: 10,
        price: 7,
      },
      {
        orderId: orderThree.id,
        productId: product5.id,
        quantity: 2,
        price: 10,
      },
      {
        orderId: orderThree.id,
        productId: product6.id,
        quantity: 1,
        price: 100,
      },
      {
        orderId: orderFour.id,
        productId: product7.id,
        quantity: 10,
        price: 7,
      },
      {
        orderId: orderFour.id,
        productId: product1.id,
        quantity: 4,
        price: 4,
      },
      {
        orderId: orderFour.id,
        productId: product2.id,
        quantity: 10,
        price: 15,
      },
    ];
    const orderProducts = await Promise.all(
      orderProductsToCreate.map(addProductToOrder)
    );
    console.log("order_products created: ", orderProducts);
    console.log("Finished creating order_products!");
  } catch (error) {
    throw error;
  }
}

// async function populateInitialData() {
//   try {
//     // create useful starting data by leveraging your
async function createInitialUsers() {
  try {
    console.log("Starting to create users...");
//createUser({ username, password }: { username: any; password: any; }): any
    const usersToCreate = [
      {
      username: 'albert',
      password: 'bertie99',
      email: 'albert.bertie99@mail.com'
    },
    {
      username: 'jenny',
      password: 'jen99',
      email: 'jenny99@mail.com'
    },
    {
      username: 'Howard',
      password: 'Howie123',
      email: 'howard123@mail.com'
    },
    {
      username: 'Steve',
      password: 'Stevie99',
      email: 'steve99@mail.com'
    },
  ]
  const users = await Promise.all(
    usersToCreate.map((users) => createUser(users))
  )
    console.log("Users", users)
    console.log("Finished creating users.");
  } catch(error){
    console.error("Error creating users");
    throw error;
  }
}
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
    await createInitialUsers();
    await createInitialProducts();
    await createInitialOrders();
    await createInitialOrderProducts();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

module.exports = {
  rebuildDB
}
