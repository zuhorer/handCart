import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Permissions from "expo-permissions";
import * as firebase from "firebase";
import * as Location from "expo-location";
import Fire from "../../fire/fire";

export default class VendorSignedHome extends React.Component {
  /*state = {
    name: "",
    email: "",
    password: "",
    location: {},
    vendor: null,
    errorMessage: null,
  };*/
  /*
  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredentials) => {
        return userCredentials.user.updateProfile({
          displayName: this.state.name,
        });
      })
      .catch((error) => this.setState({ errorMessage: error.message }));
  };
*/ /*
  UpdateVendor = () => {
    Fire.shared
      .VendoraddPost({
        coords: this.state.location,
      })
      .then((ref) => {
        this.setState({ location: {} });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };*/
  /*<View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
        </View>
*/
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.greetings}>{"Hi Vendor!"}</Text>

        <TouchableOpacity
          style={{ alignSelf: "center", marginTop: 32 }}
          onPress={() => this.props.navigation.navigate("PickYourOrder")}
        >
          <Text style={{ fontWeight: "500", color: "#E9446A" }}>
            Orders ready to pick!
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
/*<TouchableOpacity
          style={styles.button}
          onPress={
            ((this.handleSignUp, this.UpdateVendor),
            () => this.props.navigation.navigate("VendorHome"))
          }
        >
          <Text style={{ color: "#FFF", fontWeight: "500" }}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignSelf: "center", marginTop: 32 }}
          onPress={() => this.props.navigation.navigate("VendorLogin")}
        >
          <Text style={{ fontWeight: "500", color: "#E9446A" }}>Login</Text>
        </TouchableOpacity>*/

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
    backgroundColor: "#E9446A",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
