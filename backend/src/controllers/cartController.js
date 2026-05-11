const { db } = require('../data/db');

const getCart = (req, res) => {
  const { userId } = req;

  if (!db.carts[userId]) {
    return res.status(200).json({ items: [] });
  }

  const cartItems = db.carts[userId].map(item => {
    const product = db.products.find(p => p.id === item.productId);
    return {
      productId: item.productId,
      quantity: item.quantity,
      product
    };
  });

  res.status(200).json({ items: cartItems });
};

const addToCart = (req, res) => {
  const { userId } = req;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const product = db.products.find(p => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!db.carts[userId]) {
    db.carts[userId] = [];
  }

  const existingItem = db.carts[userId].find(item => item.productId === parseInt(productId));

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    db.carts[userId].push({ productId: parseInt(productId), quantity });
  }

  res.status(200).json({ message: 'Product added to cart', cart: db.carts[userId] });
};

const removeFromCart = (req, res) => {
  const { userId } = req;
  const { productId } = req.params;

  if (!db.carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  db.carts[userId] = db.carts[userId].filter(item => item.productId !== parseInt(productId));

  res.status(200).json({ message: 'Product removed from cart', cart: db.carts[userId] });
};

const updateCart = (req, res) => {
  const { userId } = req;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!db.carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const item = db.carts[userId].find(item => item.productId === parseInt(productId));

  if (!item) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    db.carts[userId] = db.carts[userId].filter(item => item.productId !== parseInt(productId));
  } else {
    item.quantity = quantity;
  }

  res.status(200).json({ message: 'Cart updated', cart: db.carts[userId] });
};

const clearCart = (req, res) => {
  const { userId } = req;

  db.carts[userId] = [];

  res.status(200).json({ message: 'Cart cleared' });
};

module.exports = { getCart, addToCart, removeFromCart, updateCart, clearCart };
