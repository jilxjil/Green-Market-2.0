import "dotenv/config";

import { createRequire } from "module";
import { hashPassword } from "better-auth/crypto";

const require = createRequire(import.meta.url);
const { Client } = require("pg");

const password = "Password123!";

const users = [
  {
    id: "seed-admin-ama",
    name: "Ama Mensah",
    email: "admin@greenmarket.test",
    role: "admin",
  },
  {
    id: "seed-seller-akua",
    name: "Akua Owusu",
    email: "seller@greenmarket.test",
    role: "seller",
  },
  {
    id: "seed-buyer-kojo",
    name: "Kojo Boateng",
    email: "buyer@greenmarket.test",
    role: "buyer",
  },
  {
    id: "seed-expert-efua",
    name: "Dr. Efua Ansah",
    email: "expert@greenmarket.test",
    role: "expert",
  },
  {
    id: "seed-seller-yaw",
    name: "Yaw Adjei",
    email: "seller-yaw@greenmarket.test",
    role: "seller",
  },
  {
    id: "seed-seller-abena",
    name: "Abena Frimpong",
    email: "seller-abena@greenmarket.test",
    role: "seller",
  },
  {
    id: "seed-buyer-ama",
    name: "Ama Boateng",
    email: "buyer-ama@greenmarket.test",
    role: "buyer",
  },
  {
    id: "seed-expert-kwame",
    name: "Kwame Owusu",
    email: "expert-kwame@greenmarket.test",
    role: "expert",
  },
  {
    id: "seed-expert-nana",
    name: "Nana Yeboah",
    email: "expert-nana@greenmarket.test",
    role: "expert",
  },
] as const;

const profileIds = {
  admin: "11111111-1111-4111-8111-111111111111",
  seller: "22222222-2222-4222-8222-222222222222",
  buyer: "33333333-3333-4333-8333-333333333333",
  expert: "44444444-4444-4444-8444-444444444444",
};

const extraProfileIds = {
  sellerYaw: "22222222-2222-4222-8222-222222222223",
  sellerAbena: "22222222-2222-4222-8222-222222222224",
  buyerAma: "33333333-3333-4333-8333-333333333334",
  expertKwame: "44444444-4444-4444-8444-444444444445",
  expertNana: "44444444-4444-4444-8444-444444444446",
};

const products = [
  {
    id: "aaaaaaaa-0001-4000-8000-000000000001",
    title: "Fresh Organic Tomatoes",
    description:
      "Freshly harvested tomatoes from Nsawam, packed for market stalls and restaurants.",
    category: "Vegetables",
    price: 35,
    unitOfMeasure: "kg",
    stockQuantity: 120,
    imageUrl:
      "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg",
    status: "active",
  },
  {
    id: "aaaaaaaa-0002-4000-8000-000000000002",
    title: "Sweet Pineapples",
    description:
      "Juicy pineapples from the Central Region. Available in crates for wholesale buyers.",
    category: "Fruits",
    price: 18,
    unitOfMeasure: "piece",
    stockQuantity: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1550258987-190a2d41a8ba",
    status: "active",
  },
  {
    id: "aaaaaaaa-0003-4000-8000-000000000003",
    title: "Fresh Carrots",
    description:
      "Crisp carrots packed for retailers, restaurants, and fresh produce baskets.",
    category: "Vegetables",
    price: 22,
    unitOfMeasure: "kg",
    stockQuantity: 64,
    imageUrl:
      "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg",
    status: "active",
  },
  {
    id: "aaaaaaaa-0004-4000-8000-000000000004",
    title: "Yellow Maize Seeds",
    description:
      "Quality maize seeds for growers preparing the next planting season.",
    category: "Farm Supplies",
    price: 40,
    unitOfMeasure: "pack",
    stockQuantity: 0,
    imageUrl:
      "https://images.pexels.com/photos/14321952/pexels-photo-14321952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    status: "out_of_stock",
  },
  {
    id: "aaaaaaaa-0005-4000-8000-000000000005",
    title: "Plantain Bunch",
    description:
      "Mature plantain bunches, good for restaurants, chop bars, and grocery resellers.",
    category: "Fruits",
    price: 55,
    unitOfMeasure: "bunch",
    stockQuantity: 36,
    imageUrl:
      "https://images.pexels.com/photos/6164987/pexels-photo-6164987.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    status: "active",
  },
  {
    id: "aaaaaaaa-0006-4000-8000-000000000006",
    sellerId: "seed-seller-yaw",
    title: "Premium Cocoa Beans",
    description:
      "High-quality Ghanaian cocoa beans for processors and specialty buyers.",
    category: "Cash Crops",
    price: 260,
    unitOfMeasure: "sack",
    stockQuantity: 42,
    imageUrl:
      "https://images.pexels.com/photos/867466/pexels-photo-867466.jpeg",
    status: "active",
  },
  {
    id: "aaaaaaaa-0007-4000-8000-000000000007",
    sellerId: "seed-seller-yaw",
    title: "Organic Mangoes",
    description:
      "Sweet mangoes sorted for restaurants, juice vendors, and grocery shelves.",
    category: "Fruits",
    price: 16,
    unitOfMeasure: "kg",
    stockQuantity: 95,
    imageUrl:
      "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg",
    status: "active",
  },
  {
    id: "aaaaaaaa-0008-4000-8000-000000000008",
    sellerId: "seed-seller-abena",
    title: "Fresh Cassava Tubers",
    description:
      "Clean cassava tubers suitable for processors, restaurants, and wholesalers.",
    category: "Roots",
    price: 70,
    unitOfMeasure: "crate",
    stockQuantity: 30,
    imageUrl:
      "https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg",
    status: "active",
  },
  {
    id: "aaaaaaaa-0009-4000-8000-000000000009",
    sellerId: "seed-seller-abena",
    title: "Fresh Oranges",
    description:
      "Juicy oranges packed for fruit stands, restaurants, and juice sellers.",
    category: "Fruits",
    price: 28,
    unitOfMeasure: "kg",
    stockQuantity: 58,
    imageUrl:
      "https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg",
    status: "active",
  },
  {
    id: "aaaaaaaa-0010-4000-8000-000000000010",
    sellerId: "seed-seller-yaw",
    title: "Maize Seed Packs",
    description:
      "Clean maize seed packs for small farms and community growers.",
    category: "Farm Supplies",
    price: 48,
    unitOfMeasure: "pack",
    stockQuantity: 18,
    imageUrl:
      "https://images.pexels.com/photos/14321952/pexels-photo-14321952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    status: "active",
  },
  {
    id: "aaaaaaaa-0011-4000-8000-000000000011",
    sellerId: "seed-seller-abena",
    title: "Rice Seeds",
    description:
      "Rice seed stock for farms preparing paddy fields and demonstration plots.",
    category: "Farm Supplies",
    price: 190,
    unitOfMeasure: "sack",
    stockQuantity: 24,
    imageUrl:
      "https://images.pexels.com/photos/18446086/pexels-photo-18446086/free-photo-of-close-up-of-seeds.jpeg?auto=compress&cs=tinysrgb&w=1200",
    status: "active",
  },
  {
    id: "aaaaaaaa-0012-4000-8000-000000000012",
    sellerId: "seed-seller-yaw",
    title: "Knapsack Farm Sprayer",
    description:
      "Hand-operated sprayer for crop care, nursery work, and farm maintenance.",
    category: "Farm Supplies",
    price: 85,
    unitOfMeasure: "unit",
    stockQuantity: 0,
    imageUrl:
      "https://agribegri.com/productimage/14619599351739261827.webp",
    status: "out_of_stock",
  },
];

const expertServices = [
  {
    id: "bbbbbbbb-0001-4000-8000-000000000001",
    title: "Crop Disease Diagnosis",
    description:
      "Share crop symptoms and photos, then get practical treatment and prevention guidance.",
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d",
    price: 120,
    durationMinutes: 60,
  },
  {
    id: "bbbbbbbb-0002-4000-8000-000000000002",
    title: "Soil Fertility Planning",
    description:
      "Plan fertilizer, compost, and rotation decisions based on your crop and location.",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
    price: 150,
    durationMinutes: 75,
  },
  {
    id: "bbbbbbbb-0003-4000-8000-000000000003",
    title: "Post-Harvest Handling Review",
    description:
      "Improve storage, sorting, and packaging to reduce losses before market delivery.",
    imageUrl: "https://images.pexels.com/photos/6170400/pexels-photo-6170400.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 90,
    durationMinutes: 45,
  },
  {
    id: "bbbbbbbb-0004-4000-8000-000000000004",
    expertUserId: "seed-expert-kwame",
    title: "Irrigation and Dry Season Planning",
    description:
      "Design a practical watering schedule and field plan for dry season vegetable production.",
    imageUrl: "https://images.pexels.com/photos/2173176/pexels-photo-2173176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    price: 180,
    durationMinutes: 90,
  },
  {
    id: "bbbbbbbb-0005-4000-8000-000000000005",
    expertUserId: "seed-expert-kwame",
    title: "Farm Business Market Access Review",
    description:
      "Review pricing, buyer targets, packaging, and delivery options for a growing farm business.",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    price: 140,
    durationMinutes: 60,
  },
  {
    id: "bbbbbbbb-0006-4000-8000-000000000006",
    expertUserId: "seed-expert-nana",
    title: "Livestock Health Check-In",
    description:
      "Get practical veterinary guidance for poultry, goats, and small ruminant health concerns.",
    imageUrl: "https://plus.unsplash.com/premium_photo-1663013018100-6dbcf6aaddd6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 160,
    durationMinutes: 60,
  },
  {
    id: "bbbbbbbb-0007-4000-8000-000000000007",
    expertUserId: "seed-expert-nana",
    title: "Storage Loss Reduction Plan",
    description:
      "Build a handling and storage plan for grains, roots, and fresh produce after harvest.",
    imageUrl: "https://images.pexels.com/photos/6170400/pexels-photo-6170400.jpeg?auto=compress&cs=tinysrgb&w=1200",
    price: 110,
    durationMinutes: 45,
  },
  {
    id: "bbbbbbbb-0008-4000-8000-000000000008",
    expertUserId: "seed-expert-efua",
    title: "Pepper Pest Control Review",
    description:
      "Identify common pepper pests and choose safer controls for market-ready crops.",
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d",
    price: 125,
    durationMinutes: 60,
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query("begin");

    const hashedPassword = await hashPassword(password);
    const now = new Date();
    const scheduledFor = new Date(Date.now() + 1000 * 60 * 60 * 26);
    const completedAt = new Date(Date.now() - 1000 * 60 * 60 * 28);

    for (const demoUser of users) {
      await client.query(
        `
          insert into "user" (id, name, email, email_verified, image, created_at, updated_at)
          values ($1, $2, $3, true, null, $4, $4)
          on conflict (id) do update set
            name = excluded.name,
            email = excluded.email,
            email_verified = excluded.email_verified,
            updated_at = excluded.updated_at
        `,
        [demoUser.id, demoUser.name, demoUser.email, now]
      );

      await client.query(
        `
          insert into account (id, account_id, provider_id, user_id, password, created_at, updated_at)
          values ($1, $2, 'credential', $2, $3, $4, $4)
          on conflict (id) do update set
            password = excluded.password,
            updated_at = excluded.updated_at
        `,
        [`seed-account-${demoUser.id}`, demoUser.id, hashedPassword, now]
      );
    }

    await client.query(
      `
        insert into profiles (id, user_id, role, avatar_url, created_at)
        values
          ($1, 'seed-admin-ama', 'admin', null, $5),
          ($2, 'seed-seller-akua', 'seller', null, $5),
          ($3, 'seed-buyer-kojo', 'buyer', null, $5),
          ($4, 'seed-expert-efua', 'expert', null, $5)
        on conflict (user_id) do update set
          role = excluded.role,
          avatar_url = excluded.avatar_url
      `,
      [profileIds.admin, profileIds.seller, profileIds.buyer, profileIds.expert, now]
    );

    await client.query(
      `
        insert into profiles (id, user_id, role, avatar_url, created_at)
        values
          ($1, 'seed-seller-yaw', 'seller', null, $6),
          ($2, 'seed-seller-abena', 'seller', null, $6),
          ($3, 'seed-buyer-ama', 'buyer', null, $6),
          ($4, 'seed-expert-kwame', 'expert', null, $6),
          ($5, 'seed-expert-nana', 'expert', null, $6)
        on conflict (user_id) do update set
          role = excluded.role,
          avatar_url = excluded.avatar_url
      `,
      [
        extraProfileIds.sellerYaw,
        extraProfileIds.sellerAbena,
        extraProfileIds.buyerAma,
        extraProfileIds.expertKwame,
        extraProfileIds.expertNana,
        now,
      ]
    );

    await client.query(
      `
        insert into admins (id, user_id, created_at)
        values ('55555555-5555-4555-8555-555555555555', 'seed-admin-ama', $1)
        on conflict (user_id) do nothing
      `,
      [now]
    );

    await client.query(
      `
        insert into seller_profiles (id, user_id, farm_name, location, verification_status)
        values (
          '66666666-6666-4666-8666-666666666666',
          'seed-seller-akua',
          'Akua Fresh Farms',
          'Nsawam, Eastern Region',
          'verified'
        )
        on conflict (user_id) do update set
          farm_name = excluded.farm_name,
          location = excluded.location,
          verification_status = excluded.verification_status
      `
    );

    await client.query(
      `
        insert into seller_profiles (id, user_id, farm_name, location, verification_status)
        values
          (
            '66666666-6666-4666-8666-666666666667',
            'seed-seller-yaw',
            'Yaw Grains Cooperative',
            'Ejura, Ashanti Region',
            'pending'
          ),
          (
            '66666666-6666-4666-8666-666666666668',
            'seed-seller-abena',
            'Abena Roots & Spices',
            'Techiman, Bono East Region',
            'verified'
          )
        on conflict (user_id) do update set
          farm_name = excluded.farm_name,
          location = excluded.location,
          verification_status = excluded.verification_status
      `
    );

    await client.query(
      `
        insert into buyer_profiles (id, user_id, business_name, business_type)
        values (
          '77777777-7777-4777-8777-777777777777',
          'seed-buyer-kojo',
          'Boateng Retail Foods',
          'Retailer'
        )
        on conflict (user_id) do update set
          business_name = excluded.business_name,
          business_type = excluded.business_type
      `
    );

    await client.query(
      `
        insert into buyer_profiles (id, user_id, business_name, business_type)
        values (
          '77777777-7777-4777-8777-777777777778',
          'seed-buyer-ama',
          'Accra Chop Bar Supplies',
          'Restaurant Supplier'
        )
        on conflict (user_id) do update set
          business_name = excluded.business_name,
          business_type = excluded.business_type
      `
    );

    await client.query(
      `
        insert into expert_profiles (id, user_id, expertise, years_of_experience)
        values (
          '88888888-8888-4888-8888-888888888888',
          'seed-expert-efua',
          'Crop pathology, soil fertility, post-harvest handling',
          12
        )
        on conflict (user_id) do update set
          expertise = excluded.expertise,
          years_of_experience = excluded.years_of_experience
      `
    );

    await client.query(
      `
        insert into expert_profiles (id, user_id, expertise, years_of_experience)
        values
          (
            '88888888-8888-4888-8888-888888888889',
            'seed-expert-kwame',
            'Irrigation planning, farm business operations, market access',
            9
          ),
          (
            '88888888-8888-4888-8888-888888888890',
            'seed-expert-nana',
            'Livestock health, grain storage, post-harvest loss reduction',
            15
          )
        on conflict (user_id) do update set
          expertise = excluded.expertise,
          years_of_experience = excluded.years_of_experience
      `
    );

    for (const product of products) {
      await client.query(
        `
          insert into products (
            id, seller_id, title, description, category, price, unit_of_measure,
            stock_quantity, image_url, status, created_at
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          on conflict (id) do update set
            seller_id = excluded.seller_id,
            title = excluded.title,
            description = excluded.description,
            category = excluded.category,
            price = excluded.price,
            unit_of_measure = excluded.unit_of_measure,
            stock_quantity = excluded.stock_quantity,
            image_url = excluded.image_url,
            status = excluded.status
        `,
        [
          product.id,
          "sellerId" in product ? product.sellerId : "seed-seller-akua",
          product.title,
          product.description,
          product.category,
          product.price,
          product.unitOfMeasure,
          product.stockQuantity,
          product.imageUrl,
          product.status,
          now,
        ]
      );
    }

    for (const service of expertServices) {
      await client.query(
        `
          insert into expert_services (
            id, expert_user_id, title, description, price, duration_minutes, archived_at, created_at
          )
          values ($1, $2, $3, $4, $5, $6, null, $7)
          on conflict (id) do update set
            expert_user_id = excluded.expert_user_id,
            title = excluded.title,
            description = excluded.description,
            price = excluded.price,
            duration_minutes = excluded.duration_minutes,
            archived_at = null
        `,
        [
          service.id,
          "expertUserId" in service ? service.expertUserId : "seed-expert-efua",
          service.title,
          service.description,
          service.price,
          service.durationMinutes,
          now,
        ]
      );
    }

    await client.query(
      `
        insert into orders (
          id, buyer_id, total_amount, status, shipping_address,
          fulfillment_status, tracking_number, created_at
        )
        values
          (
            '99999999-0001-4000-8000-000000000001',
            $1,
            '88.00',
            'pending',
            'Boateng Retail Foods\\nSpintex Road, Accra\\nPhone: 024 000 0000',
            'not_shipped',
            null,
            $2
          ),
          (
            '99999999-0002-4000-8000-000000000002',
            $1,
            '110.00',
            'confirmed',
            'Boateng Retail Foods\\nSpintex Road, Accra\\nPhone: 024 000 0000',
            'shipped',
            'GM-TRK-1024',
            $2
          ),
          (
            '99999999-0003-4000-8000-000000000003',
            $1,
            '70.00',
            'fulfilled',
            'Boateng Retail Foods\\nSpintex Road, Accra\\nPhone: 024 000 0000',
            'delivered',
            'GM-TRK-0991',
            $2
          ),
          (
            '99999999-0004-4000-8000-000000000004',
            $3,
            '520.00',
            'fulfilled',
            'Accra Chop Bar Supplies\\nKaneshie Market, Accra\\nPhone: 024 111 2222',
            'delivered',
            'GM-TRK-1104',
            $2
          ),
          (
            '99999999-0005-4000-8000-000000000005',
            $3,
            '84.00',
            'confirmed',
            'Accra Chop Bar Supplies\\nKaneshie Market, Accra\\nPhone: 024 111 2222',
            'not_shipped',
            null,
            $2
          ),
          (
            '99999999-0006-4000-8000-000000000006',
            $1,
            '188.00',
            'fulfilled',
            'Boateng Retail Foods\\nSpintex Road, Accra\\nPhone: 024 000 0000',
            'delivered',
            'GM-TRK-1048',
            $2
          ),
          (
            '99999999-0007-4000-8000-000000000007',
            $3,
            '208.00',
            'pending',
            'Accra Chop Bar Supplies\\nKaneshie Market, Accra\\nPhone: 024 111 2222',
            'not_shipped',
            null,
            $2
          )
        on conflict (id) do update set
          buyer_id = excluded.buyer_id,
          total_amount = excluded.total_amount,
          status = excluded.status,
          shipping_address = excluded.shipping_address,
          fulfillment_status = excluded.fulfillment_status,
          tracking_number = excluded.tracking_number
      `,
      [profileIds.buyer, now, extraProfileIds.buyerAma]
    );

    const orderItems = [
      {
        id: "cccccccc-0001-4000-8000-000000000001",
        orderId: "99999999-0001-4000-8000-000000000001",
        productId: products[0].id,
        quantity: 2,
        priceAtPurchase: "35.00",
      },
      {
        id: "cccccccc-0002-4000-8000-000000000002",
        orderId: "99999999-0001-4000-8000-000000000001",
        productId: products[2].id,
        quantity: 1,
        priceAtPurchase: "18.00",
      },
      {
        id: "cccccccc-0003-4000-8000-000000000003",
        orderId: "99999999-0002-4000-8000-000000000002",
        productId: products[4].id,
        quantity: 2,
        priceAtPurchase: "55.00",
      },
      {
        id: "cccccccc-0004-4000-8000-000000000004",
        orderId: "99999999-0003-4000-8000-000000000003",
        productId: products[0].id,
        quantity: 2,
        priceAtPurchase: "35.00",
      },
      {
        id: "cccccccc-0005-4000-8000-000000000005",
        orderId: "99999999-0004-4000-8000-000000000004",
        productId: products[5].id,
        quantity: 2,
        priceAtPurchase: "260.00",
      },
      {
        id: "cccccccc-0006-4000-8000-000000000006",
        orderId: "99999999-0005-4000-8000-000000000005",
        productId: products[8].id,
        quantity: 3,
        priceAtPurchase: "28.00",
      },
      {
        id: "cccccccc-0007-4000-8000-000000000007",
        orderId: "99999999-0006-4000-8000-000000000006",
        productId: products[7].id,
        quantity: 2,
        priceAtPurchase: "70.00",
      },
      {
        id: "cccccccc-0008-4000-8000-000000000008",
        orderId: "99999999-0006-4000-8000-000000000006",
        productId: products[9].id,
        quantity: 1,
        priceAtPurchase: "48.00",
      },
      {
        id: "cccccccc-0009-4000-8000-000000000009",
        orderId: "99999999-0007-4000-8000-000000000007",
        productId: products[6].id,
        quantity: 4,
        priceAtPurchase: "16.00",
      },
      {
        id: "cccccccc-0010-4000-8000-000000000010",
        orderId: "99999999-0007-4000-8000-000000000007",
        productId: products[9].id,
        quantity: 3,
        priceAtPurchase: "48.00",
      },
    ];

    for (const item of orderItems) {
      await client.query(
        `
          insert into order_items (id, order_id, product_id, quantity, price_at_purchase)
          values ($1, $2, $3, $4, $5)
          on conflict (id) do update set
            order_id = excluded.order_id,
            product_id = excluded.product_id,
            quantity = excluded.quantity,
            price_at_purchase = excluded.price_at_purchase
        `,
        [item.id, item.orderId, item.productId, item.quantity, item.priceAtPurchase]
      );
    }

    await client.query(
      `
        insert into reviews (
          id, order_id, product_id, seller_user_id, buyer_user_id, rating, comment, created_at
        )
        values (
          'abababab-0001-4000-8000-000000000001',
          '99999999-0003-4000-8000-000000000003',
          $1,
          'seed-seller-akua',
          'seed-buyer-kojo',
          5,
          'Fresh tomatoes, well packed, and delivered exactly as agreed.',
          $2
        )
        on conflict (order_id, product_id, buyer_user_id) do update set
          rating = excluded.rating,
          comment = excluded.comment,
          created_at = excluded.created_at
      `,
      [products[0].id, now]
    );

    const reviewsData = [
      {
        id: "abababab-0002-4000-8000-000000000002",
        orderId: "99999999-0004-4000-8000-000000000004",
        productId: products[5].id,
        sellerUserId: "seed-seller-yaw",
        buyerUserId: "seed-buyer-ama",
        rating: 4,
        comment: "Cocoa bean quality was consistent and the sacks were sealed well.",
      },
      {
        id: "abababab-0003-4000-8000-000000000003",
        orderId: "99999999-0006-4000-8000-000000000006",
        productId: products[7].id,
        sellerUserId: "seed-seller-abena",
        buyerUserId: "seed-buyer-kojo",
        rating: 5,
        comment: "Cassava was clean, fresh, and easy for our kitchen team to process.",
      },
      {
        id: "abababab-0004-4000-8000-000000000004",
        orderId: "99999999-0006-4000-8000-000000000006",
        productId: products[9].id,
        sellerUserId: "seed-seller-yaw",
        buyerUserId: "seed-buyer-kojo",
        rating: 4,
        comment: "Maize seed packs arrived intact. Good communication from the seller.",
      },
    ];

    for (const review of reviewsData) {
      await client.query(
        `
          insert into reviews (
            id, order_id, product_id, seller_user_id, buyer_user_id, rating, comment, created_at
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8)
          on conflict (order_id, product_id, buyer_user_id) do update set
            seller_user_id = excluded.seller_user_id,
            rating = excluded.rating,
            comment = excluded.comment,
            created_at = excluded.created_at
        `,
        [
          review.id,
          review.orderId,
          review.productId,
          review.sellerUserId,
          review.buyerUserId,
          review.rating,
          review.comment,
          now,
        ]
      );
    }

    await client.query(
      `
        insert into consultation_requests (
          id, service_id, requester_user_id, message, status, scheduled_for,
          meeting_url, meeting_notes, meeting_provider, created_at
        )
        values
          (
            'dddddddd-0001-4000-8000-000000000001',
            $1,
            'seed-buyer-kojo',
            'Tomato leaves are yellowing after recent rains. Need advice before next harvest.',
            'scheduled',
            $3,
            'https://meet.google.com/gma-rket-demo',
            'Bring photos of affected leaves and details of recent spraying.',
            'google_meet',
            $5
          ),
          (
            'dddddddd-0002-4000-8000-000000000002',
            $2,
            'seed-seller-akua',
            'Planning next season fertilizer purchases for tomatoes and carrots.',
            'accepted',
            null,
            null,
            null,
            null,
            $5
          ),
          (
            'dddddddd-0003-4000-8000-000000000003',
            $1,
            'seed-buyer-kojo',
            'Reviewed post-rain disease control steps.',
            'completed',
            $4,
            'https://meet.google.com/gma-rket-past',
            'Follow-up after two weeks if symptoms continue.',
            'google_meet',
            $5
          )
        on conflict (id) do update set
          service_id = excluded.service_id,
          requester_user_id = excluded.requester_user_id,
          message = excluded.message,
          status = excluded.status,
          scheduled_for = excluded.scheduled_for,
          meeting_url = excluded.meeting_url,
          meeting_notes = excluded.meeting_notes,
          meeting_provider = excluded.meeting_provider
      `,
      [expertServices[0].id, expertServices[1].id, scheduledFor, completedAt, now]
    );

    const futureLater = new Date(Date.now() + 1000 * 60 * 60 * 72);
    const completedEarlier = new Date(Date.now() - 1000 * 60 * 60 * 96);
    const consultationRows = [
      {
        id: "dddddddd-0004-4000-8000-000000000004",
        serviceId: expertServices[3].id,
        requesterUserId: "seed-seller-yaw",
        message:
          "We want a dry season irrigation plan for two acres of mango seedlings and vegetables.",
        status: "pending",
        scheduledFor: null,
        meetingUrl: null,
        meetingNotes: null,
        meetingProvider: null,
      },
      {
        id: "dddddddd-0005-4000-8000-000000000005",
        serviceId: expertServices[4].id,
        requesterUserId: "seed-buyer-ama",
        message:
          "Need help comparing wholesale supply options and delivery costs for restaurant buyers.",
        status: "scheduled",
        scheduledFor: futureLater,
        meetingUrl: "https://meet.google.com/gma-market-access",
        meetingNotes: "Prepare recent order volumes and preferred delivery days.",
        meetingProvider: "google_meet",
      },
      {
        id: "dddddddd-0006-4000-8000-000000000006",
        serviceId: expertServices[5].id,
        requesterUserId: "seed-seller-yaw",
        message:
          "Some layers are showing appetite loss. Need guidance before it spreads.",
        status: "accepted",
        scheduledFor: null,
        meetingUrl: null,
        meetingNotes: null,
        meetingProvider: null,
      },
      {
        id: "dddddddd-0007-4000-8000-000000000007",
        serviceId: expertServices[6].id,
        requesterUserId: "seed-seller-abena",
        message:
          "We lost cassava quality during storage last month and need a better handling process.",
        status: "completed",
        scheduledFor: completedEarlier,
        meetingUrl: "https://meet.google.com/gma-storage-demo",
        meetingNotes: "Use raised pallets and separate high-moisture roots before packing.",
        meetingProvider: "google_meet",
      },
      {
        id: "dddddddd-0008-4000-8000-000000000008",
        serviceId: expertServices[7].id,
        requesterUserId: "seed-buyer-kojo",
        message:
          "Our vegetable supplier has leaf damage and we need to understand if supply will be affected.",
        status: "rejected",
        scheduledFor: null,
        meetingUrl: null,
        meetingNotes: null,
        meetingProvider: null,
      },
    ];

    for (const request of consultationRows) {
      await client.query(
        `
          insert into consultation_requests (
            id, service_id, requester_user_id, message, status, scheduled_for,
            meeting_url, meeting_notes, meeting_provider, created_at
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          on conflict (id) do update set
            service_id = excluded.service_id,
            requester_user_id = excluded.requester_user_id,
            message = excluded.message,
            status = excluded.status,
            scheduled_for = excluded.scheduled_for,
            meeting_url = excluded.meeting_url,
            meeting_notes = excluded.meeting_notes,
            meeting_provider = excluded.meeting_provider
        `,
        [
          request.id,
          request.serviceId,
          request.requesterUserId,
          request.message,
          request.status,
          request.scheduledFor,
          request.meetingUrl,
          request.meetingNotes,
          request.meetingProvider,
          now,
        ]
      );
    }

    const notifications = [
      {
        id: "eeeeeeee-0001-4000-8000-000000000001",
        userId: "seed-seller-akua",
        type: "order_created",
        title: "New Order",
        body: "Boateng Retail Foods placed an order for tomatoes and carrots.",
        metadata: { orderId: "99999999-0001-4000-8000-000000000001" },
      },
      {
        id: "eeeeeeee-0002-4000-8000-000000000002",
        userId: "seed-buyer-kojo",
        type: "request_scheduled",
        title: "Consultation Scheduled",
        body: "Dr. Efua Ansah scheduled your crop diagnosis consultation.",
        metadata: { requestId: "dddddddd-0001-4000-8000-000000000001" },
      },
      {
        id: "eeeeeeee-0003-4000-8000-000000000003",
        userId: "seed-expert-efua",
        type: "consultation_request",
        title: "New Consultation Request",
        body: "Akua Fresh Farms requested soil fertility planning.",
        metadata: { requestId: "dddddddd-0002-4000-8000-000000000002" },
      },
      {
        id: "eeeeeeee-0004-4000-8000-000000000004",
        userId: "seed-seller-yaw",
        type: "order_created",
        title: "Cocoa order fulfilled",
        body: "Accra Chop Bar Supplies reviewed your premium cocoa beans order.",
        metadata: { orderId: "99999999-0004-4000-8000-000000000004" },
      },
      {
        id: "eeeeeeee-0005-4000-8000-000000000005",
        userId: "seed-expert-kwame",
        type: "consultation_request",
        title: "New irrigation request",
        body: "Yaw Grains Cooperative requested dry season irrigation support.",
        metadata: { requestId: "dddddddd-0004-4000-8000-000000000004" },
      },
      {
        id: "eeeeeeee-0006-4000-8000-000000000006",
        userId: "seed-buyer-ama",
        type: "request_scheduled",
        title: "Market access consultation scheduled",
        body: "Kwame Owusu scheduled your farm business consultation.",
        metadata: { requestId: "dddddddd-0005-4000-8000-000000000005" },
      },
      {
        id: "eeeeeeee-0007-4000-8000-000000000007",
        userId: "seed-seller-abena",
        type: "request_completed",
        title: "Storage plan completed",
        body: "Nana Yeboah completed your storage loss reduction consultation.",
        metadata: { requestId: "dddddddd-0007-4000-8000-000000000007" },
      },
    ];

    for (const notification of notifications) {
      await client.query(
        `
          insert into notifications (id, user_id, type, title, body, metadata, read_at, created_at)
          values ($1, $2, $3, $4, $5, $6, null, $7)
          on conflict (id) do update set
            user_id = excluded.user_id,
            type = excluded.type,
            title = excluded.title,
            body = excluded.body,
            metadata = excluded.metadata,
            read_at = null
        `,
        [
          notification.id,
          notification.userId,
          notification.type,
          notification.title,
          notification.body,
          JSON.stringify(notification.metadata),
          now,
        ]
      );
    }

    await client.query(
      `
        insert into conversations (
          id, context_type, order_id, consultation_request_id,
          participant_one_id, participant_two_id, created_at, updated_at
        )
        values
          (
            'fafafafa-0001-4000-8000-000000000001',
            'order',
            '99999999-0002-4000-8000-000000000002',
            null,
            'seed-buyer-kojo',
            'seed-seller-akua',
            $1,
            $1
          ),
          (
            'fafafafa-0002-4000-8000-000000000002',
            'consultation',
            null,
            'dddddddd-0001-4000-8000-000000000001',
            'seed-buyer-kojo',
            'seed-expert-efua',
            $1,
            $1
          ),
          (
            'fafafafa-0003-4000-8000-000000000003',
            'order',
            '99999999-0004-4000-8000-000000000004',
            null,
            'seed-buyer-ama',
            'seed-seller-yaw',
            $1,
            $1
          ),
          (
            'fafafafa-0004-4000-8000-000000000004',
            'order',
            '99999999-0006-4000-8000-000000000006',
            null,
            'seed-buyer-kojo',
            'seed-seller-abena',
            $1,
            $1
          ),
          (
            'fafafafa-0005-4000-8000-000000000005',
            'consultation',
            null,
            'dddddddd-0005-4000-8000-000000000005',
            'seed-buyer-ama',
            'seed-expert-kwame',
            $1,
            $1
          ),
          (
            'fafafafa-0006-4000-8000-000000000006',
            'consultation',
            null,
            'dddddddd-0007-4000-8000-000000000007',
            'seed-seller-abena',
            'seed-expert-nana',
            $1,
            $1
          )
        on conflict (id) do update set
          context_type = excluded.context_type,
          order_id = excluded.order_id,
          consultation_request_id = excluded.consultation_request_id,
          participant_one_id = excluded.participant_one_id,
          participant_two_id = excluded.participant_two_id,
          updated_at = excluded.updated_at
      `,
      [now]
    );

    const messages = [
      {
        id: "fbfbfbfb-0001-4000-8000-000000000001",
        conversationId: "fafafafa-0001-4000-8000-000000000001",
        senderUserId: "seed-buyer-kojo",
        body: "Hi Akua, can the plantain delivery arrive before Friday morning?",
      },
      {
        id: "fbfbfbfb-0002-4000-8000-000000000002",
        conversationId: "fafafafa-0001-4000-8000-000000000001",
        senderUserId: "seed-seller-akua",
        body: "Yes, I can dispatch it Thursday afternoon and share tracking.",
      },
      {
        id: "fbfbfbfb-0003-4000-8000-000000000003",
        conversationId: "fafafafa-0002-4000-8000-000000000002",
        senderUserId: "seed-expert-efua",
        body: "Please send close-up photos of the tomato leaves before our call.",
      },
      {
        id: "fbfbfbfb-0004-4000-8000-000000000004",
        conversationId: "fafafafa-0003-4000-8000-000000000003",
        senderUserId: "seed-buyer-ama",
        body: "The cocoa sacks arrived yesterday. Can we reserve the same quantity for next week?",
      },
      {
        id: "fbfbfbfb-0005-4000-8000-000000000005",
        conversationId: "fafafafa-0003-4000-8000-000000000003",
        senderUserId: "seed-seller-yaw",
        body: "Yes, I can hold two sacks and include delivery to Kaneshie.",
      },
      {
        id: "fbfbfbfb-0006-4000-8000-000000000006",
        conversationId: "fafafafa-0004-4000-8000-000000000004",
        senderUserId: "seed-seller-abena",
        body: "Thank you for the cassava order. I can supply larger crates next month.",
      },
      {
        id: "fbfbfbfb-0007-4000-8000-000000000007",
        conversationId: "fafafafa-0005-4000-8000-000000000005",
        senderUserId: "seed-expert-kwame",
        body: "Bring your current delivery routes and wholesale price list to the call.",
      },
      {
        id: "fbfbfbfb-0008-4000-8000-000000000008",
        conversationId: "fafafafa-0006-4000-8000-000000000006",
        senderUserId: "seed-expert-nana",
        body: "I added storage steps in the meeting notes. The biggest fix is airflow before packing.",
      },
    ];

    for (const message of messages) {
      await client.query(
        `
          insert into messages (id, conversation_id, sender_user_id, body, created_at)
          values ($1, $2, $3, $4, $5)
          on conflict (id) do update set
            conversation_id = excluded.conversation_id,
            sender_user_id = excluded.sender_user_id,
            body = excluded.body,
            created_at = excluded.created_at
        `,
        [message.id, message.conversationId, message.senderUserId, message.body, now]
      );
    }

    await client.query("commit");

    console.log("Seed complete.");
    console.log("Demo password:", password);
    for (const demoUser of users) {
      console.log(`${demoUser.role.padEnd(6)} ${demoUser.email}`);
    }
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
