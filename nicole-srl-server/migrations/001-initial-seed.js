import bcrypt from 'bcryptjs';

const up = async (models) => {
  const { User, Category, Product, Client, Sale, HeroSlide } = models;

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash('Nicol3123!Admin', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@nicoletrend.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('  ✅ Usuario admin creado');
  }

  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    const categories = [
      { name: 'TUTTO', slug: 'tutto', image: '/images/products/dress-2.jpg', enabled: true },
      { name: 'VESTITI', slug: 'vestiti', image: '/images/products/dress-1.jpg', enabled: true },
      { name: 'BLUSE', slug: 'bluse', image: '/images/products/blouse-1.jpg', enabled: true },
      { name: 'GONNE', slug: 'gonne', image: '/images/products/skirt-1.jpg', enabled: true },
      { name: 'PANTALONI', slug: 'pantaloni', image: '/images/products/pants-1.jpg', enabled: true },
      { name: 'GIACCHE', slug: 'giacche', image: '/images/products/jacket-1.jpg', enabled: true },
      { name: 'ACCESSORI', slug: 'accessori', image: '/images/products/bag-1.jpg', enabled: true },
    ];
    await Category.insertMany(categories);
    console.log('  ✅ Categorias insertadas');
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const products = [
      { name: "Vestito Elegante Sofia", description: "Vestito elegante in seta blu con dettagli raffinati.", price: 129.00, stock: 15, category: "vestiti", images: [], brand: "Nicole", isFeatured: true },
      { name: "Blusa Valentina", description: "Blusa in seta rosa con finiture pregiate.", price: 79.00, stock: 20, category: "bluse", images: [], brand: "Nicole", isFeatured: true },
      { name: "Gonna Luna", description: "Gonna in tessuto leggero dal taglio elegante.", price: 89.00, stock: 12, category: "gonne", images: [], brand: "Nicole", isFeatured: true },
      { name: "Pantaloni Roma", description: "Pantaloni in cotone dal comfort eccezionale.", price: 99.00, stock: 18, category: "pantaloni", images: [], brand: "Nicole", isFeatured: true },
      { name: "Giacca Athena", description: "Giacca in lana dal design sofisticato.", price: 159.00, stock: 8, category: "giacche", images: [], brand: "Nicole", isFeatured: true },
      { name: "Borsa Sera", description: "Borsa in pelle rosa antico per occasioni speciali.", price: 69.00, stock: 10, category: "accessori", images: [], brand: "Nicole", isFeatured: true },
      { name: "Vestito Estate", description: "Vestito in cotone leggero perfetto per l'estate.", price: 119.00, stock: 14, category: "vestiti", images: [], brand: "Nicole", isFeatured: false },
      { name: "Blusa Firenze", description: "Blusa in chiffon con dettagli femminili.", price: 89.00, stock: 16, category: "bluse", images: [], brand: "Nicole", isFeatured: false },
      { name: "Vestito di Seta Elegante", description: "Vestito da sera in pura seta con dettagli in pizzo.", price: 129.99, stock: 15, category: "vestiti", images: [], brand: "Nicole", isFeatured: false },
      { name: "Bolso di Cuoio Artigianale", description: "Borsa a mano fatta a mano con cuoio genuino.", price: 89.50, stock: 8, category: "accessori", images: [], brand: "Nicole", isFeatured: false },
      { name: "Scarpe con Tacco Classico", description: "Scarpe col tacco alto per occasioni speciali.", price: 65.00, stock: 12, category: "accessori", images: [], brand: "Nicole", isFeatured: false },
      { name: "Giacca in Vera Pelle", description: "Giacca in pelle genuina con finiture artigianali.", price: 149.00, stock: 5, category: "giacche", images: [], brand: "Nicole", isFeatured: false },
      { name: "Borsa in Pelle Rosa", description: "Borsa elegante in pelle rosa antico.", price: 110.00, stock: 7, category: "accessori", images: [], brand: "Nicole", isFeatured: false },
      { name: "Pantalone Classico", description: "Pantalone elegante per occasioni formali.", price: 95.00, stock: 14, category: "pantaloni", images: [], brand: "Nicole", isFeatured: false },
      { name: "Gonna in Seta", description: "Gonna fluida in seta naturale.", price: 85.00, stock: 11, category: "gonne", images: [], brand: "Nicole", isFeatured: false },
    ];
    await Product.insertMany(products);
    console.log('  ✅ Productos insertados');
  }

  const clientCount = await Client.countDocuments();
  if (clientCount === 0) {
    const clients = [
      { name: "María González", email: "maria.gonzalez@email.com", phone: "+34 600 111 222", address: "Calle Mayor 123, Madrid", totalPurchases: 5, totalSpent: 450.00 },
      { name: "Carlos Méndez", email: "carlos.mendez@email.com", phone: "+34 600 333 444", address: "Avenida Diagonal 456, Barcelona", totalPurchases: 3, totalSpent: 280.50 },
      { name: "Laura Fernández", email: "laura.fernandez@email.com", phone: "+34 600 555 666", address: "Plaza España 789, Sevilla", totalPurchases: 8, totalSpent: 1200.75 }
    ];
    await Client.insertMany(clients);
    console.log('  ✅ Clientes insertados');
  }

  const saleCount = await Sale.countDocuments();
  if (saleCount === 0) {
    const clients = await Client.find();
    const products = await Product.find();
    const sales = [
      { client: clients[0]?._id, clientName: "María González", products: [{ productName: "Vestito di Seta Elegante", quantity: 1, price: 129.99 }], total: 129.99, status: "completed" },
      { client: clients[1]?._id, clientName: "Carlos Méndez", products: [{ productName: "Bolso di Cuoio Artigianale", quantity: 2, price: 89.50 }], total: 179.00, status: "pending" },
      { client: clients[2]?._id, clientName: "Laura Fernández", products: [{ productName: "Scarpe con Tacco Classico", quantity: 1, price: 65.00 }], total: 65.00, status: "completed" },
      { client: clients[0]?._id, clientName: "María González", products: [{ productName: "Scarpe con Tacco Classico", quantity: 1, price: 65.00 }], total: 65.00, status: "shipped" }
    ];
    await Sale.insertMany(sales);
    console.log('  ✅ Ventas insertadas');
  }

  if (HeroSlide) {
    const slideCount = await HeroSlide.countDocuments();
    if (slideCount === 0) {
      const products = await Product.find().limit(3);
      const slides = products.map((p, i) => ({
        type: 'product',
        product: p._id,
        enabled: true,
        order: i,
      }));
      if (slides.length > 0) {
        await HeroSlide.insertMany(slides);
        console.log(`  ✅ ${slides.length} Hero Slide create`);
      }
    }
  }
};

export default { name: '001-initial-seed', up };
