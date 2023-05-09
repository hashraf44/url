const express = require('express');
const { connectToMongoDB } = require("./connectDb")
const urlRoute = require("./routes/url")
const URL = require('./models/url')

const app = express();
const PORT = process.env.PORT || 5001;

connectToMongoDB('mongodb://localhost:27017/url-shortner').then(() => console.log('mongoDB connected'))

app.use(express.json())
app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
        shortId,
         
    }, 
    {
        $push: {
            visit_history: {
                timestamp: Date.now(),
            }
        },
    });
    res.redirect(entry.redirectURL)
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})