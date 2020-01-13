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
  StatusBar
} from "react-native";
import NowPlaying from "./components/screens/nowPlaying";
import RootRouter from "./router";
import MusicFiles from "react-native-get-music-files";
import NavBar from "./components/screens/navBar";
import Loading from "./components/screens/Loading";

export default class MainComponent extends Component {
  state = {
    loading: false,
    songsArray: [],
    queueList: [],
    index: null,
    currentSong: null
  };

  componentWillMount() {
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
        this.pause = JSON.parse(await AsyncStorage.getItem("playing"));
        this.duration = JSON.parse(await AsyncStorage.getItem("duration"));
        this.playSeconds = JSON.parse(
          await AsyncStorage.getItem("playSeconds")
        );
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
    this.refs.nowChild.playSong(index, songlist);
  };

  updateCurrentSong = item => {
    this.setState({ currentSong: item });
  };

  nowPlayingStat = stat => {
    if (stat == "state") {
      let bool = this.refs.nowChild.nowPlayingStat("state");
      return bool;
    } else if (stat == "closeNowPlaying") {
      this.refs.nowChild.nowPlayingStat("closeNowPlaying");
    }
  };

  render() {
    if (this.state.loading) {
      if (this.state.songsArray.length) {
        return (
          <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#bbd2c5" />
            <NavBar heading="Beeplayer" />
            <RootRouter //.........................................................RootRouter
              playTrack={this.newSongPlay}
              songsArray={this.state.songsArray}
              nowPlayingStat={this.nowPlayingStat}
              currentSong={this.state.currentSong}
            />
            <NowPlaying //.........................................................NowPlaying
              ref="nowChild"
              index={this.state.index}
              queueList={this.state.queueList}
              pause={this.pause}
              duration={this.duration}
              playSeconds={this.playSeconds}
              updateCurrentSong={this.updateCurrentSong}
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
      return <Loading />;
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
