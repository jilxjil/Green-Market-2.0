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
] as const;

const profileIds = {
  admin: "11111111-1111-4111-8111-111111111111",
  seller: "22222222-2222-4222-8222-222222222222",
  buyer: "33333333-3333-4333-8333-333333333333",
  expert: "44444444-4444-4444-8444-444444444444",
};

const products = [
  {
    id: "aaaaaaaa-0001-4000-8000-000000000001",
    title: "Organic Tomatoes",
    description:
      "Freshly harvested tomatoes from Nsawam, packed for market stalls and restaurants.",
    category: "Vegetables",
    price: 35,
    unitOfMeasure: "kg",
    stockQuantity: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80",
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
      "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=900&q=80",
    status: "active",
  },
  {
    id: "aaaaaaaa-0003-4000-8000-000000000003",
    title: "Garden Eggs",
    description:
      "Firm garden eggs suitable for stews, soups, and retail produce baskets.",
    category: "Vegetables",
    price: 22,
    unitOfMeasure: "kg",
    stockQuantity: 64,
    imageUrl:
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=900&q=80",
    status: "active",
  },
  {
    id: "aaaaaaaa-0004-4000-8000-000000000004",
    title: "Fresh Maize",
    description:
      "New season maize, sorted and bundled for food processors and vendors.",
    category: "Grains",
    price: 40,
    unitOfMeasure: "sack",
    stockQuantity: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=80",
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
      "https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&w=900&q=80",
    status: "active",
  },
];

const expertServices = [
  {
    id: "bbbbbbbb-0001-4000-8000-000000000001",
    title: "Crop Disease Diagnosis",
    description:
      "Share crop symptoms and photos, then get practical treatment and prevention guidance.",
    price: 120,
    durationMinutes: 60,
  },
  {
    id: "bbbbbbbb-0002-4000-8000-000000000002",
    title: "Soil Fertility Planning",
    description:
      "Plan fertilizer, compost, and rotation decisions based on your crop and location.",
    price: 150,
    durationMinutes: 75,
  },
  {
    id: "bbbbbbbb-0003-4000-8000-000000000003",
    title: "Post-Harvest Handling Review",
    description:
      "Improve storage, sorting, and packaging to reduce losses before market delivery.",
    price: 90,
    durationMinutes: 45,
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

    for (const product of products) {
      await client.query(
        `
          insert into products (
            id, seller_id, title, description, category, price, unit_of_measure,
            stock_quantity, image_url, status, created_at
          )
          values ($1, 'seed-seller-akua', $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
          values ($1, 'seed-expert-efua', $2, $3, $4, $5, null, $6)
          on conflict (id) do update set
            expert_user_id = excluded.expert_user_id,
            title = excluded.title,
            description = excluded.description,
            price = excluded.price,
            duration_minutes = excluded.duration_minutes,
            archived_at = null
        `,
        [service.id, service.title, service.description, service.price, service.durationMinutes, now]
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
          )
        on conflict (id) do update set
          buyer_id = excluded.buyer_id,
          total_amount = excluded.total_amount,
          status = excluded.status,
          shipping_address = excluded.shipping_address,
          fulfillment_status = excluded.fulfillment_status,
          tracking_number = excluded.tracking_number
      `,
      [profileIds.buyer, now]
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
            'Planning next season fertilizer purchases for tomatoes and garden eggs.',
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

    const notifications = [
      {
        id: "eeeeeeee-0001-4000-8000-000000000001",
        userId: "seed-seller-akua",
        type: "order_created",
        title: "New Order",
        body: "Boateng Retail Foods placed an order for tomatoes and garden eggs.",
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
