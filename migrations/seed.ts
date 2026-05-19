import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nicole-trend-shop';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');

  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  }, { timestamps: true }));

  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
  }, { timestamps: true }));

  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    images: [{ type: String }],
    brand: { type: String },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
  }, { timestamps: true }));

  const Client = mongoose.models.Client || mongoose.model('Client', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { street: String, city: String, postalCode: String, country: { type: String, default: 'Italia' } },
    notes: { type: String },
    totalPurchases: { type: Number, default: 0 },
  }, { timestamps: true }));

  const Sale = mongoose.models.Sale || mongoose.model('Sale', new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    clientName: { type: String },
    products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, productName: String, quantity: { type: Number, required: true }, price: { type: Number, required: true } }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'], default: 'pending' },
    paymentMethod: { type: String },
    shippingAddress: { street: String, city: String, postalCode: String, country: String },
  }, { timestamps: true }));

  const HeroSlide = mongoose.models.HeroSlide || mongoose.model('HeroSlide', new mongoose.Schema({
    type: { type: String, enum: ['product', 'custom'], required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    image: { type: String, default: '' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    buttonText: { type: String, default: '' },
    buttonLink: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  }, { timestamps: true }));

  // Admin user
  const existingAdmin = await User.findOne({ email: 'admin@nicoletrend.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Nicol3123!Admin', 12);
    await User.create({ name: 'Admin', email: 'admin@nicoletrend.com', password: hashedPassword, role: 'admin' });
    console.log('✅ Admin user created');
  }

  // Categories
  const categories = [
    { name: 'TUTTO', slug: 'tutto', image: '' },
    { name: 'Vestiti', slug: 'vestiti', image: '/images/products/dress-1.jpg' },
    { name: 'Bluse', slug: 'bluse', image: '/images/products/blouse-1.jpg' },
    { name: 'Gonne', slug: 'gonne', image: '/images/products/skirt-1.jpg' },
    { name: 'Pantaloni', slug: 'pantaloni', image: '/images/products/pants-1.jpg' },
    { name: 'Giacche', slug: 'giacche', image: '/images/products/jacket-1.jpg' },
    { name: 'Accessori', slug: 'accessori', image: '/images/products/bag-1.jpg' },
  ];

  for (const cat of categories) {
    const exists = await Category.findOne({ slug: cat.slug });
    if (!exists) {
      await Category.create(cat);
      console.log(`✅ Category: ${cat.name}`);
    }
  }

  // Products
  const products = [
    { name: 'Vestito Elegante Floreale', description: 'Vestito floreale elegante per occasioni speciali.', price: 89.99, stock: 15, category: 'vestiti', images: ['/images/products/dress-1.jpg'], brand: 'Brend', sizes: ['S', 'M', 'L'], colors: ['Rosa'], isFeatured: true },
    { name: 'Blusa in Seta Bianca', description: 'Blusa elegante in seta per un look raffinato.', price: 59.99, stock: 20, category: 'bluse', images: ['/images/products/blouse-1.jpg'], brand: 'Dejavu', sizes: ['S', 'M', 'L', 'XL'], colors: ['Bianco'], isFeatured: true },
    { name: 'Gonna Plissettata', description: 'Gonna plissettata moderna e versatile.', price: 49.99, stock: 25, category: 'gonne', images: ['/images/products/skirt-1.jpg'], brand: 'Kikisix', sizes: ['S', 'M', 'L'], colors: ['Nero'], isFeatured: true },
    { name: 'Giacca Strutturata', description: 'Giacca strutturata per un look professionale.', price: 129.99, stock: 10, category: 'giacche', images: ['/images/products/jacket-1.jpg'], brand: 'Lumina', sizes: ['M', 'L'], colors: ['Nero'], isFeatured: true },
    { name: 'Pantaloni Tailored', description: 'Pantaloni sartoriali eleganti.', price: 69.99, stock: 18, category: 'pantaloni', images: ['/images/products/pants-1.jpg'], brand: 'Philialoft', sizes: ['S', 'M', 'L'], colors: ['Grigio'], isFeatured: false },
    { name: 'Borsa in Pelle', description: 'Borsa elegante in pelle italiana.', price: 149.99, stock: 8, category: 'accessori', images: ['/images/products/bag-1.jpg'], brand: 'Susystar', sizes: [], colors: ['Marrone'], isFeatured: true },
    { name: 'Vestito Sera Nero', description: 'Vestito da sera elegante nero.', price: 119.99, stock: 12, category: 'vestiti', images: ['/images/products/dress-2.jpg'], brand: 'Brend', sizes: ['S', 'M'], colors: ['Nero'], isFeatured: true },
    { name: 'Blusa Pizzo Rosa', description: 'Blusa con dettagli in pizzo.', price: 54.99, stock: 22, category: 'bluse', images: ['/images/products/blouse-2.jpg'], brand: 'Dejavu', sizes: ['S', 'M', 'L'], colors: ['Rosa'], isFeatured: false },
    { name: 'Gonna Tubino', description: 'Gonna tubino classica.', price: 44.99, stock: 30, category: 'gonne', images: ['/images/products/skirt-2.jpg'], brand: 'Kikisix', sizes: ['S', 'M', 'L'], colors: ['Nero'], isFeatured: false },
    { name: 'Giacca Jeans', description: 'Giacca in jeans casual.', price: 79.99, stock: 15, category: 'giacche', images: ['/images/products/jacket-2.jpg'], brand: 'Lumina', sizes: ['M', 'L', 'XL'], colors: ['Blu'], isFeatured: false },
    { name: 'Pantaloni Palazzo', description: 'Pantaloni palazzo larghi e comodi.', price: 59.99, stock: 20, category: 'pantaloni', images: ['/images/products/pants-2.jpg'], brand: 'Philialoft', sizes: ['S', 'M', 'L'], colors: ['Beige'], isFeatured: false },
    { name: 'Cintura in Pelle', description: 'Cintura elegante in pelle.', price: 39.99, stock: 35, category: 'accessori', images: ['/images/products/bag-2.jpg'], brand: 'Susystar', sizes: ['S', 'M', 'L'], colors: ['Nero'], isFeatured: false },
    { name: 'Vestito Cocktail', description: 'Vestito da cocktail elegante.', price: 99.99, stock: 10, category: 'vestiti', images: ['/images/products/dress-3.jpg'], brand: 'Brend', sizes: ['S', 'M'], colors: ['Rosso'], isFeatured: true },
    { name: 'Blusa Satin Verde', description: 'Blusa in satin verde smeraldo.', price: 64.99, stock: 18, category: 'bluse', images: ['/images/products/blouse-3.jpg'], brand: 'Dejavu', sizes: ['S', 'M', 'L'], colors: ['Verde'], isFeatured: false },
    { name: 'Gonna Lunga', description: 'Gonna lunga bohémien.', price: 54.99, stock: 25, category: 'gonne', images: ['/images/products/skirt-3.jpg'], brand: 'Kikisix', sizes: ['S', 'M', 'L'], colors: ['Multicolore'], isFeatured: false },
  ];

  for (const prod of products) {
    const exists = await Product.findOne({ name: prod.name });
    if (!exists) {
      await Product.create(prod);
      console.log(`✅ Product: ${prod.name}`);
    }
  }

  // Clients
  const clients = [
    { name: 'Maria Rossi', email: 'maria.rossi@email.com', phone: '+39 333 1234567', address: { street: 'Via Roma 10', city: 'Roma', postalCode: '00100', country: 'Italia' }, totalPurchases: 3 },
    { name: 'Giulia Bianchi', email: 'giulia.bianchi@email.com', phone: '+39 333 7654321', address: { street: 'Via Milano 25', city: 'Milano', postalCode: '20100', country: 'Italia' }, totalPurchases: 5 },
    { name: 'Laura Verdi', email: 'laura.verdi@email.com', phone: '+39 333 9876543', address: { street: 'Via Napoli 5', city: 'Napoli', postalCode: '80100', country: 'Italia' }, totalPurchases: 2 },
  ];

  for (const client of clients) {
    const exists = await Client.findOne({ email: client.email });
    if (!exists) {
      await Client.create(client);
      console.log(`✅ Client: ${client.name}`);
    }
  }

  // Hero slides
  const allProducts = await Product.find().limit(3);
  const heroSlides = [
    { type: 'product', product: allProducts[0]?._id, enabled: true, order: 0 },
    { type: 'product', product: allProducts[1]?._id, enabled: true, order: 1 },
    { type: 'custom', title: 'Nuova Collezione', subtitle: 'Primavera Estate 2026', description: 'Scopri i nuovi arrivi per la stagione primaverile.', image: '/images/products/lifestyle-1.jpg', buttonText: 'Scopri Ora', buttonLink: '/collezione', enabled: true, order: 2 },
  ];

  for (const slide of heroSlides) {
    const exists = await HeroSlide.findOne({ title: slide.title || '', order: slide.order });
    if (!exists) {
      await HeroSlide.create(slide);
      console.log(`✅ Hero slide: ${slide.title || slide.type}`);
    }
  }

  console.log('\n🎉 Seed completed successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
