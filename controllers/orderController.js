const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const path = require('path');
const readJSONFile = require('../utils/fileReader');

const ORDERS_FILE = path.join(__dirname, '../', 'store', 'orders.json');

const readOrders = async () => {
  try {
    const data = await readFile(ORDERS_FILE, 'utf8');
    // Jika file kosong, kembalikan array kosong
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const writeOrders = async (orders) => {
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
};

const allOrders = async (req, res) => {
  try {
    const data = await readJSONFile('store/orders.json');
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Gagal mengambil data order.' });
  }
};

const createNewOrder = async (req, res) => {
  const { userId, products, totalAmount, currency, address, paymentMethod, notes, deliveryMethod } = req.body;
  if (!userId || !products) {
    return res.status(400).json({ error: 'Parameter userId, products, dan quantity wajib diisi.' });
  }
  
  try {
    const orders = await readOrders();
    
    const newOrder = {
      id: Date.now(),
      userId,
      products,
      status: 'pending',
      createdAt: new Date().toISOString(),
      totalAmount,
      currency,
      address,
      paymentMethod,
      deliveryMethod,
      notes,
    };
    
    orders.push(newOrder);
    await writeOrders(orders);
    
    return res.status(201).json({
      message: 'Order berhasil dibuat.',
      order: newOrder
    });
  } catch (error) {
    console.error("Error saat membuat order:", error);
    return res.status(500).json({ error: 'Terjadi kesalahan saat memproses order.' });
  }
};

// Fungsi untuk memproses (bayar) order
const processOrder = async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'Parameter orderId wajib diisi.' });
  }
  try {
    const orders = await readOrders();
    const orderIndex = orders.findIndex(order => order.id == orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order tidak ditemukan.' });
    }
    if (orders[orderIndex].status !== 'pending') {
      return res.status(400).json({ error: 'Hanya order dengan status pending yang dapat diproses.' });
    }
    orders[orderIndex].status = 'processed';
    orders[orderIndex].processedAt = new Date().toISOString();
    await writeOrders(orders);
    return res.status(200).json({
      message: 'Order berhasil diproses (dibayar).',
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Error saat memproses order:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan saat memproses order.' });
  }
};

// Fungsi untuk membatalkan order
const cancelOrder = async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'Parameter orderId wajib diisi.' });
  }
  try {
    const orders = await readOrders();
    const orderIndex = orders.findIndex(order => order.id == orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order tidak ditemukan.' });
    }
    if (orders[orderIndex].status !== 'pending') {
      return res.status(400).json({ error: 'Hanya order dengan status pending yang dapat dibatalkan.' });
    }
    orders[orderIndex].status = 'cancelled';
    orders[orderIndex].cancelledAt = new Date().toISOString();
    await writeOrders(orders);
    return res.status(200).json({
      message: 'Order berhasil dibatalkan.',
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Error saat membatalkan order:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan saat membatalkan order.' });
  }
};

module.exports = { createNewOrder, allOrders, processOrder, cancelOrder };
