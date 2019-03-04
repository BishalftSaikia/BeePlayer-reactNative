import React, { Component } from "react";
import { BackHandler } from "react-native";
import { Router, Scene, Actions } from "react-native-router-flux";
import MediaList from "./components/screens/mediaList";
import ArtistList from "./components/screens/artistList";
import AlbumList from "./components/screens/albumList";

export default class RootRouter extends Component {
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    if (Actions.currentScene === "Songs") {
      BackHandler.exitApp();
    }
  };

  render() {
    return (
      <Router backAndroidHandler={() => this.onBackPress()}>
        <Scene key="root">
          <Scene
            key="tab"
            onScroll={this.props.onScroll}
            playTrack={this.props.playTrack} //..... Changing Song
            songsArray={this.props.songsArray}
            title="Home"
            tabs
            tabBarPosition="top"
            tabBarStyle={{
              backgroundColor: "white",
              height: "8%"
              // borderTopColor: "#ffc1cc",
              // borderTopWidth: 1
            }}
            hideNavBar
            // navigationBarStyle={{
            //   backgroundColor: "rgb(202,204,206)"
            // }}
            inactiveTintColor="grey"
            activeTintColor="black"
            indicatorStyle={{ backgroundColor: "#f7cac9" }}
          >
            <Scene
              key="mediaList"
              component={MediaList}
              title="Songs"
              hideNavBar
            />
            <Scene
              key="albumList"
              component={AlbumList}
              title="Albums"
              hideNavBar
            />
            <Scene
              key="artistList"
              component={ArtistList}
              title="Artists"
              hideNavBar
            />
          </Scene>
        </Scene>
      </Router>
    );
  }
}
