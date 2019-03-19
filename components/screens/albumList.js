import React, { Component } from "react";
import { StyleSheet, FlatList, Dimensions, Modal, View } from "react-native";

import { customColor } from "../../customColor";
import LinearGradient from "react-native-linear-gradient";

import AlbumGridView from "./albumGridView";
import ModalList from "./modalListAlbum";

const itemWidth = Dimensions.get("window").width;

export default class AlbumList extends Component {
  state = {
    songsArray: [],
    visible: false,
    index: ""
  };

  componentDidMount() {
    this.arrangeAlbum();
  }

  arrangeAlbum = async () => {
    let albumArray = [],
      temp = [],
      repeatArr = null;
    songStorage = [].concat(this.props.songsArray).sort((a, b) => {
      let song1 = a.album == null ? "unknown" : a.album.toLowerCase();
      let song2 = b.album == null ? "unknown" : b.album.toLowerCase();
      if (song1 < song2) {
        return -1;
      }
      if (song1 > song2) {
        return 1;
      }
      return 0;
    });
    for (let i = 0; i < songStorage.length; i++) {
      if (songStorage[i].album != repeatArr || i == 0) {
        repeatArr = songStorage[i].album;
        temp.push(songStorage[i]);
        for (let j = 0; j < songStorage.length; j++) {
          if (i != j && songStorage[i].album == songStorage[j].album) {
            temp.push(songStorage[j]);
          }
        }
        albumArray.push(temp);
        temp = [];
      }
    }
    this.setState({ songsArray: albumArray });
  };

  modalFn = data => {
    this.setState({ visible: true, index: data });
  };

  modalVisibility = bool => {
    this.setState({ visible: bool });
  };

  render() {
    return (
      <LinearGradient
        colors={["#bbd2c5", "#536976", "#292e49"]}
        style={styles.container}
      >
        <Modal
          transparent={false}
          visible={this.state.visible}
          onRequestClose={() => this.modalVisibility(false)}
        >
          <ModalList
            modalData={this.state.songsArray[this.state.index]}
            modalVisibility={this.modalVisibility}
            playTrack={this.props.playTrack}
          />
        </Modal>

        <FlatList
          numColumns={2}
          style={styles.container}
          ListFooterComponent={
            <View style={{ height: 0, marginBottom: "18%" }} />
          }
          data={this.state.songsArray}
          renderItem={({ item, index }) => (
            <AlbumGridView
              itemWidth={itemWidth}
              item={item}
              index={index}
              modalFn={this.modalFn}
              playTrack={this.props.playTrack}
            />
          )}
          keyExtractor={item => item[0].id}
        />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
