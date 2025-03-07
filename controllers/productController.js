const path = require('path');
const readJSONFile = require('../utils/fileReader');

const getProducts = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../store/products.json');
    const products = await readJSONFile(filePath);
    const productId = req.query.id;
    const productName = req.query.name;

    // search by id
    if (productId) {
      const product = products.find(p => p.product_id === productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(product);
    }

    // search by name
    if (productName) {
      const product = products.filter(p => p.title.toLowerCase() === productName.toLowerCase());
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(product);
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getProducts };
