const path = require('path');
const readJSONFile = require('../utils/fileReader');

const getCollections = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../store/collections.json');
    const collections = await readJSONFile(filePath);
    const collectionId = req.query.id;
    
    if (collectionId) {
      const collection = collections.find(c => c.collection_id === collectionId);
      if (!collection) {
        return res.status(404).json({ error: 'Collection not found' });
      }
      return res.json(collection);
    }
    
    res.json(collections);
  } catch (error) {
    console.error('Error reading collections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getCollections };
