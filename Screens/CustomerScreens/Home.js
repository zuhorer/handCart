import React from "react";
import {
  ActivityIndicator,
  Button,
  Clipboard,
  FlatList,
  Image,
  Platform,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";

import * as firebase from "firebase";
import Fire from "../../fire/fire";
import Data from "./../../config/CustomerHomeIcons";
import { SharedElement } from "react-navigation-shared-element";

import {
  Ionicons,
  Feather,
  EvilIcons,
  AntDesign,
  Fontisto,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import SlidingUpPanel from "rn-sliding-up-panel";
const { width, height } = Dimensions.get("window");
const iconsize = 75;
const SPACING = 10;
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.4 : width * 0.44;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.45;
const animatedValue = new Animated.Value(0).current;

//import { Item } from "react-native-paper/lib/typescript/src/components/List/List";
//import { Icon } from "react-native-paper/lib/typescript/src/components/Avatar/Avatar";

export default class CustomerHomeScreen extends React.Component {
  state = {
    loading: true,
    index: 1,
    email: "",
    displayName: "",
    Customerstatus: "",
    listData: null,
    items: null,
    scrollX: null,
    list: [],
    bgcolor: 1,
    iconname: true,
    animatedvalue: null,
  };
  async componentDidMount() {
    const { email, displayName } = firebase.auth().currentUser;
    this.setState({ email, displayName });
    const scrollX = new Animated.Value(0);
    const animatedvalue = new Animated.Value(0);
    this.setState({ scrollX, loading: true, animatedvalue });
    this.fetchData();
  }
  Loading = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.paragraph}>Loading...</Text>
    </View>
  );
  fetchData = async () => {
    const items = await Fire.shared.FetchingItemsFromMainInventory();

    // Add empty items to create fake spaces
    // [empty_item, ...movies, empty_item]
    this.setState({
      items: [{ key: "empty-left" }, ...items, { key: "empty-right" }],
      loading: false,
    });
  };
  /*
  signOutUser = () => {
    firebase.auth().signOut();
  };
*/
  containerBg = () =>
    this.state.animatedvalue.interpolate({
      inputRange: [0, 0.001, 0.5, 0.501, 1],
      outputRange: ["#fff", "#fff", "#fff", "#E9446A", "#E9446A"],
    });
  circleBg = () =>
    this.state.animatedvalue.interpolate({
      inputRange: [0, 0.001, 0.5, 0.501, 1],
      outputRange: ["#E9446A", "#E9446A", "#E9446A", "#fff", "#fff"],
    });
  iconBg = () =>
    this.state.animatedvalue.interpolate({
      inputRange: [0, 0.001, 0.5, 0.501, 1],
      outputRange: ["#fff", "#fff", "#fff", "#E9446A", "#E9446A"],
    });
  animation = (toValue) =>
    Animated.timing(this.state.animatedvalue, {
      toValue,
      duration: 2000,
      useNativeDriver: false,
    });
  onpress = () => {
    if (this.state.index === 1) {
      this.setState({ index: 0 });
      this.animation(this.state.index).start();
    }

    if (this.state.index === 0) {
      this.setState({ index: 1 });
      this.animation(this.state.index).start();
    }
  };
  render() {
    //const { Customerstatus } = this.state;
    if (this.state.loading === true) {
      return <ActivityIndicator />;
    }
    if (this.state.loading === false) {
      return (
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: this.containerBg(),
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              paddingHorizontal: 15,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={this.props.navigation.openDrawer}>
              <Ionicons
                name="ios-menu"
                size={40}
                color="#E9446A"
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 25,
                  shadowOpacity: 0.5,
                  shadowOffset: { width: 3, height: 3 },
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignSelf: "center",
                flexDirection: "row",
              }}
            >
              <EvilIcons
                name="user"
                size={45}
                color="#E9446A"
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 25,
                  shadowOpacity: 0.5,
                  shadowOffset: { width: 3, height: 3 },
                }}
              ></EvilIcons>
              <View
                style={{
                  alignSelf: "center",
                  height: 30,
                  borderRadius: iconsize * 0.2,
                  shadowOpacity: 0.8,
                  shadowOffset: { width: 3, height: 3 },
                  backgroundColor: "#E9446A",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    flexWrap: "wrap",
                    marginHorizontal: 12,
                    marginVertical: 3,
                    color: "#fff",
                  }}
                >
                  Hi {this.state.displayName}!
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <Feather
                name="shopping-cart"
                size={35}
                color="#E9446A"
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 25,
                  shadowOpacity: 0.8,
                  shadowOffset: { width: 2, height: 2 },
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "column",
              flexWrap: "wrap",
              marginHorizontal: 12,
              marginVertical: -5,
            }}
          >
            <View
              style={{
                height: 40,
                borderRadius: iconsize * 0.2,
                marginBottom: 10,
                backgroundColor: "#E9446A",
                alignItems: "center",
                shadowOpacity: 0.5,
                shadowOffset: { width: 3, height: 3 },
              }}
            >
              <Text
                style={{
                  flexWrap: "wrap",
                  marginHorizontal: 12,
                  marginVertical: 3,
                  color: "#fff",
                }}
              >
                PROMOTIONS
              </Text>
            </View>
            <View>
              <Animated.FlatList
                showsHorizontalScrollIndicator={false}
                data={this.state.items}
                keyExtractor={(item) => item.key}
                horizontal
                bounces={false}
                decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
                renderToHardwareTextureAndroid
                contentContainerStyle={{ alignItems: "center" }}
                snapToInterval={ITEM_SIZE}
                snapToAlignment="start"
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: { contentOffset: { x: this.state.scrollX } },
                    },
                  ],
                  { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => {
                  if (!item.name) {
                    return (
                      <View
                        style={{
                          width: EMPTY_ITEM_SIZE,
                        }}
                      />
                    );
                  }
                  const inputRange = [
                    (index - 2) * ITEM_SIZE,
                    (index - 1) * ITEM_SIZE,
                    index * ITEM_SIZE,
                  ];

                  const translateY = this.state.scrollX.interpolate({
                    inputRange,
                    outputRange: [0, -50, 0],
                  });

                  return (
                    <View style={{ width: ITEM_SIZE }}>
                      <Animated.View
                        style={{
                          marginHorizontal: SPACING,
                          padding: SPACING * 2,
                          alignItems: "center",
                          backgroundColor: "white",
                          borderRadius: 34,
                        }}
                      >
                        <Image
                          source={require("./../../assets/splash.png")}
                          style={styles.posterImage}
                        />
                      </Animated.View>
                    </View>
                  );
                }}
              />
            </View>
          </View>

          <View>
            <View
              style={{
                height: 30,
                borderRadius: iconsize * 0.2,
                marginBottom: 10,
                marginRight: 10,
                marginLeft: 10,
                backgroundColor: "#E9446A",
                alignItems: "center",
                justifyContent: "center",
                shadowOpacity: 0.5,
                shadowOffset: { width: 3, height: 3 },
              }}
            >
              <Text
                style={{
                  flexWrap: "wrap",
                  marginHorizontal: 12,
                  marginVertical: 3,
                  color: "#fff",
                }}
              >
                CATEGORIES
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {Data.map((item) => {
                const { navigation } = this.props;
                return (
                  <TouchableOpacity
                    key={item.title}
                    onPress={() => navigation.push("List", { item })}
                  >
                    <SharedElement id={`item.${item.title}.icon`}>
                      <View>
                        <View style={styles.imageContainer}>
                          <Image style={styles.image} source={item.image} />
                        </View>
                      </View>
                    </SharedElement>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View
            style={{
              marginTop: height * 0.09,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Animated.View>
              <Animated.View
                style={{
                  width: iconsize,
                  height: iconsize,
                  borderRadius: iconsize / 2,
                  marginHorizontal: 10,
                  marginTop: 10,
                  marginBottom: 10,
                  backgroundColor: this.circleBg(),
                  alignItems: "center",
                  justifyContent: "center",
                  shadowOpacity: 0.5,
                  shadowOffset: { width: 3, height: 3 },
                  transform: [
                    {
                      perspective: 100,
                    },
                    {
                      rotateY: this.state.animatedvalue.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: ["0deg", "-90deg", "-180deg"],
                      }),
                    },
                    {
                      scale: this.state.animatedvalue.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 8, 1],
                      }),
                    },
                    {
                      translateX: this.state.animatedvalue.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: ["0%", "50%", "0%"],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={{
                    marginVertical: 10,
                    flexDirection: "row",
                  }}
                  onPress={this.onpress}
                >
                  <FontAwesome
                    name="shopping-basket"
                    size={40}
                    color="#fff"
                    style={{
                      shadowOpacity: 0.5,
                      shadowOffset: { width: 3, height: 3 },
                    }}
                  />
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            <View
              style={{
                width: iconsize,
                height: iconsize,
                borderRadius: iconsize / 2,
                marginHorizontal: 10,
                marginTop: 10,
                marginBottom: 10,
                backgroundColor: "#E9446A",
                alignItems: "center",
                justifyContent: "center",
                shadowOpacity: 0.5,
                shadowOffset: { width: 3, height: 3 },
              }}
            >
              <TouchableOpacity
                style={{ marginVertical: 10, flexDirection: "row" }}
              >
                <Fontisto
                  name="shopping-store"
                  size={28}
                  color="#FFF"
                  style={{
                    shadowOpacity: 0.5,
                    shadowOffset: { width: 3, height: 3 },
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
            <TouchableOpacity
              onPress={() => this._panel.show()}
              style={{
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <MaterialCommunityIcons
                name="bell-ring-outline"
                size={54}
                style={{
                  marginBottom: 10,
                  shadowOpacity: 0.5,
                  shadowOffset: { width: 3, height: 3 },
                }}
                color="#E9446A"
              />
            </TouchableOpacity>
            <SlidingUpPanel
              ref={(c) => (this._panel = c)}
              draggableRange={{ top: height / 1.07, bottom: 0 }}
              animatedValue={this._draggedValue}
              showBackdrop={false}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={styles.panel}>
                  <View style={styles.panelHeader}>
                    <Text style={{ color: "#FFF" }}>YOUR NOTIFICATIONS</Text>
                  </View>
                </View>
              </View>
            </SlidingUpPanel>
          </View>
        </Animated.View>
      );
    }
  }
}
/*
<Button
style={{ alignSelf: "center", marginTop: 32 }}
onPress={() => Fire.shared.signOut()}
title="Log Out"
/>*/
const styles = StyleSheet.create({
  posterImage: {
    width: "100%",
    height: ITEM_SIZE * 0.8,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  container: {
    flex: 1,
  },
  panel: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
  panelHeader: {
    height: 50,
    borderRadius: iconsize * 0.2,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#E9446A",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: iconsize,
    height: iconsize,
    borderRadius: iconsize / 2,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#E9446A",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.5,
    shadowOffset: { width: 3, height: 3 },
  },
  image: {
    width: iconsize * 0.6,
    height: iconsize * 0.6,
    resizeMode: "contain",
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: { width: 3, height: 3 },
  },
});
