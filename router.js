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

  onBackPress = async () => {
    let bool = this.props.nowPlayingStat("state");
    if (bool == false) {
      BackHandler.exitApp();
    } else if (bool == true) {
      this.props.nowPlayingStat("closeNowPlaying");
    }
  };

  render() {
    return (
      <Router backAndroidHandler={() => this.onBackPress()}>
        <Scene key="root">
          <Scene
            key="tab"
            playTrack={this.props.playTrack} //..... Changing Song
            songsArray={this.props.songsArray}
            currentSong={this.props.currentSong}
            title="Home"
            tabs
            tabBarPosition="top"
            tabBarStyle={{
              backgroundColor: customColor.secondaryColor,
              height: "7%"
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
