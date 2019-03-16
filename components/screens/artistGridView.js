import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
const api_key = "7a3b962cc11e7d3e248140f9bd86ca82";

import { customColor } from "../../customColor";

export default class ArtistGridView extends Component {
  state = {
    uri: "",
    item: this.props.item,
    index: this.props.index
  };
  componentDidMount() {
    if (
      this.state.item[0].author != null &&
      this.state.item[0].author != "unknown"
    ) {
      setTimeout(() => {
        this.fetchArtistInfo();
      }, 200);
    }
  }

  fetchArtistInfo = () => {
    let artist = this.state.item[0].author.split("com")[0].split("wwww")[0];
    fetch(
      "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" +
        artist +
        "&api_key=" +
        api_key +
        "&format=json"
    )
      .then(response => {
        if (!response.ok) {
          console.log("response error" + response.statusText);
        }
        return response;
      })
      .then(response => {
        response.json().then(res => {
          if (res.artist) {
            this.setState({ uri: res.artist.image[5]["#text"] });
          }
        });
      })
      .catch(error => {
        console.log("error" + error);
      });
  };

  render() {
    const widthItem = (this.props.itemWidth - 12) / 2;
    return (
      <TouchableOpacity
        style={[styles.container, { width: widthItem }]}
        onPress={() => this.props.modalFn(this.state.index, this.state.uri)}
      >
        <Image
          source={
            this.state.uri
              ? { uri: this.state.uri }
              : require("../../iconPNG/unknownArtist.png")
          }
          style={styles.artistView}
        />
        <View
          style={{
            width: "90%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={styles.artistText} numberOfLines={1}>
            {this.state.item[0].author
              ? this.state.item[0].author
              : "Unknown Artist"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 3,
    marginRight: 3,
    marginTop: 5,
    marginBottom: 5,
    height: 170,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  artistView: {
    width: 140,
    height: 140,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center"
  },
  artistText: {
    paddingTop: 8,
    fontSize: 14,
    color: customColor.textPrimaryColor,
    padding: 2
  }
});
