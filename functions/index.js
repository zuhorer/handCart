const functions = require("firebase-functions");
const algoliaSearch = require("algoliasearch");
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliaSearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("General Inventory");
exports.addToIndex = functions.firestore
  .document("inventory/{productId}")
  .onCreate((snapShot) => {
    const data = snapShot.data();
    const objectID = snapShot.id;

    return index.saveObject({ ...data, objectID });
  });

exports.updateIndex = functions.firestore
  .document("inventory/{productId}")
  .onUpdate((change) => {
    const newData = change.after.data();
    const objectID = change.after.id;
    return index.saveObject({ ...newData, objectID });
  });

exports.deleteFromIndex = functions.firestore
  .document("inventory/{productId}")
  .onDelete((snapShot) => {
    index.deleteObject(snapShot.id);
  });
