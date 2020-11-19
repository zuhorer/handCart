import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import * as Permissions from "expo-permissions";
import * as firebase from "firebase";
import * as Location from "expo-location";
import Fire from "../../fire/fire";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ActivityIndicator } from "react-native-paper";
export default class VendorRegisterScreen extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    location: {},
    latitude: null,
    longitude: null,
    errorMessage: null,
    vendorSumbited: null,
    vendortagged: null,
    status: "",
  };
  componentDidMount() {
    this.getLocation();
  }
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    this.setState({ status });
    if (status != "granted") {
      alert("Permission Not Granted");
      this.setState({
        errorMessage: "Permission Not Granted",
      });
    }
    const userLocation = await Location.getCurrentPositionAsync();
    this.setState({
      location: userLocation,
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    });
  };

  /*handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredentials) =s> {
        return userCredentials.user.updateProfile({
          displayName: this.state.name,
        });
      })
      .catch((error) => this.setState({ errorMessage: error.message }));
    this.setState({ vendor: true });
  };
*/
  Update = () => {
    Alert.alert(
      "Necessary Evil",
      "We have Identified your Location.\n This will help customers to reach your Shop!\n Onto next!",
      [{ text: "Click me!", onPress: () => this.UpdateVendor() }]
    );
  };
  UpdateVendor = async () => {
    await Fire.shared
      .AddNewVendor({
        name: this.state.name,
        vendor: "true",
        coords: this.state.location,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      })
      .then((ref) => {
        //alert(this.state.vendortagged);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
    this.props.navigation.navigate("VendorActualHome");
  }; /*
  UpdateVendor = () => {
  Fire.shared
      .addingVendorsForGeolocation({
        coords: this.state.location,
      })
      .then((ref) => {
      
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });}
<TouchableOpacity style={styles.button} onPress={this.getLocation()}>
          <Text style={{ color: "#FFF", fontWeight: "500" }}>Add location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.geoUpdate()}>
          <Text style={{ color: "#FFF", fontWeight: "500" }}>Add location</Text>
        </TouchableOpacity>
        return(<TouchableOpacity style={styles.button} onPress={this.geoUpdate()}>
      <Text style={{ color: "#FFF", fontWeight: "500" }}>Add location</Text>
    </TouchableOpacity>)
        */ /* AddLocation = () => {
    if (this.state.vendorSumbited === true) {
      return (
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.geoUpdate()}
          >
            <Text style={{ color: "#FFF", fontWeight: "500" }}>
              Add location
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };*/
  /* geoUpdate = () => {
    Fire.shared
      .addingVendorsForGeolocation({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      })
      .then((ref) => {
        
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }; login = () => {
    alert(this.state.vendortagged);
    if (this.state.vendortagged === true) {
      return (
        <View>
          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 32 }}
            onPress={() => this.props.navigation.navigate("VendorActualHome")}
          >
            <Text style={{ fontWeight: "500", color: "#E9446A" }}>login</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
  };
  */
  render() {
    const {
      latitude,
      longitude,
      locations,
      status,
      vendorSumbited,
      vendortagged,
    } = this.state;
    if (latitude !== null) {
      return (
        <View style={styles.container}>
          <Text style={styles.greetings}>{"Hello!\n Signup as a vendor!"}</Text>
          <View style={styles.errorMessage}>
            {this.state.errorMessage && (
              <Text style={styles.error}>{this.state.errorMessage}</Text>
            )}
          </View>
          <TextInput
            placeholder="Enter Your Stores name here...."
            style={{ alignSelf: "center", marginTop: 32 }}
            onChangeText={(text) => this.setState({ name: text })}
            value={this.state.name}
          />
          <Button
            title="CLICK ME!"
            style={{
              fontWeight: "500",
              color: "#E9446A",
              alignSelf: "center",
              marginTop: 32,
            }}
            onPress={() => this.Update()}
          />
        </View>
      );
    }

    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greetings: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: "#BABF9E",
    fontSize: 10,
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "#BABF9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#161F3D",
  },
  button: {
    marginHorizontal: 30,
    marginTop: 10,
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
