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



        app.get('/category', async (req, res) => {
            const query = {}
            const cursor = categoryCollection.find(query).sort({ _id: -1 });
            const categories = await cursor.toArray();
            res.send(categories);
        });

        // app.get('/services', async (req, res) => {
        //     const query = {}
        //     const cursor = serviceCollection.find(query);
        //     const services = await cursor.toArray();
        //     res.send(services);
        // });



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
            console.log(email);
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { cat_id: id };
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
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

        // app.get('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { services: id };
        //     const cursor = reviewCollection.find(query).sort({ _id: -1 });
        //     const review = await cursor.toArray();
        //     res.send(review);
        // });





        // app.get('/reviews', async (req, res) => {
        //     let query = {};
        //     if (req.query.email) {
        //         query = {
        //             email: req.query.email
        //         }
        //     }

        //     const cursor = reviewCollection.find(query).sort({ _id: -1 });
        //     const review = await cursor.toArray();
        //     res.send(review);
        // });


        app.post('/bookings', async (req, res) => {
            const review = req.body;
            const booked = await bookingCollection.insertOne(review);
            res.send(booked);
        });


        app.post('/user', async (req, res) => {
            const review = req.body;
            const user = await userCollection.insertOne(review);
            res.send(user);
        });




        // app.delete('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await reviewCollection.deleteOne(query);
        //     res.send(result);
        // })


        // app.patch('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const message = req.body.message
        //     console.log(message)
        //     const query = { _id: ObjectId(id) }
        //     const updatedDoc = {
        //         $set: {
        //             message: message
        //         }
        //     }
        //     const result = await reviewCollection.updateOne(query, updatedDoc);
        //     res.send(result);
        // })

        // // app.post('/orders', async (req, res) => {
        // //     const order = req.body;
        // //     const result = await orderCollection.insertOne(order);
        // //     res.send(result);
        // // });




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