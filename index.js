const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kfnsc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db('Laptops').collection('Category');
        const productsCollection = client.db('Laptops').collection('Products');
        const bookingCollection = client.db('Laptops').collection('Bookings');
        const userCollection = client.db('Laptops').collection('User');
        const advertiseCollection = client.db('Laptops').collection('Advertise');







        app.get('/category', async (req, res) => {
            const query = {}
            const cursor = categoryCollection.find(query).sort({ _id: -1 });
            const categories = await cursor.toArray();
            res.send(categories);
        });
        app.get('/sellers', async (req, res) => {
            const query = { role: 'Seller' }
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/buyers', async (req, res) => {
            const query = { role: 'Buyer' }
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/product', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });



        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            console.log(email);
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        })

        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };

            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })
        app.post('/products', async (req, res) => {
            const review = req.body;
            const product = await productsCollection.insertOne(review);
            res.send(product);
        });

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { cat_id: id };
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = productsCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
        });


        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'Admin' });
        })


        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'Buyer' });
        })


        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.role === 'Seller' });
        })



        app.get('/advertise', async (req, res) => {
            const query = {}
            const cursor = advertiseCollection.find(query).sort({ _id: -1 });
            const products = await cursor.toArray();
            res.send(products);
        });



        app.post('/bookings', async (req, res) => {
            const review = req.body;
            const booked = await bookingCollection.insertOne(review);
            res.send(booked);
        });

        app.post('/advertise', async (req, res) => {
            const review = req.body;

            const name = review.name;
            const query = { name };
            console.log(name);
            const found = await advertiseCollection.findOne(query);
            if (found) {
            }
            else {
                const result = await advertiseCollection.insertOne(review);
                res.send(result);
            }

        });


        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query1 = { _id: id };
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            const resultad = await advertiseCollection.deleteOne(query1);

            res.send(result);
        })

        app.delete('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.deleteMany(query);
            const product = await productsCollection.deleteMany(query);
            const ad = await advertiseCollection.deleteMany(query);

            res.send(result);
        })

        app.delete('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await userCollection.deleteMany(query);
            const product = await bookingCollection.deleteMany(query);

            res.send(result);
        })



        app.post('/user', async (req, res) => {
            const review = req.body;
            console.log(review);
            const name = review.name;
            const query = { name };
            const found = await userCollection.findOne(query);
            if (found) {
            }
            else {
                const result = await userCollection.insertOne(review);
                res.send(result);
            }
        });

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: 'sold'
                }
            }
            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });




    }
    finally {

    }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('laptops server is running')
})

app.listen(port, () => {
    console.log(`laptops server running on ${port}`);
})