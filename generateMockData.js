// generateMockData.js
const { faker } = require('@faker-js/faker');
const fs = require('fs');

// Konstanta jumlah data
const NUM_CATEGORIES = 20;
const PRODUCTS_PER_CATEGORY = 30;
const NUM_COLLECTIONS = 20;
// const NUM_PRODUCTS = NUM_CATEGORIES * PRODUCTS_PER_CATEGORY; // 600 produk

// Offset untuk menghindari duplikasi ID dengan data yang sudah ada
const CATEGORY_OFFSET = 100;   // kategori akan dimulai dari CAT-0100
const PRODUCT_OFFSET = 100;    // produk akan dimulai dari SKU-10240100
const COLLECTION_OFFSET = 100; // koleksi akan dimulai dari COL-0100

// Helper untuk membuat angka dengan padding, misalnya 1 => "0001"
function padNumber(num, size) {
  let s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
}

// Array untuk menampung data
const categories = [];
const products = [];

// --- 1. Generate Categories ---
for (let i = 0; i < NUM_CATEGORIES; i++) {
  const categoryTitle = faker.commerce.department();
  const slug = categoryTitle.toLowerCase().replace(/\s+/g, '-');
  const category = {
    category_id: `CAT-${padNumber(CATEGORY_OFFSET + i, 4)}`, // Misal: CAT-0100, CAT-0101, dst.
    title: categoryTitle,
    thumbnail: faker.image.urlPicsumPhotos({ width: 400, height: 400, blur: 0 }),
    path: `/categories/${slug}`,
    products: [] // nanti akan diisi dengan product_id
  };
  categories.push(category);
}

// --- 2. Generate Products ---
let productCounter = 1;
categories.forEach(category => {
  for (let i = 0; i < PRODUCTS_PER_CATEGORY; i++) {
    const product_id = `SKU-${10240000 + PRODUCT_OFFSET + productCounter}`;
    productCounter++;

    const productTitle = faker.commerce.productName();
    const productSlug = productTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const generateImages = (width, height) => {
      const imgs = [];
      for (let j = 0; j < 4; j++) {
        imgs.push(faker.image.urlPicsumPhotos({ width, height, blur: 0 }));
      }
      return imgs;
    };

    const product = {
      product_id,
      category_id: category.category_id,
      category: category.title,
      title: productTitle,
      path: `/products/${productSlug}-${product_id}`,
      description: faker.commerce.productDescription(),
      specification: [
        `Material: ${faker.commerce.productMaterial()}`,
        `Color: ${faker.color.human()}`,
        `Sleeve Length: ${faker.helpers.arrayElement(['Short', 'Long'])}`,
        `Fit: ${faker.helpers.arrayElement(['Athletic', 'Regular', 'Slim'])}`
      ],
      images: {
        "800x900": generateImages(800, 900),
        "320x360": generateImages(320, 360),
        "160x180": generateImages(160, 180)
      },
      stock: [
        { type: "S", quantity: faker.number.int({ min: 10, max: 50 }) },
        { type: "M", quantity: faker.number.int({ min: 10, max: 50 }) },
        { type: "L", quantity: faker.number.int({ min: 10, max: 50 }) },
        { type: "XL", quantity: faker.number.int({ min: 10, max: 50 }) },
        { type: "XXL", quantity: faker.number.int({ min: 10, max: 50 }) }
      ],
      price: {
        currency: "USD",
        withoutDiscount: parseFloat(faker.commerce.price(20, 100, 2)),
        withDiscount: parseFloat(faker.commerce.price(10, 50, 2)),
        discountPercentage: faker.number.int({ min: 5, max: 30 })
      },
      performance: {
        sales: faker.number.int({ min: 0, max: 1000 }),
        ratingAverage: parseFloat(faker.finance.amount(1, 5, 1)),
        ratingCount: faker.number.int({ min: 0, max: 500 })
      },
      keywords: [
        category.title.toLowerCase(),
        productTitle.toLowerCase(),
        faker.helpers.arrayElement(["fashion", "style", "trendy", "modern"])
      ]
    };

    products.push(product);
    // Tambahkan product_id ke kategori yang sesuai
    category.products.push(product_id);
  }
});

// --- 2.1. Rebuild daftar product_id di kategori (opsional sebagai safety check) ---
categories.forEach(category => {
  category.products = products
    .filter(product => product.category_id === category.category_id)
    .map(product => product.product_id);
});

// --- 3. Generate Collections ---
const collections = [];
for (let i = 0; i < NUM_COLLECTIONS; i++) {
  const collection_id = `COL-${padNumber(COLLECTION_OFFSET + i, 4)}`;
  const collectionTitle = faker.commerce.productAdjective() + ' ' + faker.commerce.productMaterial();
  const slug = collectionTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const description = `Starting at $${faker.commerce.price(10, 50, 2)}`;
  const thumbnail = faker.image.urlPicsumPhotos({ width: 400, height: 400, blur: 0 });
  const path = `/collections/${slug}`;

  const numProductsInCollection = faker.number.int({ min: 10, max: 15 });
  const collectionProducts = new Set();
  while (collectionProducts.size < numProductsInCollection) {
    const randomProduct = faker.helpers.arrayElement(products);
    collectionProducts.add(randomProduct.product_id);
  }
  // Jika perlu, pastikan koleksi hanya berisi product_id yang valid:
  const validProductIds = new Set(products.map(p => p.product_id));
  const filteredCollectionProducts = Array.from(collectionProducts).filter(id => validProductIds.has(id));

  collections.push({
    collection_id,
    title: collectionTitle,
    description,
    thumbnail,
    path,
    products: filteredCollectionProducts
  });
}

// --- 4. Output Data ---
const output = {
  products,
  categories,
  collections
};

fs.writeFileSync('mockData.json', JSON.stringify(output, null, 2));
console.log('Mock data generated successfully.');
