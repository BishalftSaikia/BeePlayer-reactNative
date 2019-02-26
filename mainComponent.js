import React, { Component } from "react";
import {
  AsyncStorage,
  View,
  DeviceEventEmitter,
  PermissionsAndroid,
  Alert,
  BackHandler,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions
} from "react-native";
import NowPlaying from "./components/screens/nowPlaying";
import RootRouter from "./router";
import MusicFiles from "react-native-get-music-files";

const screenHeight = Dimensions.get("window").height;
const navHeight = 0.1 * screenHeight;

export default class MainComponent extends Component {
  state = {
    loading: false,
    songsArray: [],
    queueList: [],
    index: null
  };

  componentWillMount() {
    this.animation = new Animated.Value(0);
    DeviceEventEmitter.addListener("onBatchReceived", params => {
      this.setState({
        loading: true,
        songsArray: [...this.state.songsArray, ...params.batch]
      });
    });
  }

  componentDidMount() {
    this.getMedia();
  }

  componentWillUnmount() {
    AsyncStorage.setItem("songsArray", JSON.stringify(this.state.songsArray));
  }

  getMedia = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Bee Player Permission",
          message: "Bee Player would like to have access to Device Storage"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let index = JSON.parse(await AsyncStorage.getItem("currentSong"));
        let songsArray = JSON.parse(await AsyncStorage.getItem("songsArray"));
        let queueList = JSON.parse(await AsyncStorage.getItem("queueList"));

        if (songsArray) {
          this.setState({
            loading: true,
            songsArray,
            queueList,
            index
          });
        } else {
          MusicFiles.getAll({
            id: true,
            title: true,
            artist: true,
            duration: true, //default : true
            cover: true, //default : true,
            batchNumber: 7,
            minimumSongDuration: 10000 //in miliseconds,
          });
        }
      } else {
        Alert.alert(
          "Permission Denied",
          "Exit App or Refresh",
          [
            {
              text: "Refresh",
              onPress: () => this.getMedia(),
              style: "cancel"
            },
            { text: "Exit", onPress: () => BackHandler.exitApp() }
          ],
          { cancelable: false }
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  newSongPlay = (index, songlist) => {
    AsyncStorage.setItem("queueList", JSON.stringify(songlist));
    AsyncStorage.setItem("currentSong", JSON.stringify(index));
    this.refs.nowChild.playSong(index, songlist);
  };

  /*offset = 0;
  tabChanged = false;
  direction = "";
  onScroll = y => {
    if (y > this.offset) {
      //.......................................DownwardMovement
      this.direction = "down";
      this.offset = y;
      this.animation.setValue(y);
    } else if (y < this.offset && this.direction === "down") {
      //.......................................upwardMovement
      this.tabChanged = true;
      this.offset = y;
    } else if (y < this.offset || this.tabChanged) {
      //.......................................upwardMovement
      this.offset = y;
      Animated.spring(this.animation, {
        toValue: 0,
        tension: 1
      });
    }
  };*/

  render() {
    navBarHeight = this.animation.interpolate({
      inputRange: [0, 100],
      outputRange: [navHeight, 0],
      extrapolate: "clamp"
    });
    navBarOpacity = this.animation.interpolate({
      inputRange: [0, 50, 120],
      outputRange: [1, 0, 0],
      extrapolate: "clamp"
    });
    if (this.state.loading) {
      if (this.state.songsArray.length) {
        return (
          <View style={{ flex: 1 }}>
            <View //................Make it animated View OnScroll
              style={{
                backgroundColor: "rgb(202,204,206)",
                height: navHeight, //.........Make it navBarHeight
                //opacity: navBarOpacity,
                width: "100%",
                flexDirection: "column"
              }}
            >
              <View
                style={{
                  flex: 3,
                  justifyContent: "center",
                  alignContent: "center",
                  paddingLeft: 20
                }}
              >
                <Text style={{ fontSize: 20, color: "black" }}>Home</Text>
              </View>
            </View>
            <RootRouter //.........................................................RootRouter
              onScroll={this.onScroll}
              playTrack={this.newSongPlay}
              songsArray={this.state.songsArray}
            />
            <NowPlaying //.........................................................NowPlaying
              ref="nowChild"
              index={this.state.index}
              queueList={this.state.queueList}
            />
          </View>
        );
      } else {
        return (
          <View style={styles.container}>
            <Text style={{ color: "black" }}>No Media Files Found</Text>
            <TouchableOpacity
              onPress={() => {
                this.getMedia();
              }}
              style={styles.scan}
            >
              <Text style={{ color: "black", padding: 10 }}>Scan</Text>
            </TouchableOpacity>
          </View>
        );
      }
    } else {
      return null;
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  },
  scan: {
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  }
});
