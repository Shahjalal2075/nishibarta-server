const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log('UserName: ', process.env.DB_USER);
console.log('Password: ', process.env.DB_PASS);


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@nishibarta.oayojyi.mongodb.net/?retryWrites=true&w=majority&appName=NishiBarta`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const database = client.db("NishiBartaDB");
        const users = database.collection("userList");
        const usersCollectionMenu = database.collection("menu");
        const usersCollectionAllNews = database.collection("allNews");
        const usersCollectionAdminMenu = database.collection("adminMenu");

        app.get('/user-list', async (req, res) => {
            const cursor = users.find()
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/user-list', async (req, res) => {
            const user = req.body;
            console.log('User Add', user);
            const result = await users.insertOne(user);
            res.send(result);
        })
        app.get('/user-details/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const product = await users.findOne(query);
            res.send(product);
        })
        app.get('/user-list/:username', async (req, res) => {
            const username = req.params.username;
            const query = { username: username }
            const product = await users.findOne(query);
            res.send(product);
        })

        app.get('/menu', async (req, res) => {
            const cursor = usersCollectionMenu.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/news', async (req, res) => {
            const cursor = usersCollectionAllNews.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/news/:category', async (req, res) => {
            const category = req.params.category;
            const query = { category: category }
            const cursor = usersCollectionAllNews.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/news', async (req, res) => {
            const news = req.body;
            console.log('new news', news);
            const result = await usersCollectionAllNews.insertOne(news);
            res.send(result);
        })
        app.patch('/news/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updateUser = req.body;
            console.log(query);
            const updateDoc = {
                $set: {
                    status: updateUser.status,
                    operationBy: updateUser.operationBy,
                    operationTime: updateUser.operationTime,
                }
            }
            const result = await usersCollectionAllNews.updateOne(query, updateDoc);
            console.log(result);
            res.send(result);
        })
        app.patch('/delete-news/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updateUser = req.body;
            console.log(query);
            const updateDoc = {
                $set: {
                    deleteStatus: updateUser.deleteStatus,
                    deletedBy: updateUser.deletedBy,
                    deletedTime: updateUser.deletedTime,
                }
            }
            const result = await usersCollectionAllNews.updateOne(query, updateDoc);
            console.log(result);
            res.send(result);
        })

        app.get('/admin-menu', async (req, res) => {
            const cursor = usersCollectionAdminMenu.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/admin-menu/:link', async (req, res) => {
            const link = req.params.link;
            const query = { link: link }
            const result = await usersCollectionAdminMenu.findOne(query);
            res.send(result);
        })

        /* app.get('/user-list', async (req, res) => {
            const cursor = users.find()
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/user-list', async (req, res) => {
            const user = req.body;
            console.log('User Add', user);
            const result = await users.insertOne(user);
            res.send(result);
        })
        app.get('/user-list/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const product = await users.findOne(query);
            res.send(product);
        })
        app.patch('/user-list/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const updateUser = req.body;
            console.log(query);
            const updateDoc = {
                $set: {
                    playMatch: updateUser.playMatch,
                    completedQuiz: updateUser.completedQuiz,
                    points: updateUser.points,
                }
            }
            const result = await users.updateOne(query, updateDoc);
            res.send(result);
        })
        app.delete('/followers/:from/:to', async (req, res) => {
            const from = req.params.from;
            const to = req.params.to;
            const query = { from: from, to: to };
            const result = await followers.deleteOne(query);
            res.send(result);
        })
        app.delete('/projects/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete server id: ', id);
            const query = { _id: new ObjectId(id) };
            const result = await projectsList.deleteOne(query);
            res.send(result);
        }) */

    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Nishi Barta Server Running.");
})

app.listen(port, () => {
    console.log(`Ser running port: ${port}`);
}) 