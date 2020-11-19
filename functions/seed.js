const admin = require("firebase-admin");
admin.initializeApp();
const faker = require("faker");
const db = admin.firestore();
const fakeIt = async () => {
  return db.collection("inventory").add({
    itemname: faker.commerce.productName(),
    cost: faker.commerce.price(),
  });
};

Array(20).fill(0).forEach(fakeIt);
