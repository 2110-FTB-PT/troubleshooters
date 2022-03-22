const {
  client,
  createOrder,
  createReview,
  getOrdersWithoutProducts,
  getProductsOnly,
  addProductToOrder,
  createUser,
  createProduct,
  getAllCategories,
  createCategory
  // declare your model imports here
  // for example, User
} = require("./");
const { addCategoryToProduct } = require("./models/product_categories");

// drop tables in correct order
async function dropTables() {
  try {
    console.log("Dropping All Tables...");
    client.query(`
      DROP TABLE IF EXISTS order_products;
      DROP TABLE IF EXISTS product_categories;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS reviews;
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

        CREATE TABLE reviews(
          id SERIAL PRIMARY KEY,
          "creatorId" INTEGER REFERENCES users(id),
          "productId" INTEGER REFERENCES products(id),
          description VARCHAR(255) NOT NULL
        );

        CREATE TABLE orders(
          id SERIAL PRIMARY KEY,
          "creatorId" INTEGER REFERENCES users(id),
          subtotal DECIMAL(38,2) NOT NULL
        );

        CREATE TABLE product_categories(
          id SERIAL PRIMARY KEY,
          "productId" INTEGER REFERENCES products(id),
          "categoryId" INTEGER REFERENCES categories(id),
          UNIQUE("productId", "categoryId")
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
        imgURL: 'In_Keeping_Secrets_of_Silent_Earth_3_cover.jpg'
      },
      {
        title: 'always EP',
        artist: 'Keshi',
        description: '"Always", stylized as "always", is the fourth extended play (EP) by American singer-songwriter keshi. It was released through Island Records on October 23rd, 2020.',
        price: 15.99,
        inventoryQuantity: 20,
        imgURL: 'Always_EP_Keshi.jpg'
      },
      {
        title: 'My Way',
        artist: 'Frank Sinatra',
        description: `My Way is an album by American singer Frank Sinatra, released in 1969 on his own Reprise label. The album is mainly a collection of then-contemporary pop songs, such as Simon and Garfunkel's "Mrs. Robinson", and The Beatles' "Yesterday", French songs such as "If You Go Away", and the anthemic title song "My Way", which effectively became Sinatra's theme song in this stage of his career.`,
        price: 14.99,
        inventoryQuantity: 50,
        imgURL: 'SinatraMyWay.jpg'
      },
      {
        title: 'Live at the Apollo',
        artist: 'James Brown',
        description: `Live at the Apollo is the first live album by James Brown and the Famous Flames, recorded at the Apollo Theater in Harlem and released in 1963 by King Records.
        The album is included in Robert Christgau's "Basic Record Library" of 1950s and 1960s recordings, published in Christgau's Record Guide: Rock Albums of the Seventies (1981). In 2000 it was voted number 248 in Colin Larkin's All Time Top 1000 Albums. In 2003, the album was ranked number 25 on Rolling Stone magazine's list of The 500 Greatest Albums of All Time, maintaining the rating in a 2012 revised list, and re-ranking at number 65 in a 2020 reboot of the list. In 2004, it was one of 50 recordings chosen that year by the Library of Congress to be added to the National Recording Registry.`,
        price: 12.99,
        inventoryQuantity: 12,
        imgURL: 'James_Brown-Live_at_the_Apollo_(album_cover).jpg'
      },
      {
        title: 'Let It Bleed',
        artist: 'The Rolling Stones',
        description: `Let It Bleed is the 8th British and 10th American studio album by the English rock band the Rolling Stones, released on 28 November 1969 London Records in the United States and shortly thereafter by Decca Records in the United Kingdom. Released shortly after the band's 1969 American Tour, it is the follow-up to 1968's Beggars Banquet. As with Beggars Banquet, the album marks a return to the group's more blues-sound approach that was prominent in the pre-Aftermath period of their career. Additional sounds on the album draw influence from gospel, country blues and country rock.`,
        price: 12.99,
        inventoryQuantity: 14,
        imgURL: 'LetitbleedRS.jpg'
      },
      {
        title: `All My Friends We're Glorious`,
        artist: 'Panic! at the Disco',
        description: `All My Friends We're Glorious (or All My Friends We're Glorious: Death of a Bachelor Tour Live) is the fourth live album by Panic! at the Disco and their first as a solo project, fronted by Brendon Urie. It was released on December 15, 2017, in digital versions and as a limited edition double vinyl LP, and documents the band's 2017 Death of a Bachelor Tour concert tour following the release of their fifth album, Death of a Bachelor.`,
        price: 15.99,
        inventoryQuantity: 6,
        imgURL: 'Panic_AllMyFriends.jpg'
      },
      {
        title: 'Innervisions',
        artist: 'Stevie Wonder',
        description: `Innervisions is the sixteenth studio album by American singer, songwriter and musician Stevie Wonder, released August 3, 1973, on the Tamla label for Motown Records, a landmark recording of his "classic period". It is also regarded as Wonder's transition from Little Stevie Wonder and romantic ballads to a more musically mature, conscious and grown-up artist. With Wonder being the first major artist to experiment with the revolutionary TONTO (The Original New Timbral Orchestra) synth, developed by Malcolm Cecil and Robert Margouleff, and the ARP synthesizer on a large scale, Innervisions became hugely influential on the subsequent future of commercial soul and black music.`,
        price: 10.99,
        inventoryQuantity: 15,
        imgURL: 'Steviewonder_innervisions.jpg'
      },
      {
        title: 'Nevermind',
        artist: 'Nirvana',
        description: `Nevermind is the second studio album by the American rock band Nirvana, released on September 24, 1991, by DGC Records. It was Nirvana's first release on a major label and the first to feature drummer Dave Grohl. Produced by Butch Vig, Nevermind features a more polished, radio-friendly sound than the band's prior work. Recording took place at Sound City Studios in Van Nuys, California, and Smart Studios in Madison, Wisconsin in May and June 1991, with mastering being completed in August of that year at The Mastering Lab in Hollywood, California.`,
        price: 14.99,
        inventoryQuantity: 10,
        imgURL: 'NirvanaNevermindalbumcover.jpg'
      },
      {
        title: 'Purple Rain',
        artist: 'Prince and the Revolution',
        description: `Purple Rain is the sixth studio album by American recording artist Prince, released on June 25, 1984, by Warner Bros. Records and the soundtrack to the 1984 film of the same name. Purple Rain was musically denser than Prince's previous albums, emphasizing full band performances, and multiple layers of guitars, keyboards, electronic synthesizer effects, drum machines, and other instruments.`,
        price: 13.99,
        inventoryQuantity: 9,
        imgURL: 'Princepurplerain.jpg'
      },
      {
        title: 'Thriller',
        artist: 'Michael Jackson',
        description: `Thriller is the sixth studio album by American singer and songwriter Michael Jackson, released on November 30, 1982, by Epic Records. It was produced by Quincy Jones, who had previously worked with Jackson on his 1979 album Off the Wall. Jackson wanted to create an album where "every song was a killer". With the ongoing backlash against disco, he moved in a new musical direction, resulting in a mix of pop, post-disco, rock, funk, and R&B sounds. Thriller foreshadows the contradictory themes of Jackson's personal life, as he began using a motif of paranoia and darker themes. The album features a single guest appearance, with Paul McCartney becoming the first artist to be featured on one of Jackson's albums. Recording took place from April to November 1982 at Westlake Recording Studios in Los Angeles, with a production budget of $750,000.`,
        price: 14.99,
        inventoryQuantity: 20,
        imgURL: 'Michael_Jackson_-_Thriller.png'
      },
      {
        title: 'Cold Spring Harbor',
        artist: 'Billy Joel',
        description: `Cold Spring Harbor is the debut studio album by American recording artist Billy Joel, released on November 1, 1971, by Family Productions.`,
        price: 10.99,
        inventoryQuantity: 10,
        imgURL: 'Cold_Spring_Harbor_album_cover.jpg'
      },
      {
        title: 'Pet Sounds',
        artist: 'The Beach Boys',
        description: `Pet Sounds is the eleventh studio album by the American rock band the Beach Boys, released May 16, 1966 on Capitol Records. It was initially met with a lukewarm critical and commercial response in the U.S., peaking at number 10 on Billboard's Top LPs chart. In the UK, the album was lauded by critics and reached number 2 on the Top 40 Albums Chart, remaining in the top ten for six months. Promoted there as "the most progressive pop album ever", Pet Sounds garnered recognition for its ambitious production, sophisticated music, and emotional lyrical content. It is considered to be among the greatest and most influential albums in music history.`,
        price: 11.99,
        inventoryQuantity: 20,
        imgURL: 'PetSoundsCover.jpg'
      },
      {
        title: 'The Dark Side of the Moon',
        artist: 'Pink Floyd',
        description: 'The Dark Side of the Moon is the eighth studio album by the English rock band Pink Floyd, released on 1 March 1973 by Harvest Records. Primarily developed during live performances, the band premiered an early version of the suite several months before recording began. The record was conceived as an album that focused on the pressures faced by the band during their arduous lifestyle, and dealing with the apparent mental health problems suffered by former band member Syd Barrett, who departed the group in 1968. New material was recorded in two sessions in 1972 and 1973 at Abbey Road Studios in London.',
        price: 12.99,
        inventoryQuantity: 25,
        imgURL: 'Dark_Side_of_the_Moon.png'
      },
      {
        title: 'Ready to Die',
        artist: 'Notorious B.I.G',
        description: `Ready to Die is the debut studio album by American rapper The Notorious B.I.G., released on September 13, 1994, by Bad Boy Records and Arista Records. The album features productions by Bad Boy founder Sean "Puffy" Combs, Easy Mo Bee, Chucky Thompson, DJ Premier, and Lord Finesse, among others. It was recorded from 1993 to 1994 at The Hit Factory and D&D Studios in New York City. The partly autobiographical album tells the story of the rapper's experiences as a young criminal, and was the only studio album released during his lifetime, as he was murdered sixteen days before the release of his second album Life After Death in 1997.`,
        price: 12.99,
        inventoryQuantity: 35,
        imgURL: 'Ready_To_Die.jpg'
      },
      {
        title: 'THe Chronic',
        artist: 'Dr. Dre',
        description: `The Chronic is the debut studio album by American hip hop producer and rapper Dr. Dre. It was released on December 15, 1992, by his own record label Death Row Records and distributed by Interscope Records. Recording sessions for the album took place in June 1992 at Death Row Studios in Los Angeles and at Bernie Grundman Mastering in Hollywood. The album is named after a slang term for high-grade cannabis, and its cover is an homage to Zig-Zag rolling papers. It was Dr. Dre's first solo album after he had departed from hip hop group N.W.A and its label Ruthless Records over a financial dispute.`,
        price: 15.99,
        inventoryQuantity: 15,
        imgURL: 'Dr.DreTheChronic.jpg'
      },
      {
        title: 'Legend',
        artist: 'Bob Marley and the Wailers',
        description: `Legend is a compilation album by Bob Marley and the Wailers. It was released in May 1984 by Island Records. It is a greatest hits collection of singles in its original vinyl format and is the best-selling reggae album of all-time, with over 12 million sold in the US, over 3.3 million in the UK (where it is the seventeenth best-selling album) and an estimated 25 million copies sold globally. In 2003, the album was ranked number 46 in Rolling Stone magazine's list of the "500 Greatest Albums of All Time", maintaining the ranking in a 2012 revised list, but dropping to number 48 in the 2020 revised list.`,
        price: 12.99,
        inventoryQuantity: 34,
        imgURL: 'BobMarley-Legend.jpg'
      },
      {
        title: 'Abbey Road',
        artist: 'The Beatles',
        description: `Abbey Road is the eleventh studio album by the English rock band the Beatles, released on 26 September 1969 by Apple Records. Named after Abbey Road, London, the location of EMI Studios, the cover features the group walking across the street's zebra crossing, an image that became one of the most famous and imitated in popular music. The album's initially mixed reviews were contrasted by its immediate commercial success, topping record charts in the UK and US. The single "Something" / "Come Together" was released in October and topped the US charts.`,
        price: 14.99,
        inventoryQuantity: 45,
        imgURL: 'Beatles_-_Abbey_Road.jpg'
      },
      {
        title: 'Back to Black',
        artist: 'Amy Winehouse',
        description: 'Back to Black is the second and final studio album by English singer and songwriter Amy Winehouse, released on 27 October 2006 by Island Records. Winehouse predominantly based the album on her tumultuous relationship with then-ex-boyfriend and future husband Blake Fielder-Civil, who temporarily left her to pursue his previous ex-girlfriend. Their short-lived separation spurred her to create an album that explores themes of guilt, grief, infidelity, heartbreak and trauma in a relationship.',
        price: 12.99,
        inventoryQuantity: 36,
        imgURL: 'Amy_Winehouse_-_Back_to_Black_(album).png'
      },
      {
        title: 'Songs in the Key of Life',
        artist: 'Stevie Wonder',
        description: `Songs in the Key of Life is the eighteenth studio album by American singer, songwriter and musician Stevie Wonder. It was released on September 28, 1976, by Tamla Records, a division of Motown. The double album has been regarded by music journalists as the culmination of Wonder's "classic period" of recording. The album was recorded primarily at Crystal Sound studio in Hollywood, with some sessions recorded at the Record Plant in Hollywood, the Record Plant in Sausalito, and The Hit Factory in New York City; final mixing was conducted at Crystal Sound.`,
        price: 14.99,
        inventoryQuantity: 12,
        imgURL: 'Songs_in_the_key_of_life.jpg'
      },
      {
        title: 'Blonde on Blonde',
        artist: 'Bob Dylan',
        description: `Blonde on Blonde is the seventh studio album by American singer-songwriter Bob Dylan, released as a double album on June 20, 1966, by Columbia Records. Recording sessions began in New York in October 1965 with numerous backing musicians, including members of Dylan's live backing band, the Hawks. Though sessions continued until January 1966, they yielded only one track that made it onto the final album—"One of Us Must Know (Sooner or Later)". At producer Bob Johnston's suggestion, Dylan, keyboardist Al Kooper, and guitarist Robbie Robertson moved to the CBS studios in Nashville, Tennessee. These sessions, augmented by some of Nashville's top session musicians, were more fruitful, and in February and March all the remaining songs for the album were recorded.`,
        price: 10.99,
        inventoryQuantity: 12,
        imgURL: 'Bob_Dylan_-_Blonde_on_Blonde.jpg'
      },
      {
        title: 'Random Access Memories',
        artist: 'Daft Punk',
        description: `Random Access Memories is the fourth studio album by French electronic duo Daft Punk, released on 17 May 2013 through Columbia Records. The album pays tribute to late 1970s and early 1980s American music, particularly from Los Angeles. This theme is reflected in the album's packaging, as well as its promotional campaign, which included billboards, television advertisements, and a web series. Recording took place at Henson, Conway and Capitol Studios in California, Electric Lady Studios in New York City, and Gang Recording Studio in Paris, France. Random Access Memories was the duo's final album before they split up in February 2021.`,
        price: 12.99,
        inventoryQuantity: 46,
        imgURL: 'Random_Access_Memories.jpg'
      },
      {
        title: 'Rumours',
        artist: 'Fleetwood Mac',
        description: `Rumours is the eleventh studio album by British-American rock band Fleetwood Mac, released on 4 February 1977 by Warner Bros. Records. Largely recorded in California in 1976, it was produced by the band with Ken Caillat and Richard Dashut. The band wanted to expand on the commercial success of their self-titled 1975 album. The group recorded the album in the aftermath of relationship breakups among its members and heavy drug use, both of which shaped the album's lyrics.`,
        price: 13.99,
        inventoryQuantity: 55,
        imgURL: 'FMacRumours.PNG'
      },
      {
        title: 'A Love Supreme',
        artist: 'John Coltrane',
        description: `A Love Supreme is an album by American jazz saxophonist John Coltrane. He recorded it in one session on December 9, 1964, at Van Gelder Studio in Englewood Cliffs, New Jersey, leading a quartet featuring pianist McCoy Tyner, bassist Jimmy Garrison, and drummer Elvin Jones.`,
        price: 12.99,
        inventoryQuantity: 23,
        imgURL: 'John_Coltrane_-_A_Love_Supreme.jpg'
      },
      {
        title: `What's Going On`,
        artist: 'Marvin Gaye',
        description: `What's Going On is the eleventh studio album by American soul singer, songwriter, and producer Marvin Gaye. It was released on May 21, 1971, by the Motown Records subsidiary label Tamla. Recorded between 1970 and 1971 in sessions at Hitsville U.S.A., Golden World, and United Sound Studios in Detroit, and at The Sound Factory in West Hollywood, California, it was Gaye's first album to credit him as a producer and to credit Motown's in-house studio band, the session musicians known as the Funk Brothers.`,
        price: 14.99,
        inventoryQuantity: 44,
        imgURL: `MarvinGayeWhat'sGoingOnalbumcover.jpg`
      },
      {
        title: 'Kind of Blue',
        artist: 'Miles Davis',
        description: `Kind of Blue is a studio album by American jazz trumpeter, composer, and bandleader Miles Davis. It was recorded on March 2 and April 22, 1959, at Columbia's 30th Street Studio in New York City, and released on August 17 of that year by Columbia Records. For the recording, Davis led a sextet featuring saxophonists John Coltrane and Julian "Cannonball" Adderley, pianist Bill Evans, bassist Paul Chambers, and drummer Jimmy Cobb, with new band pianist Wynton Kelly appearing on one track - "Freddie Freeloader" - in place of Evans.`,
        price: 13.99,
        inventoryQuantity: 43,
        imgURL: 'MilesDavisKindofBlue.jpg'
      },
      {
        title: 'Graceland',
        artist: 'Paul Simon',
        description: 'Graceland is the seventh solo studio album by American singer-songwriter Paul Simon. It was produced by Simon, engineered by Roy Halee and released on August 25, 1986, by Warner Bros. Records.',
        price: 10.99,
        inventoryQuantity: 18,
        imgURL: '220px-Graceland_cover_-_Paul_Simon.jpg'
      },
      {
        title: 'Moondance',
        artist: 'Van Morrison',
        description: `Moondance is the third studio album by Northern Irish singer-songwriter Van Morrison. It was released on 27 January 1970 by Warner Bros. Records. After the commercial failure of his first Warner Bros. album Astral Weeks (1968), Morrison moved to upstate New York with his wife and began writing songs for Moondance. There, he met the musicians that would record the album with him at New York City's A & R Studios in August and September 1969.`,
        price: 15.99,
        inventoryQuantity: 32,
        imgURL: 'VanMorrisonMoondance.jpg'
      },
      {
        title: 'Is This It',
        artist: 'The Strokes',
        description: 'Is This It is the debut studio album by American rock band the Strokes. It was first released on July 30, 2001, in Australia, with RCA Records handling the release internationally and Rough Trade Records handling the United Kingdom release. It was recorded at Transporterraum in New York City with producer Gordon Raphael during March and April 2001. For their debut, the band strived to capture a simple sound that was not significantly enhanced in the studio. Building on their 2001 EP The Modern Age, the band members molded compositions largely through live takes during recording sessions, while songwriter and lead singer Julian Casablancas continued to detail the lives and relationships of urban youth.',
        price: 12.99,
        inventoryQuantity: 37,
        imgURL: 'The_Strokes_-_Ist_Tis_It_US_cover.png'
      },
      {
        title: 'No Fences',
        artist: 'Garth Brooks',
        description: `No Fences is the second studio album by the American country music artist Garth Brooks. It was released on August 27, 1990, and reached No. 1 on Billboard's Top Country Albums chart. The album also reached No. 3 on the Billboard 200. On the latter chart it stayed in the top 40 for 126 weeks. No Fences remains Brooks' best-selling studio album to date with 18 million copies shipped in the US, and is the album that made him an international star. It was his first album issued in Europe (the original European release contained the four singles from his US debut as bonus tracks).`,
        price: 12.99,
        inventoryQuantity: 14,
        imgURL: 'Garth_Brooks-No_Fences_(album_cover).jpg'
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
        subtotal: 117.97,
      },
      {
        creatorId: 1,
        subtotal: 219.84,
      },
      {
        creatorId: 3,
        subtotal: 41.97,
      },
      {
        creatorId: 2,
        subtotal: 309.80,
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
        price: product1.price,
      },
      {
        orderId: orderOne.id,
        productId: product2.id,
        quantity: 3,
        price: product2.price,
      },
      {
        orderId: orderTwo.id,
        productId: product3.id,
        quantity: 6,
        price: product3.price,
      },
      {
        orderId: orderTwo.id,
        productId: product4.id,
        quantity: 10,
        price: product4.price,
      },
      {
        orderId: orderThree.id,
        productId: product5.id,
        quantity: 2,
        price: product5.price,
      },
      {
        orderId: orderThree.id,
        productId: product6.id,
        quantity: 1,
        price: product6.price,
      },
      {
        orderId: orderFour.id,
        productId: product7.id,
        quantity: 10,
        price: product7.price,
      },
      {
        orderId: orderFour.id,
        productId: product1.id,
        quantity: 4,
        price: product1.price,
      },
      {
        orderId: orderFour.id,
        productId: product2.id,
        quantity: 10,
        price: product2.price,
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

async function createInitialProductCategories() {
  try {
    console.log('Starting to create product categories i.e. attach categories to products')
    const categories = await getAllCategories();
    const products = await getProductsOnly();
    const productCategoriesToCreate = [
      { productId: products[0].id, categoryId: categories[0].id },
      { productId: products[0].id, categoryId: categories[2].id },
      { productId: products[0].id, categoryId: categories[7].id },
      { productId: products[0].id, categoryId: categories[11].id },
      { productId: products[1].id, categoryId: categories[9].id },
      { productId: products[1].id, categoryId: categories[12].id },
      { productId: products[1].id, categoryId: categories[7].id },
      { productId: products[2].id, categoryId: categories[1].id },
      { productId: products[2].id, categoryId: categories[4].id },
      { productId: products[3].id, categoryId: categories[10].id },
      { productId: products[3].id, categoryId: categories[9].id },
      { productId: products[3].id, categoryId: categories[14].id },
      { productId: products[4].id, categoryId: categories[0].id },
      { productId: products[4].id, categoryId: categories[4].id },
      { productId: products[5].id, categoryId: categories[0].id },
      { productId: products[5].id, categoryId: categories[4].id },
      { productId: products[5].id, categoryId: categories[7].id },
      { productId: products[5].id, categoryId: categories[15].id },
      { productId: products[6].id, categoryId: categories[9].id },
      { productId: products[6].id, categoryId: categories[4].id },
      { productId: products[6].id, categoryId: categories[14].id },
      { productId: products[6].id, categoryId: categories[10].id },
      { productId: products[6].id, categoryId: categories[1].id },
      { productId: products[6].id, categoryId: categories[11].id },
      { productId: products[7].id, categoryId: categories[0].id },
      { productId: products[7].id, categoryId: categories[7].id },
      { productId: products[8].id, categoryId: categories[4].id },
      { productId: products[8].id, categoryId: categories[0].id },
      { productId: products[8].id, categoryId: categories[9].id },
      { productId: products[9].id, categoryId: categories[0].id },
      { productId: products[9].id, categoryId: categories[4].id },
      { productId: products[9].id, categoryId: categories[9].id },
      { productId: products[9].id, categoryId: categories[10].id },
      { productId: products[10].id, categoryId: categories[0].id },
      { productId: products[10].id, categoryId: categories[4].id },
      { productId: products[11].id, categoryId: categories[0].id },
      { productId: products[11].id, categoryId: categories[11].id },
      { productId: products[11].id, categoryId: categories[4].id },
      { productId: products[12].id, categoryId: categories[11].id },
      { productId: products[12].id, categoryId: categories[0].id },
      { productId: products[13].id, categoryId: categories[12].id },
      { productId: products[13].id, categoryId: categories[8].id },
      { productId: products[14].id, categoryId: categories[12].id },
      { productId: products[14].id, categoryId: categories[8].id },
      { productId: products[15].id, categoryId: categories[13].id },
      { productId: products[16].id, categoryId: categories[0].id },
      { productId: products[17].id, categoryId: categories[9].id },
      { productId: products[17].id, categoryId: categories[14].id },
      { productId: products[18].id, categoryId: categories[9].id },
      { productId: products[18].id, categoryId: categories[11].id },
      { productId: products[18].id, categoryId: categories[14].id },
      { productId: products[19].id, categoryId: categories[16].id },
      { productId: products[19].id, categoryId: categories[0].id },
      { productId: products[20].id, categoryId: categories[0].id },
      { productId: products[20].id, categoryId: categories[10].id },
      { productId: products[20].id, categoryId: categories[11].id },
      { productId: products[20].id, categoryId: categories[4].id },
      { productId: products[20].id, categoryId: categories[15].id },
      { productId: products[21].id, categoryId: categories[0].id },
      { productId: products[21].id, categoryId: categories[16].id },
      { productId: products[21].id, categoryId: categories[4].id },
      { productId: products[22].id, categoryId: categories[1].id },
      { productId: products[23].id, categoryId: categories[11].id },
      { productId: products[23].id, categoryId: categories[14].id },
      { productId: products[23].id, categoryId: categories[9].id },
      { productId: products[23].id, categoryId: categories[4].id },
      { productId: products[24].id, categoryId: categories[1].id },
      { productId: products[25].id, categoryId: categories[0].id },
      { productId: products[25].id, categoryId: categories[4].id },
      { productId: products[25].id, categoryId: categories[16].id },
      { productId: products[26].id, categoryId: categories[0].id },
      { productId: products[26].id, categoryId: categories[14].id },
      { productId: products[26].id, categoryId: categories[1].id },
      { productId: products[26].id, categoryId: categories[4].id },
      { productId: products[26].id, categoryId: categories[16].id },
      { productId: products[27].id, categoryId: categories[17].id },
      { productId: products[27].id, categoryId: categories[0].id },
      { productId: products[28].id, categoryId: categories[3].id }
    ]
    const productCategories = await Promise.all(productCategoriesToCreate.map(addCategoryToProduct));
    console.log('product categories created/attached', productCategories);
    console.log('Finished creating product categories!');
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
    const usersToCreate = [
      {
      username: 'albert',
      password: 'bertie99',
      email: 'albert.bertie99@mail.com',
      isAdmin: true
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
    {
      username: 'kevin',
      password: 'kevin123',
      email: 'kevin123@mail.com'
    }
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

async function createInitialReviews(){
  try{
    console.log("Starting creating reviews table...");
    const reviewsToCreate = [
      {
        creatorId: 4,
        username: 'jenny',
        productId: 1,
        description: 'This album came in good condition.'

      },
      {
        creatorId: 2,
        username: 'Steve',
        productId: 4,
        description: 'I would def make this my go to shop for vinyls'

      },
      {
        creatorId: 3,
        username: 'Howard',
        productId: 7,
        description: 'My order came in on time.'

      },
    ]
    const reviews = await Promise.all(
      reviewsToCreate.map((reviews) => createReview(reviews))
    )
    console.log("Reviews", reviews)
    console.log("Finished creating reviews.");

  } catch(error){
    console.error(error)
  }
}

async function createInitialCategories(){
try {
console.log("creating categories");
const categoriestoCreate = [
  {name: 'rock'},
  {name: 'jazz'},
  {name: 'metal'},
  {name: 'country'},
  {name: 'pop'},
  {name: 'vinyl'},
  {name: 'cassettes'},
  {name: 'alternative'},
  {name: 'rap'},
  {name: 'R&B'},
  {name: 'funk'},
  {name: 'progressive'},
  {name: 'hip hop'},
  {name: 'reggae'},
  {name: 'soul'},
  {name: 'electronic'},
  {name: 'folk'},
  {name: 'indie'}
]
const categories = await Promise.all(
  categoriestoCreate.map(createCategory)
)
console.log("Categories", categories)
console.log("Finished creating categories.");
}
catch(error) {
  throw error;
}
}
async function rebuildDB() {
  try {
    console.log("buildingdb");
    client.connect();
    await dropTables();
    await buildTables();
    await createInitialUsers();
    await createInitialProducts();
    await createInitialCategories();
    await createInitialReviews();
    await createInitialOrders();
    await createInitialOrderProducts();
    await createInitialProductCategories();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

module.exports = {
  rebuildDB
}
