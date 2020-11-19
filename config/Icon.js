import { StyleSheet, View, Image } from "react-native";
const iconsize = 20;
export default function Icon({ uri }) {
  return <View style={styles.imageContainer}></View>;
}

const styles = StyleSheet.create({
  imageContainer: {
    width: iconsize,
    height: iconsize,
    borderRadius: iconsize / 2,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: iconsize * 0.6,
    height: iconsize * 0.6,
    resizeMode: "contain",
  },
});
