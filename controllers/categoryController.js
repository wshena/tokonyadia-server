const readJSONFile = require('../utils/fileReader');

const getCategories = async (req, res) => {
  try {
    const categories = await readJSONFile('store/categories.json');
    const categoryId = req.query.id;
    
    if (categoryId) {
      const category = categories.find(c => c.category_id === categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.json(category);
    }
    
    res.json(categories);
  } catch (error) {
    console.error('Error reading categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getCategories };
