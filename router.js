import React, { Component } from "react";
import { BackHandler } from "react-native";
import { Router, Scene, Actions } from "react-native-router-flux";
import MediaList from "./components/screens/mediaList";
import ArtistList from "./components/screens/artistList";
import AlbumList from "./components/screens/albumList";
import { customColor } from "./customColor";

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
              backgroundColor: customColor.primaryColor,
              height: "8%",
              borderBottomColor: customColor.textSecondaryColor,
              borderBottomWidth: 1
            }}
            hideNavBar
            inactiveTintColor={customColor.textSecondaryColor}
            activeTintColor={customColor.activeColor}
            indicatorStyle={{ backgroundColor: customColor.activeColor }}
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
