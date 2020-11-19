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
  TouchableOpacity,
  ScrollView,
  View,
  Dimensions,
  YellowBox,
} from "react-native";
import { Constants } from "expo";
import * as Permissions from "expo-permissions";
import "react-native-get-random-values";
import { SafeAreaView } from "react-navigation";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import Polyline from "@mapbox/polyline";

const { width, height } = Dimensions.get("screen");
import Carousel from "react-native-snap-carousel";
import Fire from "../../fire/fire";
YellowBox.ignoreWarnings(["Setting a timer"]);
export default class CustomerMap extends React.Component {
  constructor() {
    super();
    //console.ignoredYellowBox = ["Setting a timer"];
  }
  state = {
    direct: false,
    latitude: null,
    longitude: null,
    locations: null,
    status: "",
    errorMessage: "",
  };

  async componentDidMount() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    this.setState({ status });
    if (status != "granted") {
      console.log("Permission Not Granted");
      this.setState({
        errorMessage: "Permission Not Granted",
      });
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        this.setState({ latitude, longitude }),

      (error) => alert("Error:", error)
    );
    if (this.state.locations !== null) {
      const {
        locations: [sampleLocation],
      } = this.state;

      this.setState(
        {
          desLatitude: sampleLocation.coords.latitude,
          desLongitude: sampleLocation.coords.longitude,
        },
        this.mergeCoords
      );
    }
  }
  mergeCoords = () => {
    const { latitude, longitude, desLatitude, desLongitude } = this.state;

    const hasStartAndEnd = latitude !== null && desLatitude !== null;

    if (hasStartAndEnd) {
      const concatStart = `${latitude},${longitude}`;
      const concatEnd = `${desLatitude},${desLongitude}`;
      this.getDirections(concatStart, concatEnd);
    }
  };

  async getDirections(startLoc, desLoc) {
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=AIzaSyD2vh_F2wnqkeeLF2d8rC4AuzYV0F3hDYs`
      );
      const respJson = await resp.json();
      const response = respJson.routes[0];
      const distanceTime = response.legs[0];
      const distance = distanceTime.distance.text;
      const time = distanceTime.duration.text;
      const points = Polyline.decode(
        respJson.routes[0].overview_polyline.points
      );

      const coords = points.map((point) => {
        //alert(point);
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      //alert(JSON.stringify(coords));
      this.setState({ coords, direct: true, distance, time });
    } catch (error) {
      alert("Error: ", error);
    }
  }

  afterrender = () => {
    const { navigation } = this.props;
    const userData = navigation.getParam("list", null);
    //const status=navigation.getParam("status", null);
    if (this.state.latitude) {
      Fire.shared
        .searchingforVendors({
          currentLatitude: this.state.latitude,
          currentLongitude: this.state.longitude,
          Items: userData,
        })
        .then((ref) => {
          this.setState({ locations: ref });
        });
    }
  };
  onMarkerPress = (location, idx) => () => {
    const {
      coords: { latitude, longitude },
    } = location;
    this.setState(
      {
        destination: location,
        desLatitude: latitude,
        desLongitude: longitude,
      },
      /*this._map.animateToRegion({
        latitude: this.state.desLatitude,
        longitude: this.state.desLongitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }),*/
      //this._carousel.snapToItem(idx),
      this.mergeCoords
    );
  };

  viewing = () => {
    if (this.state.locations !== null) {
      const { locations } = this.state;

      if (locations) {
        //alert(JSON.stringify(locations));
        return (
          <View>
            {locations.map((location, idx) => {
              const {
                coords: { U, k },
                //UID: name,
              } = location;

              return (
                <Marker
                  key={idx}
                  coordinate={{ latitude: U, longitude: k }}
                  onPress={this.onMarkerPress(location, idx)}
                />
              );
            })}
          </View>
        );
      }
    }
  };

  onCarouselItemChange = (index) => {
    let location = this.state.locations[index];
    this._map.animateToRegion({
      latitude: location.coords.U,
      longitude: location.coords.k,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };
  _renderItem = ({ item, index }) => {
    // alert(JSON.stringify(item));
    const DATA = item.vendorInvn;
    return (
      <View style={styles.cardContainer} pointerEvents="box-none">
        <Text style={styles.cardTitleText}>
          {item.coords.U}
          {"\n"}
          {item.coords.k}
          {"\n"}
        </Text>

        <View>
          <Button
            onPress={
              () => {
                this.props.navigation.navigate("CONFIRMATION", {
                  availableItems: item,
                });
              }
              //this._carousel.snapToItem(index);
            }
            title="ckeck out"
          ></Button>
        </View>
      </View>
    );
  };

  render() {
    const {
      time,
      distance,
      latitude,
      longitude,
      coords,
      locations,
      destination,
    } = this.state;

    if (latitude && locations !== null && coords === null) {
      return (
        <SafeAreaView style={styles.container}>
          <View>
            <MapView
              showsUserLocation={true}
              showsMyLocationButton={true}
              ref={(map) => (this._map = map)}
              style={styles.mapStyle}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {this.viewing()}
            </MapView>
            <Carousel
              ref={(c) => {
                this._carousel = c;
              }}
              data={this.state.locations}
              containerCustomStyle={styles.carousel}
              renderItem={this._renderItem}
              sliderWidth={Dimensions.get("window").width}
              itemWidth={300}
              removeClippedSubviews={false}
              onSnapToItem={(index) => this.onCarouselItemChange(index)}
            />
          </View>
        </SafeAreaView>
      );
    }
    if (latitude && locations !== null) {
      return (
        <SafeAreaView style={styles.container}>
          <View>
            <MapView
              showsUserLocation={true}
              showsMyLocationButton={true}
              ref={(map) => (this._map = map)}
              style={styles.mapStyle}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {this.viewing()}
              {this.state.direct && (
                <MapView.Polyline
                  strokeWidth={2}
                  strokeColor="red"
                  coordinates={coords}
                />
              )}
            </MapView>
            <Carousel
              ref={(c) => {
                this._carousel = c;
              }}
              data={this.state.locations}
              containerCustomStyle={styles.carousel}
              renderItem={this._renderItem}
              sliderWidth={Dimensions.get("window").width}
              itemWidth={300}
              removeClippedSubviews={false}
              onSnapToItem={(index) => this.onCarouselItemChange(index)}
            />
          </View>
        </SafeAreaView>
      );
    }

    if (latitude) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>We need your permission!</Text>
          <View>
            <Button
              style={{
                width,
                paddingTop: 10,
                alignSelf: "center",
                alignItems: "center",
                height: height * 0.15,
                backgroundColor: "white",
                justifyContent: "flex-end",
              }}
              title="Confirmlocation"
              onPress={this.afterrender}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Setting you up!</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  carousel: {
    position: "absolute",
    bottom: 0,
    marginBottom: -500,
  },
  cardContainer: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: 200,
    width: 300,
    borderRadius: 24,
  },
  cardTitleText: {
    color: "white",
    fontSize: 22,
    alignSelf: "center",
  },
});
