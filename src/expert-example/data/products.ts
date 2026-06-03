

import { Product } from '../types';


// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
const originalProducts: Product[] = [
 
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    price: 4.99,
    category: "vegetables",
    image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg",
    images: [
      "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg",
      "https://images.pexels.com/photos/2899682/pexels-photo-2899682.jpeg",
      "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg"
    ],
    description: "Locally grown organic tomatoes, perfect for salads and cooking.",
    rating: 4.5,
    stock: 50,
    unit: "kg",
    minOrder: 1,
    maxOrder: 10,
    seller: {
      id: "GFG001",
      name: "Green Farms Ghana",
      rating: 4.8,
      profilePicture: "https://images.unsplash.com/photo-1507914372368-b2b085b925a1",
      location: "Aburi, Eastern Region",
      contactNumber: "+233 20 500 3251"
    },
    traceability: {
      farmName: "Green Farms",
      location: "Aburi, Eastern Region",
      harvestDate: "2023-10-15",
      farmingMethod: "Organic",
      carbonFootprint: "Low - 0.5kg CO2/kg",
      transportMethod: "Local Delivery",
      distributionCenter: "Accra Distribution Hub",
      soilType: "Rich Loamy Soil",
      waterSource: "Natural Spring",
      pesticides: "None - Organic Farming",
      batchNumber: "TOM-2023-1015",
      packagingDate: "2023-10-16",
      qualityCertification: "Organic Certified, Food Safety Certified",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TOM-2023-1015",
    
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Accra Central Market",
        coordinates: {
          lat: 5.5502,
          lng: -0.2174
        }
      },
      standardDelivery: {
        cost: 10,
        estimatedTime: "2-3 days",
        available: true,
        restrictions: "Delivery within Greater Accra only"
      },
      expressDelivery: {
        cost: 20,
        estimatedTime: "Same day",
        available: true,
        restrictions: "Order before 2 PM for same-day delivery"
      }
    },
    ratings: {
      average: 4.5,
      reviews: [
        {
          id: "REV001",
          user: {
            id: "USR001",
            name: "John D.",
            image: "https://images.pexels.com/photos/5529599/pexels-photo-5529599.jpeg"
          },
          rating: 5,
          comment: "Very fresh and tasty tomatoes!",
          date: "2023-10-20"
        }
      ]
    },
    nutritionalValue: {
      calories: "18 kcal",
      carbohydrates: "3.9g",
      protein: "0.9g"
    },
    storageInstructions: "Store in a cool, dry place. Best consumed within 5 days.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: true,
      acceptsPaypal: true
    },
    discounts: {
      bulk: {
        minQuantity: 5,
        percentage: 10
      },
      seasonal: false,
      promoCode: "FRESH10"
    }
  },
  {
    id: 2,
    name: "Premium Cocoa Beans",
    price: 12.99,
    category: "cash-crops",
    image: "https://images.pexels.com/photos/867466/pexels-photo-867466.jpeg",
    images: [
      "https://images.pexels.com/photos/867466/pexels-photo-867466.jpeg",
      "https://images.pexels.com/photos/867465/pexels-photo-867465.jpeg",
      "https://images.pexels.com/photos/867464/pexels-photo-867464.jpeg"
    ],
    description: "High-quality Ghanaian cocoa beans, perfect for chocolate making and confectionery.",
    rating: 4.9,
    stock: 200,
    unit: "kg",
    minOrder: 5,
    maxOrder: 50,
    seller: {
      id: "CCF002",
      name: "Cocoa Cooperative Farms",
      rating: 4.9,
      profilePicture: "https://images.pexels.com/photos/2382596/pexels-photo-2382596.jpeg",
      location: "Kumasi, Ashanti Region",
      contactNumber: "+233 24 555 7890"
    },
    traceability: {
      farmName: "Cocoa Cooperative Farms",
      location: "Kumasi, Ashanti Region",
      harvestDate: "2023-09-15",
      farmingMethod: "Traditional",
      carbonFootprint: "Medium - 1.2kg CO2/kg",
      transportMethod: "Refrigerated Transport",
      distributionCenter: "Kumasi Export Hub",
      soilType: "Forest Soil",
      waterSource: "Rainfall",
      pesticides: "Minimal Usage",
      batchNumber: "CCB-2023-0915",
      packagingDate: "2023-09-20",
      qualityCertification: "Fair Trade Certified, Export Grade A",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CCB-2023-0915",
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Kumasi Central",
        coordinates: {
          lat: 6.6885,
          lng: -1.6244
        }
      },
      standardDelivery: {
        cost: 15,
        estimatedTime: "3-5 days",
        available: true,
        restrictions: "Minimum order 5kg required"
      },
      expressDelivery: {
        cost: 30,
        estimatedTime: "1-2 days",
        available: true,
        restrictions: "Subject to availability"
      }
    },
    ratings: {
      average: 4.9,
      reviews: [
        {
          id: "REV002",
          user: {
            id: "USR002",
            name: "Michael K.",
            image: "https://images.pexels.com/photos/5529600/pexels-photo-5529600.jpeg"
          },
          rating: 5,
          comment: "Excellent quality cocoa beans!",
          date: "2023-09-25"
        }
      ]
    },
    nutritionalValue: {
      calories: "228 kcal",
      carbohydrates: "57.9g",
      protein: "19.6g"
    },
    storageInstructions: "Store in a cool, dry place. Best used within 6 months.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: false,
      acceptsPaypal: true
    },
    discounts: {
      bulk: {
        minQuantity: 20,
        percentage: 15
      },
      seasonal: true,
      promoCode: "COCOA15"
    }
  },
  {
    id: 3,
    name: "Fresh Pineapples",
    price: 3.99,
    category: "fruits",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba",
    images: [
      "https://images.pexels.com/photos/2469772/pexels-photo-2469772.jpeg",
      "https://images.pexels.com/photos/1161547/pexels-photo-1161547.jpeg",
      "https://images.pexels.com/photos/947879/pexels-photo-947879.jpeg"
    ],
    description: "Sweet and juicy pineapples from the coastal regions of Ghana.",
    rating: 4.7,
    stock: 150,
    unit: "piece",
    minOrder: 2,
    maxOrder: 20,
    seller: {
      id: "TPF003",
      name: "Tropical Paradise Farms",
      rating: 4.7,
      profilePicture: "https://images.pexels.com/photos/2382597/pexels-photo-2382597.jpeg",
      location: "Cape Coast, Central Region",
      contactNumber: "+233 27 888 9012"
    },
    traceability: {
      farmName: "Tropical Paradise Farms",
      location: "Cape Coast, Central Region",
      harvestDate: "2023-10-20",
      farmingMethod: "Sustainable",
      carbonFootprint: "Low - 0.3kg CO2/kg",
      transportMethod: "Local Distribution",
      distributionCenter: "Cape Coast Hub",
      soilType: "Sandy Loam",
      waterSource: "Drip Irrigation",
      pesticides: "Organic Methods",
      batchNumber: "PIN-2023-1020",
      packagingDate: "2023-10-21",
      qualityCertification: "Organic Certified",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TOM-2023-1015"
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Cape Coast Market",
        coordinates: {
          lat: 5.1315,
          lng: -1.2795
        }
      },
      standardDelivery: {
        cost: 8,
        estimatedTime: "1-2 days",
        available: true,
        restrictions: "Coastal region delivery only"
      },
      expressDelivery: {
        cost: 15,
        estimatedTime: "Same day",
        available: true,
        restrictions: "Order before 12 PM"
      }
    },
    ratings: {
      average: 4.7,
      reviews: [
        {
          id: "REV003",
          user: {
            id: "USR003",
            name: "Sarah A.",
            image: "https://images.pexels.com/photos/5529601/pexels-photo-5529601.jpeg"
          },
          rating: 5,
          comment: "Sweetest pineapples I've ever tasted!",
          date: "2023-10-25"
        }
      ]
    },
    nutritionalValue: {
      calories: "50 kcal",
      carbohydrates: "13g",
      protein: "0.5g"
    },
    storageInstructions: "Store at room temperature until ripe, then refrigerate. Best consumed within 5 days.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: true,
      acceptsPaypal: false
    },
    discounts: {
      bulk: {
        minQuantity: 10,
        percentage: 12
      },
      seasonal: true,
      promoCode: "SWEET12"
    }
  },
  {
    id: 4,
    name: "Organic Potatoes",
    price: 5.99,
    category: "root-crops",
    image: "https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg",
    images: [
      "https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg",
      "https://images.pexels.com/photos/31202393/pexels-photo-31202393/free-photo-of-farmer-s-hand-holding-fresh-potatoes-in-field.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/7129145/pexels-photo-7129145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    description: "Fresh, high-quality cassava roots from local farms.",
    rating: 4.6,
    stock: 200,
    unit: "kg",
    minOrder: 5,
    maxOrder: 50,
    seller: {
      id: "CRF004",
      name: "Root Farms",
      rating: 4.7,
      profilePicture: "https://images.pexels.com/photos/2382600/pexels-photo-2382600.jpeg",
      location: "Ho, Volta Region",
      contactNumber: "+233 24 444 5678"
    },
    traceability: {
      farmName: "Volta Roots Farm",
      location: "Ho, Volta Region",
      harvestDate: "2023-10-25",
      farmingMethod: "Organic",
      carbonFootprint: "Low - 0.4kg CO2/kg",
      transportMethod: "Local Transport",
      distributionCenter: "Ho Distribution Center",
      soilType: "Sandy Loam",
      waterSource: "Natural Rainfall",
      pesticides: "None",
      batchNumber: "CAS-2023-1025",
      packagingDate: "2023-10-26",
      qualityCertification: "Organic Certified",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CAS-2023-1025"
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Ho Central Market",
        coordinates: {
          lat: 6.6000,
          lng: 0.4667
        }
      },
      standardDelivery: {
        cost: 12,
        estimatedTime: "2-3 days",
        available: true,
        restrictions: "Volta Region delivery only"
      },
      expressDelivery: {
        cost: 25,
        estimatedTime: "Next day",
        available: true,
        restrictions: "Order before 2 PM"
      }
    },
    ratings: {
      average: 4.6,
      reviews: [
        {
          id: "REV004",
          user: {
            id: "USR004",
            name: "Emmanuel K.",
            image: "https://images.pexels.com/photos/2382605/pexels-photo-2382605.jpeg"
          },
          rating: 5,
          comment: "Very fresh potatoes, excellent quality!",
          date: "2023-10-28"
        }
      ]
    },
    nutritionalValue: {
      calories: "160 kcal",
      carbohydrates: "38g",
      protein: "1.4g"
    },
    storageInstructions: "Store in a cool, dry place. Best used within 3-4 days.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: true,
      acceptsPaypal: false
    },
    discounts: {
      bulk: {
        minQuantity: 25,
        percentage: 15
      },
      seasonal: true,
      promoCode: "ROOTS15"
    }
  },
  {
    id: 5,
    name: "Premium Rice Seeds",
    price: 19.99,
    category: "farm-supplies",
    image: "https://images.pexels.com/photos/18446086/pexels-photo-18446086/free-photo-of-close-up-of-seeds.jpeg?auto=compress&cs=tinysrgb&w=1200",
    images: [
      "https://images.pexels.com/photos/18446086/pexels-photo-18446086/free-photo-of-close-up-of-seeds.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/7421204/pexels-photo-7421204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/7420889/pexels-photo-7420889.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    description: "High-yield rice seeds perfect for Ghana's climate.",
    rating: 4.8,
    stock: 1000,
    unit: "kg",
    minOrder: 10,
    maxOrder: 200,
    seller: {
      id: "RSD005",
      name: "Rice Seed Distributors",
      rating: 4.9,
      profilePicture: "https://images.pexels.com/photos/2382601/pexels-photo-2382601.jpeg",
      location: "Tamale, Northern Region",
      contactNumber: "+233 20 777 8901"
    },
    traceability: {
      farmName: "Northern Seeds Farm",
      location: "Tamale, Northern Region",
      harvestDate: "2023-09-15",
      farmingMethod: "Modern",
      carbonFootprint: "Medium - 0.7kg CO2/kg",
      transportMethod: "Climate Controlled",
      distributionCenter: "Tamale Agri Hub",
      soilType: "Various",
      waterSource: "Irrigation",
      pesticides: "Controlled Usage",
      batchNumber: "RSE-2023-0915",
      packagingDate: "2023-09-16",
      qualityCertification: "GSA Certified, Quality Seeds",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RSE-2023-0915"
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Tamale Agri Center",
        coordinates: {
          lat: 9.4037,
          lng: -0.8384
        }
      },
      standardDelivery: {
        cost: 20,
        estimatedTime: "3-4 days",
        available: true,
        restrictions: "Nationwide delivery"
      },
      expressDelivery: {
        cost: 35,
        estimatedTime: "1-2 days",
        available: true,
        restrictions: "Subject to location"
      }
    },
    ratings: {
      average: 4.8,
      reviews: [
        {
          id: "REV005",
          user: {
            id: "USR005",
            name: "Ibrahim M.",
            image: "https://images.pexels.com/photos/2382606/pexels-photo-2382606.jpeg"
          },
          rating: 5,
          comment: "Excellent germination rate!",
          date: "2023-10-01"
        }
      ]
    },
    nutritionalValue: {
      calories: "N/A",
      carbohydrates: "N/A",
      protein: "N/A"
    },
    storageInstructions: "Store in a cool, dry place. Viable for planting within 6 months.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: false,
      acceptsPaypal: true
    },
    discounts: {
      bulk: {
        minQuantity: 50,
        percentage: 20
      },
      seasonal: true,
      promoCode: "PLANT20"
    }
  },
  {
    id: 6,
    name: "Organic Plantain",
    price: 7.99,
    category: "fruits",
    image: "https://images.pexels.com/photos/6164987/pexels-photo-6164987.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    images: [
      "https://images.pexels.com/photos/10039795/pexels-photo-10039795.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/6141487/pexels-photo-6141487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/5472398/pexels-photo-5472398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    description: "Fresh, organic plantains from sustainable farms.",
    rating: 4.7,
    stock: 300,
    unit: "bunch",
    minOrder: 1,
    maxOrder: 15,
    seller: {
      id: "OPF006",
      name: "Organic Plantain Farms",
      rating: 4.8,
      profilePicture: "https://images.pexels.com/photos/2382602/pexels-photo-2382602.jpeg",
      location: "Koforidua, Eastern Region",
      contactNumber: "+233 24 666 7890"
    },
    traceability: {
      farmName: "Eastern Organic Farms",
      location: "Koforidua, Eastern Region",
      harvestDate: "2023-10-28",
      farmingMethod: "Organic",
      carbonFootprint: "Low - 0.3kg CO2/kg",
      transportMethod: "Local Distribution",
      distributionCenter: "Koforidua Hub",
      soilType: "Rich Loam",
      waterSource: "Natural Spring",
      pesticides: "None",
      batchNumber: "PLT-2023-1028",
      packagingDate: "2023-10-29",
      qualityCertification: "Organic Certified",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PLT-2023-1028"
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Koforidua Market",
        coordinates: {
          lat: 6.0941,
          lng: -0.2601
        }
      },
      standardDelivery: {
        cost: 10,
        estimatedTime: "1-2 days",
        available: true,
        restrictions: "Eastern Region delivery"
      },
      expressDelivery: {
        cost: 20,
        estimatedTime: "Same day",
        available: true,
        restrictions: "Within Koforidua only"
      }
    },
    ratings: {
      average: 4.7,
      reviews: [
        {
          id: "REV006",
          user: {
            id: "USR006",
            name: "Grace A.",
            image: "https://images.pexels.com/photos/2382607/pexels-photo-2382607.jpeg"
          },
          rating: 5,
          comment: "Perfect ripeness and quality!",
          date: "2023-10-30"
        }
      ]
    },
    nutritionalValue: {
      calories: "122 kcal",
      carbohydrates: "32g",
      protein: "1g"
    },
    storageInstructions: "Store at room temperature until ripe. Best consumed within 7 days.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: true,
      acceptsPaypal: false
    },
    discounts: {
      bulk: {
        minQuantity: 8,
        percentage: 10
      },
      seasonal: false,
      promoCode: "PLANT10"
    }
  },
  {
    id: 7,
    name: "Premium Maize Seeds",
    price: 14.99,
    category: "farm-supplies",
    image: "https://images.pexels.com/photos/14321952/pexels-photo-14321952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    images: [
      "https://images.pexels.com/photos/14321952/pexels-photo-14321952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/4426580/pexels-photo-4426580.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/18420805/pexels-photo-18420805/free-photo-of-corn-growing-in-field.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ],
    description: "High-yield maize seeds suitable for Ghana's climate.",
    rating: 4.9,
    stock: 500,
    unit: "kg",
    minOrder: 5,
    maxOrder: 100,
    seller: {
      id: "MSD007",
      name: "Maize Seed Distributors",
      rating: 4.9,
      profilePicture: "https://images.pexels.com/photos/2382603/pexels-photo-2382603.jpeg",
      location: "Techiman, Bono East Region",
      contactNumber: "+233 20 999 0123"
    },
    traceability: {
      farmName: "Techiman Seed Farm",
      location: "Techiman, Bono East Region",
      harvestDate: "2023-09-20",
      farmingMethod: "Modern",
      carbonFootprint: "Low - 0.4kg CO2/kg",
      transportMethod: "Climate Controlled",
      distributionCenter: "Techiman Agri Hub",
      soilType: "Various",
      waterSource: "Irrigation",
      pesticides: "Minimal Usage",
      batchNumber: "MZE-2023-0920",
      packagingDate: "2023-09-21",
      qualityCertification: "GSA Certified",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MZE-2023-0920"
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Techiman Agri Center",
        coordinates: {
          lat: 7.5907,
          lng: -1.9343
        }
      },
      standardDelivery: {
        cost: 15,
        estimatedTime: "2-3 days",
        available: true,
        restrictions: "Nationwide delivery"
      },
      expressDelivery: {
        cost: 30,
        estimatedTime: "Next day",
        available: true,
        restrictions: "Subject to location"
      }
    },
    ratings: {
      average: 4.9,
      reviews: [
        {
          id: "REV007",
          user: {
            id: "USR007",
            name: "Kwame O.",
            image: "https://images.pexels.com/photos/2382608/pexels-photo-2382608.jpeg"
          },
          rating: 5,
          comment: "Best maize seeds I've used!",
          date: "2023-10-15"
        }
      ]
    },
    nutritionalValue: {
      calories: "N/A",
      carbohydrates: "N/A",
      protein: "N/A"
    },
    storageInstructions: "Store in a cool, dry place. Viable for planting within 8 months.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: false,
      acceptsPaypal: true
    },
    discounts: {
      bulk: {
        minQuantity: 30,
        percentage: 15
      },
      seasonal: true,
      promoCode: "MAIZE15"
    }
  },
  {
    id: 8,
    name: "Fresh Carrots",
    price: 3.99,
    category: "vegetables",
    image: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg",
    images: [
      "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg",
      "https://images.pexels.com/photos/37641/carrots-basket-vegetables-market-37641.jpeg",
      "https://images.pexels.com/photos/1306559/pexels-photo-1306559.jpeg"
    ],
    description: "Fresh, organic carrots grown in the fertile soils of Ghana.",
    rating: 4.6,
    stock: 150,
    unit: "kg",
    minOrder: 1,
    maxOrder: 20,
    seller: {
      id: "VOF008",
      name: "Valley Organic Farms",
      rating: 4.7,
      profilePicture: "https://images.pexels.com/photos/2382604/pexels-photo-2382604.jpeg",
      location: "Akropong, Eastern Region",
      contactNumber: "+233 24 111 2345"
    },
    traceability: {
      farmName: "Valley Organic Farms",
      location: "Akropong, Eastern Region",
      harvestDate: "2023-10-20",
      farmingMethod: "Sustainable",
      carbonFootprint: "Low - 0.3kg CO2/kg",
      transportMethod: "Local Distribution",
      distributionCenter: "Cape Coast Hub",
      soilType: "Sandy Loam",
      waterSource: "Drip Irrigation",
      pesticides: "Organic Methods",
      batchNumber: "PIN-2023-1020",
      packagingDate: "2023-10-21",
      qualityCertification: "Organic Certified",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TOM-2023-1015"
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Cape Coast Market",
        coordinates: {
          lat: 5.1315,
          lng: -1.2795
        }
      },
      standardDelivery: {
        cost: 8,
        estimatedTime: "1-2 days",
        available: true,
        restrictions: "Coastal region delivery only"
      },
      expressDelivery: {
        cost: 15,
        estimatedTime: "Same day",
        available: true,
        restrictions: "Order before 12 PM"
      }
    },
    ratings: {
      average: 4.7,
      reviews: [
        {
          id: "REV008",
          user: {
            id: "USR008",
            name: "Ama Mensah",
            image: "https://images.pexels.com/photos/2382609/pexels-photo-2382609.jpeg"
          },
          rating: 5,
          comment: "They're sweet enough to go in dishes like carrot cake, but savory enough to go well in a stew.",
          date: "2023-10-25"
        }
      ]
    },
    nutritionalValue: {
      calories: "50 kcal",
      carbohydrates: "13g",
      protein: "0.5g"
    },
    storageInstructions: "Store at room temperature until ripe, then refrigerate. Best consumed within 5 days.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: true,
      acceptsPaypal: false
    },
    discounts: {
      bulk: {
        minQuantity: 10,
        percentage: 12
      },
      seasonal: true,
      promoCode: "SWEET12"
    }
  },
  {
    id: 9,
    name: "Sweet Grapes",
    price: 8.99,
    category: "fruits",
    image: "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg",
    images: [
      "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg",
      "https://images.pexels.com/photos/760281/pexels-photo-760281.jpeg",
      "https://images.pexels.com/photos/23042/pexels-photo.jpg"
    ],
    description: "Premium table grapes, perfect for snacking and fruit salads.",
    rating: 4.8,
    stock: 100,
    unit: "kg",
    minOrder: 1,
    maxOrder: 10,
    seller: {
      id: "VOF008",
      name: "Valley Organic Farms",
      rating: 4.7,
      profilePicture: "https://images.pexels.com/photos/2382604/pexels-photo-2382604.jpeg",
      location: "Akropong, Eastern Region",
      contactNumber: "+233 24 111 2345"
    },
    traceability: {
      farmName: "Valley Organic Farms",
      location: "Akropong, Eastern Region",
      harvestDate: "2023-10-20",
      farmingMethod: "Sustainable",
      carbonFootprint: "Low - 0.3kg CO2/kg",
      transportMethod: "Local Distribution",
      distributionCenter: "Cape Coast Hub",
      soilType: "Sandy Loam",
      waterSource: "Drip Irrigation",
      pesticides: "Organic Methods",
      batchNumber: "PIN-2023-1020",
      packagingDate: "2023-10-21",
      qualityCertification: "Organic Certified",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TOM-2023-1015"
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Cape Coast Market",
        coordinates: {
          lat: 5.1315,
          lng: -1.2795
        }
      },
      standardDelivery: {
        cost: 8,
        estimatedTime: "1-2 days",
        available: true,
        restrictions: "Coastal region delivery only"
      },
      expressDelivery: {
        cost: 15,
        estimatedTime: "Same day",
        available: true,
        restrictions: "Order before 12 PM"
      }
    },
    ratings: {
      average: 4.7,
      reviews: [
        {
          id: "REV009",
          user: {
            id: "USR009",
            name: "Kweku Brefo",
            image: "https://images.pexels.com/photos/2382610/pexels-photo-2382610.jpeg"
          },
          rating: 5,
          comment: "They got Great taste!",
          date: "2023-10-25"
        }
      ]
    },
    nutritionalValue: {
      calories: "50 kcal",
      carbohydrates: "13g",
      protein: "0.5g"
    },
    storageInstructions: "Store at room temperature until ripe, then refrigerate. Best consumed within 5 days.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: true,
      acceptsPaypal: false
    },
    discounts: {
      bulk: {
        minQuantity: 10,
        percentage: 12
      },
      seasonal: true,
      promoCode: "SWEET12"
    }
  },
  {
    id: 10,
    name: "Fresh Oranges",
    price: 4.99,
    category: "fruits",
    image: "https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg",
    images: [
      "https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg",
      "https://images.pexels.com/photos/691166/pexels-photo-691166.jpeg",
      "https://images.pexels.com/photos/207085/pexels-photo-207085.jpeg"
    ],
    description: "Sweet and juicy oranges from Ghana's citrus belt.",
    rating: 4.7,
    stock: 200,
    unit: "kg",
    minOrder: 2,
    maxOrder: 25,
    seller: {
      id: "VOF008",
      name: "Valley Organic Farms",
      rating: 4.7,
      profilePicture: "https://images.pexels.com/photos/2382604/pexels-photo-2382604.jpeg",
      location: "Akropong, Eastern Region",
      contactNumber: "+233 24 111 2345"
    },
    traceability: {
      farmName: "Valley Organic Farms",
      location: "Akropong, Eastern Region",
      harvestDate: "2023-10-20",
      farmingMethod: "Sustainable",
      carbonFootprint: "Low - 0.3kg CO2/kg",
      transportMethod: "Local Distribution",
      distributionCenter: "Cape Coast Hub",
      soilType: "Sandy Loam",
      waterSource: "Drip Irrigation",
      pesticides: "Organic Methods",
      batchNumber: "PIN-2023-1020",
      packagingDate: "2023-10-21",
      qualityCertification: "Organic Certified",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TOM-2023-1015"
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Cape Coast Market",
        coordinates: {
          lat: 5.1315,
          lng: -1.2795
        }
      },
      standardDelivery: {
        cost: 8,
        estimatedTime: "1-2 days",
        available: true,
        restrictions: "Coastal region delivery only"
      },
      expressDelivery: {
        cost: 15,
        estimatedTime: "Same day",
        available: true,
        restrictions: "Order before 12 PM"
      }
    },
    ratings: {
      average: 4.7,
      reviews: [
        {
          id: "REV010",
          user: {
            id: "USR010",
            name: "Elorm Asigbee",
            image: "https://images.pexels.com/photos/2382611/pexels-photo-2382611.jpeg"
          },
          rating: 5,
          comment: "Great Product",
          date: "2023-10-25"
        }
      ]
    },
    nutritionalValue: {
      calories: "50 kcal",
      carbohydrates: "13g",
      protein: "0.5g"
    },
    storageInstructions: "Store at room temperature until ripe, then refrigerate. Best consumed within 5 days.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: true,
      acceptsPaypal: false
    },
    discounts: {
      bulk: {
        minQuantity: 10,
        percentage: 12
      },
      seasonal: true,
      promoCode: "SWEET12"
    }
  },
  {
    id: 11,
    name: "Shea Butter",
    price: 12.99,
    category: "processed-foods",
    image: "https://africaimports.com/product_images/uploaded_images/shea-butter.jpg",
    images: [
      "https://africaimports.com/product_images/uploaded_images/shea-butter.jpg",
      "https://lh3.googleusercontent.com/proxy/hDk9yRzRMGKlVS0h4A5jq0klD8xH1M3a7IFbt6ShqEJwqeyvyKGQDV5-3Okao61Ge8GAxZhpAzgaVirEcwyePHiqZUNWok5LVgqj4TbHWJ2QyZJzDgTFivgtc8W_l7yFKSZJeyHbdPyP",
      "https://assets.clevelandclinic.org/transform/43bd38c6-5340-484e-bf06-ca6dcc308c90/shear-butter-with-nuts-808204214-770x533-1_jpg"
    ],
    description: "100% pure, unrefined shea butter from Northern Ghana.",
    rating: 4.9,
    stock: 150,
    unit: "kg",
    minOrder: 1,
    maxOrder: 15,
    seller: {
      id: "VOF008",
      name: "Valley Organic Farms",
      rating: 4.7,
      profilePicture: "https://lh4.googleusercontent.com/proxy/bSfoY-dPhrRw_0V_1QBdUallSPa5WnLaRJcXQzDv85lmvq-aLwqf-wRhdbk6_Yyeru7qu1GNE0VvowIydL6gxsxvyat22qBEAsGjkcz3Vx8T_b9tuREtYvAs",
      location: "Akropong, Eastern Region",
      contactNumber: "+233 24 111 2345"
    },
    traceability: {
      farmName: "Valley Organic Farms",
      location: "Akropong, Eastern Region",
      harvestDate: "2023-10-20",
      farmingMethod: "Sustainable",
      carbonFootprint: "Low - 0.3kg CO2/kg",
      transportMethod: "Local Distribution",
      distributionCenter: "Cape Coast Hub",
      soilType: "Sandy Loam",
      waterSource: "Drip Irrigation",
      pesticides: "Organic Methods",
      batchNumber: "PIN-2023-1020",
      packagingDate: "2023-10-21",
      qualityCertification: "Organic Certified",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TOM-2023-1015"
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Cape Coast Market",
        coordinates: {
          lat: 5.1315,
          lng: -1.2795
        }
      },
      standardDelivery: {
        cost: 8,
        estimatedTime: "1-2 days",
        available: true,
        restrictions: "Coastal region delivery only"
      },
      expressDelivery: {
        cost: 15,
        estimatedTime: "Same day",
        available: true,
        restrictions: "Order before 12 PM"
      }
    },
    ratings: {
      average: 4.7,
      reviews: [
        {
          id: "REV011",
          user: {
            id: "USR011",
            name: "Adams",
            image: "https://images.pexels.com/photos/2382612/pexels-photo-2382612.jpeg"
          },
          rating: 5,
          comment: "A great skin moisturizer",
          date: "2023-10-25"
        }
      ]
    },
    nutritionalValue: {
      calories: "50 kcal",
      carbohydrates: "13g",
      protein: "0.5g"
    },
    storageInstructions: "Store at room temperature until ripe, then refrigerate. Best consumed within 5 days.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: true,
      acceptsPaypal: false
    },
    discounts: {
      bulk: {
        minQuantity: 10,
        percentage: 12
      },
      seasonal: true,
      promoCode: "SWEET12"
    }
  },
  {
    id: 12,
    name: "Sprayer",
    price: 9.99,
    category: "farm-supplies",
    image: "https://agribegri.com/productimage/14619599351739261827.webp",
    images: [
      "https://agribegri.com/productimage/14619599351739261827.webp",
      "https://rukminim3.flixcart.com/image/850/1000/kirr24w0-0/garden-sprayer/v/r/b/agriculture-knapsack-hand-operated-sprayer-qth-original-imafyhhdrkzztxwz.jpeg?q=20&crop=false",
      "https://farmsquare.ng/wp-content/uploads/2019/09/knapsack-nexos.png"
    ],
    description: " Apply liquid solutions, like pesticides, herbicides, fertilizers, and fungicides, to crops.",
    rating: 4.7,
    stock: 300,
    unit: "packet",
    minOrder: 2,
    maxOrder: 30,
    seller: {
      id: "VOF008",
      name: "Valley Organic Farms",
      rating: 4.7,
      profilePicture: "https://images.pexels.com/photos/2382604/pexels-photo-2382604.jpeg",
      location: "Akropong, Eastern Region",
      contactNumber: "+233 24 111 2345"
    },
    traceability: {
      farmName: "Valley Organic Farms",
      location: "Akropong, Eastern Region",
      harvestDate: "2023-10-20",
      farmingMethod: "Sustainable",
      carbonFootprint: "Low - 0.3kg CO2/kg",
      transportMethod: "Local Distribution",
      distributionCenter: "Cape Coast Hub",
      soilType: "Sandy Loam",
      waterSource: "Drip Irrigation",
      pesticides: "Organic Methods",
      batchNumber: "PIN-2023-1020",
      packagingDate: "2023-10-21",
      qualityCertification: "Organic Certified",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TOM-2023-1015"
    },
    deliveryOptions: {
      pickup: {
        available: true,
        location: "Cape Coast Market",
        coordinates: {
          lat: 5.1315,
          lng: -1.2795
        }
      },
      standardDelivery: {
        cost: 8,
        estimatedTime: "1-2 days",
        available: true,
        restrictions: "Coastal region delivery only"
      },
      expressDelivery: {
        cost: 15,
        estimatedTime: "Same day",
        available: true,
        restrictions: "Order before 12 PM"
      }
    },
    ratings: {
      average: 4.7,
      reviews: [
        {
          id: "REV012",
          user: {
            id: "USR012",
            name: "Sarah A.",
            image: "https://images.pexels.com/photos/2382613/pexels-photo-2382613.jpeg"
          },
          rating: 5,
          comment: "Good Equipment",
          date: "2023-10-25"
        }
      ]
    },
    nutritionalValue: {
      calories: "50 kcal",
      carbohydrates: "13g",
      protein: "0.5g"
    },
    storageInstructions: "Store at room temperature until ripe, then refrigerate. Best consumed within 5 days.",
    paymentOptions: {
      acceptsCreditCard: true,
      acceptsMobileMoney: true,
      acceptsCashOnDelivery: true,
      acceptsPaypal: false
    },
    discounts: {
      bulk: {
        minQuantity: 10,
        percentage: 12
      },
      seasonal: true,
      promoCode: "SWEET12"
    }
  }
];
export const products = shuffleArray(originalProducts);

 