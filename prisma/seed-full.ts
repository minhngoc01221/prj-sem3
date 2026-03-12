import client, { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('🔄 Starting database seed...\n');
  
  await client.connect();
  const db = getDb();

  // 1. Seed Users
  console.log('👤 Seeding users...');
  const usersCollection = db.collection('users');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = {
    email: 'admin@karnel.com',
    password: hashedPassword,
    name: 'Admin Administrator',
    role: 'admin',
    isActive: true,
    phone: '02812345678',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await usersCollection.updateOne(
    { email: adminUser.email },
    { $setOnInsert: adminUser },
    { upsert: true }
  );
  console.log('✅ Admin user created/updated');

  // Seed sample users
  const sampleUsers = [
    { email: 'user1@karnel.com', name: 'Nguyễn Văn A', role: 'user', isActive: true },
    { email: 'user2@karnel.com', name: 'Trần Thị B', role: 'user', isActive: true },
    { email: 'user3@karnel.com', name: 'Lê Văn C', role: 'user', isActive: true },
  ];

  for (const user of sampleUsers) {
    const userPassword = await bcrypt.hash('user123', 10);
    await usersCollection.updateOne(
      { email: user.email },
      { $setOnInsert: { ...user, password: userPassword, createdAt: new Date(), updatedAt: new Date() } },
      { upsert: true }
    );
  }
  console.log('✅ Sample users created');

  // 2. Seed Settings
  console.log('\n⚙️ Seeding settings...');
  const settingsCollection = db.collection('settings');
  
  const settings = [
    { key: 'companyName', value: 'Karnel Travels', type: 'text' },
    { key: 'companyEmail', value: 'info@karneltravels.com', type: 'text' },
    { key: 'companyPhone', value: '028 1234 5678', type: 'text' },
    { key: 'companyAddress', value: '123 Lê Lợi, Quận 1, TP. Hồ Chí Minh', type: 'text' },
    { key: 'companyWebsite', value: 'https://www.karneltravels.com', type: 'text' },
    { key: 'companyDescription', value: 'Công ty du lịch và lữ hành hàng đầu Việt Nam', type: 'text' },
    { key: 'logo', value: '', type: 'text' },
    { key: 'facebook', value: 'https://facebook.com/karneltravels', type: 'text' },
    { key: 'instagram', value: 'https://instagram.com/karneltravels', type: 'text' },
    { key: 'youtube', value: 'https://youtube.com/karneltravels', type: 'text' },
    { key: 'zalo', value: 'https://zalo.me/karneltravels', type: 'text' },
  ];

  for (const setting of settings) {
    await settingsCollection.updateOne(
      { key: setting.key },
      { $set: { ...setting, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }
  console.log('✅ Settings created');

  // 3. Seed Navigation Menus (F231)
  console.log('\n📋 Seeding navigation menus...');
  const menusCollection = db.collection('navigation_menus');
  
  const menus = [
    { name: 'Trang chủ', url: '/', icon: 'home', position: 1, isActive: true },
    { name: 'Tour', url: '/tours', icon: 'plane', position: 2, isActive: true },
    { name: 'Khách sạn', url: '/hotels', icon: 'building', position: 3, isActive: true },
    { name: 'Nhà hàng', url: '/restaurants', icon: 'utensils', position: 4, isActive: true },
    { name: 'Điểm du lịch', url: '/spots', icon: 'map', position: 5, isActive: true },
    { name: 'Liên hệ', url: '/contact', icon: 'mail', position: 6, isActive: true },
    { name: 'Giới thiệu', url: '/about', icon: 'info', position: 7, isActive: true },
  ];

  await menusCollection.deleteMany({});
  await menusCollection.insertMany(menus.map(m => ({ ...m, createdAt: new Date(), updatedAt: new Date() })));
  console.log('✅ Navigation menus created');

  // 4. Seed Banners (F232)
  console.log('\n🖼️ Seeding banners...');
  const bannersCollection = db.collection('banners');
  
  const banners = [
    {
      title: 'Khám phá Việt Nam',
      description: 'Trải nghiệm những vùng đất tuyệt đẹp',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      linkUrl: '/tours',
      position: 1,
      isActive: true,
    },
    {
      title: 'Giảm giá mùa hè',
      description: 'Ưu đãi lên đến 30%',
      imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
      linkUrl: '/promotions',
      position: 2,
      isActive: true,
    },
    {
      title: 'Khách sạn sang trọng',
      description: 'Đặt ngay hôm nay',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      linkUrl: '/hotels',
      position: 3,
      isActive: true,
    },
    {
      title: 'Ẩm thực Việt',
      description: 'Khám phá hương vị địa phương',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      linkUrl: '/restaurants',
      position: 4,
      isActive: true,
    },
  ];

  await bannersCollection.deleteMany({});
  await bannersCollection.insertMany(banners.map(b => ({ ...b, createdAt: new Date(), updatedAt: new Date() })));
  console.log('✅ Banners created');

  // 5. Seed Contacts
  console.log('\n📧 Seeding contacts...');
  const contactsCollection = db.collection('contacts');
  
  const contacts = [
    {
      fullName: 'Nguyễn Văn Minh',
      email: 'minh.nguyen@email.com',
      phone: '0912345678',
      title: 'Tư vấn tour Hà Nội',
      message: 'Tôi muốn được tư vấn về tour Hà Nội 3 ngày 2 đêm cho gia đình 4 người. Xin hãy liên hệ lại cho tôi.',
      serviceType: 'Tour',
      status: 'unread',
      createdAt: new Date('2026-03-10'),
    },
    {
      fullName: 'Trần Thị Hương',
      email: 'huong.tran@email.com',
      phone: '0987654321',
      title: 'Đặt khách sạn Đà Nẵng',
      message: 'Tôi muốn đặt khách sạn tại Đà Nẵng từ ngày 20/03 đến 25/03. Có thể hỗ trợ không?',
      serviceType: 'Khách sạn',
      status: 'read',
      createdAt: new Date('2026-03-08'),
    },
    {
      fullName: 'Lê Văn Phong',
      email: 'phong.le@email.com',
      phone: '0934567890',
      title: 'Yêu cầu đặt nhà hàng',
      message: 'Chúng tôi cần đặt nhà hàng cho tiệc cưới khoảng 200 khách vào ngày 15/04. Xin hãy báo giá.',
      serviceType: 'Nhà hàng',
      status: 'replied',
      replyMessage: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ gửi báo giá chi tiết qua email trong thời gian sớm nhất.',
      repliedAt: new Date('2026-03-06'),
      createdAt: new Date('2026-03-05'),
    },
    {
      fullName: 'Phạm Thị Mai',
      email: 'mai.pham@email.com',
      phone: '0978123456',
      title: 'Hỏi về tour Phú Quốc',
      message: 'Tour Phú Quốc có bao gồm vé máy bay khứ hồi không? Chi phí là bao nhiêu?',
      serviceType: 'Tour',
      status: 'unread',
      createdAt: new Date('2026-03-11'),
    },
  ];

  await contactsCollection.deleteMany({});
  await contactsCollection.insertMany(contacts.map(c => ({ ...c, updatedAt: new Date() })));
  console.log('✅ Contacts created');

  // 6. Seed Bookings
  console.log('\n📦 Seeding bookings...');
  const bookingsCollection = db.collection('bookings');
  
  const bookings = [
    {
      userId: 'user1',
      userName: 'Nguyễn Văn A',
      userEmail: 'user1@karnel.com',
      userPhone: '0912345678',
      type: 'tour',
      itemId: 'tour1',
      itemName: 'Tour Hà Nội - Hạ Long - Sapa 5N4Đ',
      bookingDate: new Date('2026-03-01'),
      travelDate: new Date('2026-03-15'),
      guests: 4,
      totalPrice: 24000000,
      status: 'completed',
      paymentStatus: 'paid',
      notes: 'Cần phòng đôi cho cặp vợ chồng',
      createdAt: new Date('2026-03-01'),
      updatedAt: new Date('2026-03-10'),
    },
    {
      userId: 'user2',
      userName: 'Trần Thị B',
      userEmail: 'user2@karnel.com',
      userPhone: '0987654321',
      type: 'hotel',
      itemId: 'hotel1',
      itemName: 'Khách sạn Grand Plaza Hà Nội',
      bookingDate: new Date('2026-03-05'),
      travelDate: new Date('2026-03-20'),
      guests: 2,
      totalPrice: 5600000,
      status: 'confirmed',
      paymentStatus: 'paid',
      notes: 'Check-in sớm nếu có phòng',
      createdAt: new Date('2026-03-05'),
      updatedAt: new Date('2026-03-06'),
    },
    {
      userId: 'user3',
      userName: 'Lê Văn C',
      userEmail: 'user3@karnel.com',
      userPhone: '0934567890',
      type: 'restaurant',
      itemId: 'rest1',
      itemName: 'Nhà hàng Hải Sản Biển Xanh',
      bookingDate: new Date('2026-03-08'),
      travelDate: new Date('2026-03-12'),
      guests: 10,
      totalPrice: 8000000,
      status: 'pending',
      paymentStatus: 'unpaid',
      notes: 'Tiệc sinh nhật, cần trang trí',
      createdAt: new Date('2026-03-08'),
      updatedAt: new Date('2026-03-08'),
    },
    {
      userId: 'user1',
      userName: 'Nguyễn Văn A',
      userEmail: 'user1@karnel.com',
      userPhone: '0912345678',
      type: 'tour',
      itemId: 'tour2',
      itemName: 'Tour Đà Nẵng - Hội An - Huế 4N3Đ',
      bookingDate: new Date('2026-03-09'),
      travelDate: new Date('2026-04-01'),
      guests: 2,
      totalPrice: 18000000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      notes: 'Hủy do thay đổi kế hoạch',
      createdAt: new Date('2026-03-09'),
      updatedAt: new Date('2026-03-11'),
    },
    {
      userId: 'user2',
      userName: 'Trần Thị B',
      userEmail: 'user2@karnel.com',
      userPhone: '0987654321',
      type: 'tour',
      itemId: 'tour3',
      itemName: 'Tour Phú Quốc 3N2Đ',
      bookingDate: new Date('2026-03-10'),
      travelDate: new Date('2026-03-25'),
      guests: 3,
      totalPrice: 15000000,
      status: 'pending',
      paymentStatus: 'unpaid',
      notes: '',
      createdAt: new Date('2026-03-10'),
      updatedAt: new Date('2026-03-10'),
    },
  ];

  await bookingsCollection.deleteMany({});
  await bookingsCollection.insertMany(bookings);
  console.log('✅ Bookings created');

  // 7. Seed Promotions
  console.log('\n🏷️ Seeding promotions...');
  const promotionsCollection = db.collection('promotions');
  
  const promotions = [
    {
      promoCode: 'SUMMER2026',
      name: 'Giảm giá mùa hè',
      description: 'Giảm 20% cho tất cả tour mùa hè',
      discountPercent: 20,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-08-31'),
      targetType: 'Tour',
      isActive: true,
      usageLimit: 100,
      usageCount: 45,
      createdAt: new Date('2026-03-01'),
      updatedAt: new Date('2026-03-01'),
    },
    {
      promoCode: 'WELCOME50K',
      name: 'Chào mừng thành viên mới',
      description: 'Giảm 50K cho đơn hàng đầu tiên',
      discountPercent: 0,
      discountAmount: 50000,
      minPurchase: 500000,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      isActive: true,
      usageLimit: 500,
      usageCount: 123,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      promoCode: 'HOTEL25',
      name: 'Giảm giá khách sạn',
      description: 'Giảm 25% cho đặt khách sạn từ 2 đêm trở lên',
      discountPercent: 25,
      minNights: 2,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-04-30'),
      targetType: 'Hotel',
      isActive: true,
      usageLimit: 200,
      usageCount: 67,
      createdAt: new Date('2026-03-01'),
      updatedAt: new Date('2026-03-01'),
    },
  ];

  await promotionsCollection.deleteMany({});
  await promotionsCollection.insertMany(promotions);
  console.log('✅ Promotions created');

  // 8. Seed Spots
  console.log('\n📍 Seeding spots...');
  const spotsCollection = db.collection('spots');
  
  const spots = [
    {
      name: 'Vịnh Hạ Long',
      slug: 'vinh-ha-long',
      description: 'Vịnh Hạ Long được UNESCO công nhận là Di sản Thiên nhiên Thế giới với hàng nghìn đảo đá vôi và hang động tuyệt đẹp.',
      location: 'Quảng Ninh',
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      rating: 4.8,
      reviewCount: 1250,
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      name: 'Phố cổ Hội An',
      slug: 'pho-co-hoi-an',
      description: 'Phố cổ Hội An với kiến trúc cổ độc đáo, đèn lồng rực rỡ và ẩm thực đặc sắc.',
      location: 'Quảng Nam',
      images: ['https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800'],
      rating: 4.9,
      reviewCount: 980,
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      name: 'Đà Lạt',
      slug: 'da-lat',
      description: 'Thành phố ngàn hoa với khí hậu mùa xuân quanh năm, cảnh quan thiên nhiên tuyệt đẹp.',
      location: 'Lâm Đồng',
      images: ['https://images.unsplash.com/photo-1528181304800-259b08848526?w=800'],
      rating: 4.7,
      reviewCount: 756,
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  await spotsCollection.deleteMany({});
  await spotsCollection.insertMany(spots);
  console.log('✅ Spots created');

  // 9. Seed Hotels
  console.log('\n🏨 Seeding hotels...');
  const hotelsCollection = db.collection('hotels');
  
  const hotels = [
    {
      name: 'Grand Plaza Hà Nội',
      slug: 'grand-plaza-ha-noi',
      description: 'Khách sạn 5 sao tại trung tâm Hà Nội với view đẹp và dịch vụ hoàn hảo.',
      address: '123 Đường Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
      phone: '02412345678',
      email: 'booking@grandplaza.com.vn',
      starRating: 5,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar'],
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      name: 'Sea View Đà Nẵng',
      slug: 'sea-view-da-nang',
      description: 'Khách sạn biển với tầm nhìn ra bãi biển Mỹ Khê, Đà Nẵng.',
      address: '45 Đường Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng',
      phone: '02361234567',
      email: 'booking@seaview.com.vn',
      starRating: 4,
      images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Beach Access'],
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  await hotelsCollection.deleteMany({});
  await hotelsCollection.insertMany(hotels);
  console.log('✅ Hotels created');

  // 10. Seed Restaurants
  console.log('\n🍽️ Seeding restaurants...');
  const restaurantsCollection = db.collection('restaurants');
  
  const restaurants = [
    {
      name: 'Nhà hàng Hải Sản Biển Xanh',
      slug: 'hai-san-bien-xanh',
      description: 'Nhà hàng chuyên hải sản tươi sống với view biển tuyệt đẹp.',
      address: '78 Đường Võ Nguyên Giáp, Đà Nẵng',
      phone: '02361234567',
      cuisine: 'Hải sản',
      priceRange: '$$',
      images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      name: 'Quán Ăn Ngon Sài Gòn',
      slug: 'quan-an-ngon-sai-gon',
      description: 'Quán ăn mang đậm hương vị ẩm thực miền Nam Việt Nam.',
      address: '456 Đường Nguyễn Trãi, Quận 1, TP. HCM',
      phone: '02812345678',
      cuisine: 'Việt Nam',
      priceRange: '$',
      images: ['https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=800'],
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  await restaurantsCollection.deleteMany({});
  await restaurantsCollection.insertMany(restaurants);
  console.log('✅ Restaurants created');

  // 11. Seed Tours
  console.log('\n✈️ Seeding tours...');
  const toursCollection = db.collection('tours');
  
  const tours = [
    {
      name: 'Tour Hà Nội - Hạ Long - Sapa 5N4Đ',
      slug: 'tour-ha-noi-ha-long-sapa-5n4d',
      description: 'Khám phá vẻ đẹp miền Bắc Việt Nam với Hà Nội, vịnh Hạ Long và Sapa.',
      destination: 'Hà Nội - Quảng Ninh - Lào Cai',
      duration: '5 ngày 4 đêm',
      price: 15000000,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      highlights: ['Vịnh Hạ Long', 'Phố cổ Hà Nội', 'Sapa', 'Bảo tàng dân tộc học'],
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      name: 'Tour Đà Nẵng - Hội An - Huế 4N3Đ',
      slug: 'tour-da-nang-hoi-an-hue-4n3d',
      description: 'Trải nghiệm văn hóa miền Trung với Đà Nẵng, Hội An và Huế.',
      destination: 'Đà Nẵng - Quảng Nam - Thừa Thiên Huế',
      duration: '4 ngày 3 đêm',
      price: 12000000,
      images: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'],
      highlights: ['Cầu Rồng', 'Phố cổ Hội An', 'Kinh thành Huế', 'Biển Mỹ Khê'],
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      name: 'Tour Phú Quốc 3N2Đ',
      slug: 'tour-phu-quoc-3n2d',
      description: 'Khám phá đảo ngọc Phú Quốc với bãi biển đẹp và ẩm thực biển.',
      destination: 'Phú Quốc, Kiên Giang',
      duration: '3 ngày 2 đêm',
      price: 8500000,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      highlights: ['Bãi Sao', 'Dinh Cậu', 'Suối Tranh', 'Vinpearl Land'],
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  await toursCollection.deleteMany({});
  await toursCollection.insertMany(tours);
  console.log('✅ Tours created');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📧 Login credentials:');
  console.log('   Email: admin@karnel.com');
  console.log('   Password: admin123\n');

  await client.close();
}

seedDatabase().catch(console.error);
