import React, { Component } from "react";
import {
  StyleSheet,
  FlatList,
  StatusBar,
  Dimensions,
  Modal,
  View
} from "react-native";

import { customColor } from "../../customColor";
import LinearGradient from "react-native-linear-gradient";

import ArtistGridView from "./artistGridView";
import ModalList from "./modalListArtist";

const itemWidth = Dimensions.get("window").width;

export default class ArtistList extends Component {
  state = {
    songsArray: [],
    visible: false,
    index: "",
    uri: ""
  };

  componentDidMount() {
    this.arrangeArtist();
  }

  arrangeArtist = () => {
    let artistArray = [],
      temp = [],
      repeatArr = null;

    let songStorage = [].concat(this.props.songsArray).sort((a, b) => {
      let song1 = a.author == null ? "unknown" : a.author.toLowerCase();
      let song2 = b.author == null ? "unknown" : b.author.toLowerCase();
      if (song1 < song2) {
        return -1;
      }
      if (song1 > song2) {
        return 1;
      }
      return 0;
    });
    for (var i = 0; i < songStorage.length; i++) {
      if (songStorage[i].author != repeatArr || i == 0) {
        repeatArr = songStorage[i].author;
        temp.push(songStorage[i]);
        for (var j = 0; j < songStorage.length; j++) {
          if (i != j && songStorage[i].author == songStorage[j].author) {
            temp.push(songStorage[j]);
          }
        }
        artistArray.push(temp);
        temp = [];
      }
    }
    this.setState({ songsArray: artistArray });
  };

  modalFn = (data, uri) => {
    this.setState({ visible: true, index: data, uri: uri });
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
            uri={this.state.uri}
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
            <ArtistGridView
              itemWidth={itemWidth}
              item={item}
              index={index}
              modalFn={this.modalFn}
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
