import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Users, { User } from '@/models/User';
import Products, { Product } from '@/models/Product';
import bcrypt from 'bcrypt';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local',
    );
  }

  const opts = {
    bufferCommands: false,
  };

  const conn = await mongoose.connect(MONGODB_URI, opts);

  await conn.connection.db.dropDatabase();

  const products: Product[] = [
    {
      name: 'The new Abnormal',
      price: 20.95,
      img: '/img/album-images/image-card-01.jpg',
      description:
        'The New Abnormal is the sixth studio album by American rock band the Strokes, released on April 10, 2020, through Cult and RCA Records.[2] It was their first full-length album since Comedown Machine (2013), marking the longest gap between studio albums by the band. ',
    },
    {
      name: 'AM',
      price: 17.95,
      img: '/img/album-images/image-card-02.webp',
      description:
        'AM is the fifth studio album by English rock band Arctic Monkeys. It was produced by longtime collaborator James Ford and co-produced by Ross Orton at Sage & Sound Recording in Los Angeles and Rancho De La Luna in Joshua Tree, California, and released on 9 September 2013 through Domino Recording Company.',
    },
    {
      name: 'The midnight',
      price: 24.95,
      img: '/img/album-images/image-card-03.webp',
      description:
        "Midnights is the tenth studio album by American singer-songwriter Taylor Swift, released on October 21, 2022, via Republic Records. Announced at the 2022 MTV Video Music Awards, Midnights marked Swift's first new body of work since her 2020 indie folk albums, Folklore and Evermore.",
    },
    {
      name: 'Currents',
      price: 14.55,
      img: '/img/album-images/image-card-04.jpg',
      description:
        'Currents is the third studio album by Australian musical project Tame Impala. It was released on 17 July 2015 by Modular Recordings and Universal Music Australia. In the United States it was released by Interscope Records and Fiction Records in the UK, while Caroline International released it in other regions.',
    },
    {
      name: 'Human Sadness',
      price: 37.95,
      img: '/img/album-images/image-card-05.jpg',
      description:
        '"Human Sadness" is the debut single by American rock band Julian Casablancas + The Voidz. It was released on September 2, 2014 via Casablancas indie record label Cult Records and is from their debut album Tyranny. The song is nearly eleven minutes long',
    },
    {
      name: 'A Night at the Opera ',
      price: 16.22,
      img: '/img/album-images/image-card-06.webp',
      description:
        'A Night at the Opera is the fourth studio album by the British rock band Queen, released on 21 November 1975 by EMI Records in the United Kingdom and Elektra Records in the United States. ',
    },
    {
      name: 'Bon jovi',
      price: 11.3,
      img: '/img/album-images/image-card-07.jpg',
      description:
        'Bon Jovi is the debut studio album by American rock band Bon Jovi, released on January 23, 1984, by Mercury Records. Produced by Tony Bongiovi and Lance Quinn, it is significant for being the only Bon Jovi album in which a song appears that was not written or co-written by a member of the band. The album charted at number 43 on the US Billboard 200',
    },
    {
      name: 'Born to Die',
      price: 24.95,
      img: '/img/album-images/image-card-08.jpg',
      description:
        'Born to Die is the debut major-label and second studio album by American singer-songwriter Lana Del Rey. It was released on January 27, 2012, through Interscope Records and Polydor Records. A reissue of the album, subtitled The Paradise Edition, was released on November 9, 2012. The new material from the reissue was also made available on a separate EP, titled Paradise.',
    },
  ];

  const insertedProducts = await Products.insertMany(products);
  const hashedPassword = await bcrypt.hash('1234', 10);

  const user: User = {
    email: 'johndoe@example.com',
    password: hashedPassword,
    name: 'John',
    surname: 'Doe',
    address: '123 Main St, 12345 New York, United States',
    birthdate: new Date('1970-01-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id,
        qty: 2,
      },
      {
        product: insertedProducts[1]._id,
        qty: 5,
      },
    ],
    orders: [],
  };

  const res = await Users.create(user);
  console.log(JSON.stringify(res, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);
