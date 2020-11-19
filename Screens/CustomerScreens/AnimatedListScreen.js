import React from "react";
import {
  StatusBar,
  TextInput,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
  Button,
} from "react-native";

import { Ionicons, AntDesign } from "@expo/vector-icons";
import PropTypes from "prop-types";
import * as firebase from "firebase";
import SlidingUpPanel from "rn-sliding-up-panel";

import Fire from "../../fire/fire";
import { SafeAreaView, NavigationEvents } from "react-navigation";
import { SharedElement } from "react-navigation-shared-element";
import { LongPressGestureHandler } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
import { LinearGradient } from "expo-linear-gradient";
const iconsize = 50;
const SPACING = 10;
const ITEM_SIZE = Platform.OS === "ios" ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;
var list = [];
var Ids = [];
export default class App extends React.Component {
  state = {
    listData: null,
    items: null,
    scrollX: null,
    list: [],
    bgcolor: 1,
    iconname: true,
  };
  async componentDidMount() {
    const { navigation } = this.props;
    const listData = await navigation.getParam("item", null);
    //alert(JSON.stringify(listData));
    const scrollX = new Animated.Value(0);
    this.setState({ scrollX, listData });
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
    });
  };
  Backdrop = () => {
    return (
      <View style={{ height: BACKDROP_HEIGHT, width, position: "absolute" }}>
        <FlatList
          data={this.state.items}
          keyExtractor={(item) => item.key + "-backdrop"}
          removeClippedSubviews={false}
          contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
          renderItem={({ index }) => {
            const translateX = this.state.scrollX.interpolate({
              inputRange: [(index - 1) * ITEM_SIZE, index * ITEM_SIZE],
              outputRange: [0, width],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                removeClippedSubviews={false}
                style={{
                  position: "absolute",
                  width: translateX,
                  height,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={require("./../../assets/splash.png")}
                  style={{
                    width,
                    height: BACKDROP_HEIGHT,
                    position: "absolute",
                  }}
                />
              </Animated.View>
            );
          }}
        />
        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", "white"]}
          style={{
            height: BACKDROP_HEIGHT,
            width,
            position: "absolute",
            bottom: 0,
          }}
        />
      </View>
    );
  };

  //onpressing the add button
  handlePress = async ({ item }) => {
    if (this.state.list.every((items) => items !== item.key)) {
      const product = {
        name: item.name,
        objectID: item.key,
        unit: item.unit,
      };
      list.push(product);
      Ids.push(item.key);
      await this.setState({ bgcolor: 0, iconname: false, list: Ids });
    }
  };
  pressicon = ({ item }) => {
    var name = "";
    var text = "";
    if (this.state.list.every((items) => items !== item.key)) {
      name = "ios-add-circle-outline";
    } else {
      name = "ios-arrow-back";
      text = "added";
    }

    {
      return (
        <View>
          <Text>{text}</Text>
          <Ionicons
            name={name}
            size={50}
            color="#E9446A"
            style={{
              flexWrap: "wrap",
              paddingHorizontal: 15,
              paddingVertical: 1,
            }}
          />
        </View>
      );
    }
  };
  renderItem({ item }) {
    //alert(JSON.stringify(item));
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity style={{ paddingHorizontal: 30 }}>
          <Ionicons name="md-add" size={24} color="#FFFFFF"></Ionicons>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    if (this.state.items === null) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.paragraph}>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.Backdrop()}
        <StatusBar hidden />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 20,
            borderTopWidth: 1,
            borderTopColor: "#BABF9E",
            borderBottomWidth: 1,
            borderBottomColor: "#BABF9E",
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Ionicons
                name="ios-arrow-back"
                size={24}
                color="#E9446A"
                style={{
                  flexWrap: "wrap",
                  paddingHorizontal: 15,
                  paddingVertical: 1,
                }}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity key={this.state.listData.title} onPress={() => {}}>
            <SharedElement id={`item.${this.state.listData.title}.icon`}>
              <View>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    source={this.state.listData.image}
                  />
                </View>
              </View>
            </SharedElement>
          </TouchableOpacity>
        </View>
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
            [{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }],
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
                    transform: [{ translateY }],
                    backgroundColor: "white",
                    borderRadius: 34,
                  }}
                >
                  <TouchableOpacity>
                    <Text style={{ fontSize: 24 }} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 24 }} numberOfLines={1}>
                      {item.unit}
                    </Text>
                  </TouchableOpacity>
                  <View>
                    <TextInput
                      placeholder="Enter Quantity "
                      numeric // This prop makes the input to get numeric only
                      keyboardType={"numeric"}
                      style={{ borderBottomWidth: 1 }}
                      onChangeText={(text) => {
                        item.unitvalue = text;
                      }}
                      value={item.unitvalue}
                    />
                  </View>

                  <Image
                    source={require("./../../assets/splash.png")}
                    style={styles.posterImage}
                  />

                  <TouchableOpacity onPress={() => this.handlePress({ item })}>
                    {this.pressicon({ item })}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            );
          }}
        />
        <View>
          <Button title="Show List" onPress={() => this._panel.show()} />
          <SlidingUpPanel
            ref={(c) => (this._panel = c)}
            draggableRange={{ top: height / 1.25, bottom: 0 }}
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
                  <Text style={{ color: "#FFF" }}>YOUR LIST</Text>
                </View>
                <FlatList
                  data={list}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.objectID}
                />
              </View>
            </View>
          </SlidingUpPanel>
        </View>
      </View>
    );
  }
}
/*
        <TouchableOpacity 
        onPress={()=>this.viewlist()}
        >
          <Text style={{ fontSize: 24 }} numberOfLines={1}>
            My list
          </Text>
        </TouchableOpacity>*/

const styles = StyleSheet.create({
  imageContainer: {
    width: iconsize,
    height: iconsize,
    borderRadius: iconsize * 1.2,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
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
  image: {
    width: iconsize * 0.6,
    height: iconsize * 0.6,
    resizeMode: "contain",
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#D8D9DB",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  posterImage: {
    width: "100%",
    height: ITEM_SIZE * 0.8,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});
