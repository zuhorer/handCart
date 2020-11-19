import * as firebase from "firebase";
import "firebase/firestore";
import * as geofirestore from "geofirestore";
import "firebase/functions";

const firebaseconfig = {
  apiKey: ,
  authDomain: ,
  databaseURL:,
  projectId: ,
  storageBucket: ,
  messagingSenderId: ,
  appId: ,
  measurementId: ,
};

class Fire {
  constructor() {
    firebase.initializeApp(firebaseconfig);
  }
  //VENDOR FUNCTIONS
  //checking if UID is a vendor: inuse in vendor HOME
  checkvendorstatus = async () => {
    return new Promise(async (res, rej) => {
      const check = await this.firestore.collection("Vendors").doc(this.uid);
      var ret = "";
      check
        .get()
        .then((doc) => {
          if (doc.exists) {
            ret = "true";
          } else ret = "false";
        })
        .then((ref) => {
          res(ret);
        });
    });
  };
  //adding existing Items to vendor INVENTORY
  FetchingItemsFromInventory = async () => {
    var sendlist = [];
    return new Promise((res, rej) => {
      this.firestore
        .collection("Vendors")
        .doc(this.uid)
        .collection("inventory")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists) {
              sendlist.push({ ...doc.data(), key: doc.id });
            }
          });
          res(sendlist);
        });
    });
  };
  FetchingItemsFromMainInventory = async () => {
    var sendlist = [];
    return new Promise((res, rej) => {
      this.firestore.collection("inventory").onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            sendlist.push({ ...doc.data(), key: doc.id });
          }
        });
        res(sendlist);
      });
    });
  };
  searchingInMainInventory = async ({ name }) => {
    // alert(name);
    RET = null;
    return new Promise(async (res, rej) => {
      const check = await this.firestore
        .collection("inventory")
        .where("name", "==", name)
        .get();
      //alert(JSON.stringify(check));
      await check.forEach((doc) => {
        if (doc.exists) {
          RET = { ...doc.data(), ID: doc.id, status: "Found" };
        } else RET = { status: "NotFound" };
      });
      //alert(RET);
      res(RET);
    });
    //alert(JSON.stringify(USERS));
  };
  AddingNewItems = async ({ ID, item }) => {
    var specs = [];
    for (var i = 2; i < item.length; i++) {
      specs.push(item[i]);
    }
    data = {
      ID: ID,
      name: item[0].name,
      unit: item[1].unit,

      specifications: specs,
    };
    return new Promise((res, rej) => {
      this.firestore
        .collection("Vendors")
        .doc(this.uid)
        .collection("inventory")
        .add(data)
        .then((ref) => {
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  AddingtoInventory = async ({ item }) => {
    //alert(JSON.stringify(item[0].name));
    //alert(JSON.stringify(item[1].unit));
    data = {
      name: item[0].name,
      unit: item[1].unit,
    };
    return new Promise((res, rej) => {
      this.firestore
        .collection("inventory")
        .add(data)
        .then((ref) => {
          //alert(ref.id);
          this.AddingNewItems({ ID: ref.id, item: item });
          res(ref.id);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  AddingVendorInventory = async ({ id, NAME }) => {
    return new Promise((res, rej) => {
      this.firestore
        .collection("Vendors")
        .doc(this.uid)
        .collection("inventory")
        .add({
          ID: id,
          name: NAME,
          available: true,
        })
        .then((ref) => {
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  AddNewVendor = async ({ name, coords, vendor, latitude, longitude }) => {
    const data = {
      name: name,
      vendor: vendor,
      coords: coords,
      latitude: latitude,
      longitude: longitude,
    };

    await this.firestore.collection("Vendors").doc(this.uid).set(data);

    await this.geocollection.collection("VendorLocations").add({
      VendorUID: this.uid,
      score: 100,
      coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
    });
  };

  UpdatingVendorOrderList = async ({ users }) => {
    const USERS = users;
    return new Promise((res, rej) => {
      this.firestore
        .collection("Vendors")
        .doc(this.uid)
        .collection("orders")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            if (users.length !== 0) {
              if (users.every((item) => item.key !== documentSnapshot.id)) {
                USERS.push({
                  ...documentSnapshot.data(),
                  key: documentSnapshot.id,
                });
              }
            } else {
              USERS.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            }
          });

          res(USERS);
        });
    });
  };
  /* addingVendorsForGeolocation = async ({ latitude, longitude }) => {
    this.geocollection.collection("VendorLocations").add({
      VendorUID: this.uid,
      score: 100,
      coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
    });
  };
*/
  /*searchingVendor = async ({ Item, coords }) => {
    return new Promise((res, rej) => {
      this.firestore
        .collection("Vendors")
        .doc(this.uid)
        .where("coords", "==", coords)
        .then();
    });
  };*/

  /*AddingVendorHistory= async ({ CustomerUID,money,reference,timestamp }) => {
    return new Promise((res, rej) => {
      this.firestore
        .collection("Vendors")
        .doc(this.uid)
        .collection("inventory")
        .doc("CustomerHistory")
        .add({
          CustomerUID=[money,reference,timestamp]
        })
        .then((ref) => {
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };
  

*/

  //CUSTOMER FUNCTIONS
  //sending items to Customers
  addNewCustomer = async () => {
    const CustomerData = {
      customer: true,
    };

    return new Promise(async (res, rej) => {
      await this.firestore
        .collection("Customers")
        .doc(this.uid)
        .set(CustomerData)
        .then((ref) => {
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  checkCustomerstatus = async () => {
    return new Promise(async (res, rej) => {
      const check = await this.firestore.collection("Customers").doc(this.uid);
      var ret = "";
      check
        .get()
        .then((doc) => {
          if (doc.exists) {
            ret = "true";
          } else ret = "false";
        })
        .then((ref) => {
          res(ret);
        });
    });
  };
  updatingToSaved = async ({ VendorUID, itemList, status, ProductIds }) => {
    const data = {
      VendorUID: VendorUID,
      ProductIds: ProductIds,
      currentlist: itemList,
      timestamp: this.timestamp,
      status: status,
    };
    return new Promise((res, rej) => {
      this.firestore
        .collection("Customers")
        .doc(this.uid)
        .collection("ORDERS")
        .add(data)
        .then((ref) => {
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  sendingItemToVendor = async ({ VendorUID, itemList, status, ProductIds }) => {
    const data = {
      CustomerUID: this.uid,
      currentlist: itemList,
      ProductIds: ProductIds,
      timestamp: this.timestamp,
      status: status,
    };

    this.firestore
      .collection("Vendors")
      .doc(VendorUID)
      .collection("orders")
      .add(data);

    this.firestore
      .collection("Customers")
      .doc(this.uid)
      .collection("ORDERS")
      .add(data);
  };

  //customer side firebase methods+
  searchingVendorInventory = async ({ vendor, Item }) => {
    let availablevalue = [];
    let ref = `Vendors/${vendor}/inventory`;
    refs = await this.firestore.collection(ref).where("ID", "==", Item).get();
    refs.forEach((doc) => {
      if (doc.data().ID == Item) {
        availablevalue.push(doc);
      }
    });
    return availablevalue;
  };

  updatingDrafts = async ({ text, timestamp, productIds }) => {
    //alert(JSON.stringify(text));

    var Id = null;
    var TimeStamp = this.timestamp;
    var data = {
      currentlist: text,
      timestamp: TimeStamp,
      ProductIds: productIds,
      status: "Saved",
    };
    var ref = await this.firestore
      .collection("Customers")
      .doc(uid)
      .collection("ORDERS")
      .where("timestamp", "==", timestamp)
      .get();
    ref.forEach((doc) => {
      Id = doc.id;
    });
    //alert(JSON.stringify(data));

    return new Promise(async (res, rej) => {
      await this.firestore
        .collection("Customers")
        .doc(uid)
        .collection("ORDERS")
        .doc(Id)
        .update(data)
        .then((ref) => {
          //alert(ref);
          res(TimeStamp);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  searchingforVendors = async ({
    Items,
    currentLatitude,
    currentLongitude,
  }) => {
    return new Promise((res, rej) => {
      this.geocollection
        .collection("VendorLocations")
        .near({
          center: new firebase.firestore.GeoPoint(
            currentLatitude,
            currentLongitude
          ),
          radius: 200,
        })
        .get()
        .then(async (querySnapshot) => {
          let users = [];

          for (let i = 0; i < querySnapshot.docs.length; i++) {
            let { doc } = querySnapshot.docChanges()[i];
            let available = [];
            let Ids = [];
            for (j = 0; j < Items.length; j++) {
              let avail = await this.searchingVendorInventory({
                vendor: querySnapshot.docs[i].data().VendorUID,
                Item: Items[j],
              });
              //alert(avail);
              //alert(Items[j]);
              if (avail.length > 0) {
                for (k in avail) {
                  available.push(avail[k].data());
                  Ids.push(avail[k].data().ID);
                }
              }
            }
            //alert(JSON.stringify(Ids));
            //let vendorineven = this.getUsers({ Items: Items });
            let user = {
              UID: querySnapshot.docs[i].data().VendorUID,
              vendorInvn: available,
              ProductIds: Ids,
              coords: querySnapshot.docs[i].data().coordinates,

              distance: doc.distance,
              id: querySnapshot.docs[i].id,
            };
            //alert(JSON.stringify(user.userItems));

            users.push(user);
          }
          //alert(JSON.stringify(users));
          res(users);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };
  CustomerPlacedLists = () => {
    const USERS = [];
    return new Promise(async (res, rej) => {
      const DOCS = await this.firestore
        .collection("Customers")
        .doc(this.uid)
        .collection("ORDERS")
        .where("status", "==", "Placed")
        .get();
      DOCS.forEach((doc) => {
        USERS.push({
          ...doc.data(),
          key: doc.id,
        });
      });
      //alert(JSON.stringify(USERS));
      res(USERS);
    });
  };
  CustomerReadyLists = () => {
    const USERS = [];
    return new Promise(async (res, rej) => {
      const DOCS = await this.firestore
        .collection("Customers")
        .doc(this.uid)
        .collection("ORDERS")
        .where("status", "==", "Ready")
        .get();
      DOCS.forEach((doc) => {
        USERS.push({
          ...doc.data(),
          key: doc.id,
        });
      });
      //alert(JSON.stringify(USERS));
      res(USERS);
    });
  };
  CustomerPickedLists = () => {
    const USERS = [];
    return new Promise(async (res, rej) => {
      const DOCS = await this.firestore
        .collection("Customers")
        .doc(this.uid)
        .collection("ORDERS")
        .where("status", "==", "Picked")
        .get();
      DOCS.forEach((doc) => {
        USERS.push({
          ...doc.data(),
          key: doc.id,
        });
      });
      //alert(JSON.stringify(USERS));
      res(USERS);
    });
  };
  CustomerExistingLists = () => {
    const USERS = [];
    return new Promise(async (res, rej) => {
      const DOCS = await this.firestore
        .collection("Customers")
        .doc(this.uid)
        .collection("ORDERS")
        .where("status", "==", "Saved")
        .get();
      DOCS.forEach((doc) => {
        USERS.push({
          ...doc.data(),
          key: doc.id,
        });
      });
      //alert(JSON.stringify(USERS));
      res(USERS);
    });
  };

  addCurrentCustomerList = async ({ text, productIds }) => {
    //alert(JSON.stringify(text));
    const TimeStamp = this.timestamp;

    uid = this.uid;

    const data = {
      currentlist: text,
      timestamp: TimeStamp,
      status: "Saved",
      ProductIds: productIds,
    };

    return new Promise((res, rej) => {
      this.firestore
        .collection("Customers")
        .doc(uid)
        .collection("ORDERS")
        .add(data)
        .then((ref) => {
          alert(TimeStamp);
          res(TimeStamp);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  signOut = () => {
    firebase.auth().signOut();
  };
  get firestore() {
    return firebase.firestore();
  }
  get geocollection() {
    return geofirestore.initializeApp(this.firestore);
  }
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
  get timestamp() {
    return Date.now();
  }
}
Fire.shared = new Fire();
export default Fire;

/*
  uploadPhotoAsync = async (uri) => {
    const path = "photos/" + this.uid + "/" + Date.now() + ".jpg";
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase.storage().ref(path).put(file);
      upload.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };
   const query = this.geocollection.collection("VendorLocations").near({
      center: new firebase.firestore.GeoPoint(
        currentLatitude,
        currentLongitude
      ),
      radius: 2,
    });

    // Get query (as Promise)
    return query.get.then((value)=>{
      console.log(value.docs);
    })
   */
