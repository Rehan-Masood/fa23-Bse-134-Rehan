import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const foodImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop';
const burgerImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop';
const restaurantImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop';

async function main() {
  console.log('Starting database seed...');

  await prisma.deliveryAssignment.deleteMany();
  await prisma.deliveryPerson.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.tableBooking.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  const [adminPassword, customerPassword, deliveryPassword] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('password123', 10),
    bcrypt.hash('delivery123', 10),
  ]);

  await prisma.user.create({
    data: {
      email: 'admin@foodexpress.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+92-300-1234567',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'Ahmed Khan',
      password: customerPassword,
      role: 'CUSTOMER',
      phone: '+92-321-9876543',
      addresses: {
        create: {
          addressLine: '123 Main Street',
          city: 'Karachi',
          isDefault: true,
        },
      },
    },
  });

  const customerTwo = await prisma.user.create({
    data: {
      email: 'sara@example.com',
      name: 'Sara Ahmed',
      password: customerPassword,
      role: 'CUSTOMER',
      phone: '+92-333-4567890',
    },
  });

  const deliveryUser = await prisma.user.create({
    data: {
      email: 'delivery@foodexpress.com',
      name: 'Alex Johnson',
      password: deliveryPassword,
      role: 'DELIVERY_PERSON',
      phone: '+92-300-2223344',
    },
  });

  const deliveryPerson = await prisma.deliveryPerson.create({
    data: {
      userId: deliveryUser.id,
      status: 'AVAILABLE',
      isOnline: true,
      vehicleType: 'Motorbike',
      vehicleNumber: 'KHI-2458',
      rating: 4.8,
      completedOrders: 125,
      totalEarnings: 5680,
    },
  });

  const restaurants = await Promise.all([
    prisma.restaurant.create({
      data: {
        name: 'Pizza Palace',
        description: 'Wood-fired pizzas, garlic bread, and comfort food.',
        imageUrl: restaurantImage,
        rating: 4.6,
        deliveryTimeMin: 30,
        deliveryTimeMax: 40,
        minOrderAmount: 500,
        address: 'Boat Basin, Clifton, Karachi',
      },
    }),
    prisma.restaurant.create({
      data: {
        name: 'Burger House',
        description: 'Premium burgers, fried chicken, and shakes.',
        imageUrl: burgerImage,
        rating: 4.4,
        deliveryTimeMin: 25,
        deliveryTimeMax: 35,
        minOrderAmount: 400,
        address: 'Tariq Road, Karachi',
      },
    }),
    prisma.restaurant.create({
      data: {
        name: 'Sushi World',
        description: 'Fresh sushi boxes, bowls, and Japanese favorites.',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&h=800&fit=crop',
        rating: 4.7,
        deliveryTimeMin: 35,
        deliveryTimeMax: 50,
        minOrderAmount: 900,
        address: 'Zamzama Boulevard, Karachi',
      },
    }),
  ]);

  for (const restaurant of restaurants) {
    const categories = await Promise.all(
      ['Pizza', 'Burger', 'Biryani', 'Dessert', 'Beverage'].map((name) =>
        prisma.category.create({
          data: {
            name,
            description: `${name} favorites`,
            restaurantId: restaurant.id,
          },
        }),
      ),
    );

    const menuItems =
      restaurant.name === 'Burger House'
        ? [
            { name: 'Classic Smash Burger', price: 850, categoryId: categories[1].id, imageUrl: burgerImage },
            { name: 'Crispy Chicken Burger', price: 780, categoryId: categories[1].id, imageUrl: burgerImage },
            { name: 'Loaded Fries', price: 420, categoryId: categories[3].id, imageUrl: foodImage },
          ]
        : restaurant.name === 'Sushi World'
          ? [
              { name: 'Salmon Sushi Box', price: 1480, categoryId: categories[3].id, imageUrl: foodImage },
              { name: 'Tuna Roll', price: 1180, categoryId: categories[3].id, imageUrl: foodImage },
              { name: 'Miso Soup', price: 390, categoryId: categories[4].id, imageUrl: foodImage },
            ]
          : [
              { name: 'Margherita Pizza', price: 1299, categoryId: categories[0].id, imageUrl: foodImage },
              { name: 'Pepperoni Pizza', price: 1499, categoryId: categories[0].id, imageUrl: foodImage },
              { name: 'Cheese Burst Pizza', price: 1599, categoryId: categories[0].id, imageUrl: foodImage },
              { name: 'Garlic Bread', price: 599, categoryId: categories[3].id, imageUrl: foodImage },
              { name: 'Coca Cola', price: 250, categoryId: categories[4].id, imageUrl: foodImage },
            ];

    await prisma.menuItem.createMany({
      data: menuItems.map((item) => ({
        ...item,
        restaurantId: restaurant.id,
        description: `Signature ${item.name} from ${restaurant.name}.`,
        isAvailable: true,
        averageRating: 4.5,
      })),
    });
  }

  await prisma.promotion.createMany({
    data: [
      {
        code: 'WELCOME50',
        type: 'PERCENTAGE',
        value: 50,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        minOrderAmount: 500,
      },
      {
        code: 'FLAT100',
        type: 'FIXED',
        value: 100,
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        minOrderAmount: 800,
      },
    ],
  });

  const pizzaItems = await prisma.menuItem.findMany({
    where: { restaurantId: restaurants[0].id },
    take: 3,
  });

  const deliveredOrder = await prisma.order.create({
    data: {
      userId: customer.id,
      restaurantId: restaurants[0].id,
      orderNumber: 'ORD-123456',
      status: 'DELIVERED',
      totalAmount: 2472,
      deliveryFee: 299,
      discount: 200,
      deliveryAddress: '123 Main Street, Karachi',
      estimatedDeliveryTime: new Date(Date.now() - 60 * 60 * 1000),
      orderItems: {
        createMany: {
          data: pizzaItems.map((item, index) => ({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: index === 0 ? 1 : 2,
          })),
        },
      },
      deliveryAssignment: {
        create: {
          deliveryPersonId: deliveryPerson.id,
          status: 'DELIVERED',
          fee: 299,
          acceptedAt: new Date(Date.now() - 110 * 60 * 1000),
          pickedUpAt: new Date(Date.now() - 90 * 60 * 1000),
          deliveredAt: new Date(Date.now() - 65 * 60 * 1000),
        },
      },
    },
  });

  const activeOrder = await prisma.order.create({
    data: {
      userId: customerTwo.id,
      restaurantId: restaurants[1].id,
      orderNumber: 'ORD-123457',
      status: 'PENDING',
      totalAmount: 1850,
      deliveryFee: 299,
      discount: 0,
      deliveryAddress: '456 Park Avenue, Karachi',
      estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000),
      orderItems: {
        createMany: {
          data: [
            {
              menuItemId: (await prisma.menuItem.findFirstOrThrow({ where: { restaurantId: restaurants[1].id } })).id,
              name: 'Classic Smash Burger',
              price: 850,
              quantity: 2,
            },
          ],
        },
      },
      deliveryAssignment: {
        create: {
          status: 'AVAILABLE',
          fee: 299,
        },
      },
    },
  });

  await prisma.review.createMany({
    data: [
      {
        userId: customer.id,
        restaurantId: restaurants[0].id,
        menuItemId: pizzaItems[0].id,
        orderId: deliveredOrder.id,
        rating: 5,
        comment: 'Excellent pizza and fast delivery.',
      },
      {
        userId: customerTwo.id,
        restaurantId: restaurants[1].id,
        orderId: activeOrder.id,
        rating: 4,
        comment: 'Fresh burgers and good packaging.',
      },
    ],
  });

  console.log('Seed complete.');
  console.log('Admin: admin@foodexpress.com / admin123');
  console.log('Customer: customer@example.com / password123');
  console.log('Delivery: delivery@foodexpress.com / delivery123');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
