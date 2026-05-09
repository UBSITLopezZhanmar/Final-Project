require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

const Order = mongoose.model('orders', {
  category: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String
});

app.get('/api/orders', async (req, res) => {
  res.send(await Order.find());
});

app.post('/api/orders', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.send(order);
});

app.delete('/api/orders/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Order cancelled" });
});

app.put('/api/orders/:id', async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.send(updatedOrder);
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 3000, () =>
      console.log("Server running")
    );
  })
  .catch(err => console.log(err));