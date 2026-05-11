const { db } = require('../data/db');

const getAllProducts = (req, res) => {
  res.status(200).json({ products: db.products });
};

const getProductById = (req, res) => {
  const { id } = req.params;
  const product = db.products.find(p => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.status(200).json({ product });
};

const searchProducts = (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const searchTerm = q.toLowerCase();
  const results = db.products.filter(p =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm)
  );

  res.status(200).json({ products: results });
};

module.exports = { getAllProducts, getProductById, searchProducts };
