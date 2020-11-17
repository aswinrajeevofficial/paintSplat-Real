import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Alert
} from 'react-native';

import Pusher from 'pusher-js/react-native';

import Header from './Header';
import Home from './Home';
import Board from './Board';

import shortid  from 'shortid';
import Spinner from 'react-native-spinkit';
import SinglePlayer from './SinglePlayer';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      piece: '',
      rival_username: '',
      is_playing: false,
      is_playingSp: false,
      show_prompt: false,
      is_waiting: false,
      is_room_creator: false
    }

    this.game_channel = null;
    this.is_channel_binded = false;

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onPressCreateRoom = this.onPressCreateRoom.bind(this);
    this.onPressCreateRoomSP = this.onPressCreateRoomSP.bind(this);
    this.onPressJoinRoom = this.onPressJoinRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.joinRoom2 = this.joinRoom2.bind(this);
    this.onCancelJoinRoom = this.onCancelJoinRoom.bind(this);
    this.endGame = this.endGame.bind(this);
    this.onPressHome = this.onPressHome.bind(this);
  }

  componentDidMount(){
    this.pusher = new Pusher('686afe039b977ed6da75', {
      authEndpoint: 'https://739a4e7cebf0.ngrok.io/pusher/auth',
      cluster: 'eu',
      encrypted: true
    });
  }

  componentDidUpdate() {
    if(this.state.is_waiting && !this.is_channel_binded){

      this.game_channel.bind('client-joined', (data) => {
        this.setState({
          is_waiting: false,
          is_playing: true,
          rival_username: data.username
        });

        if(this.state.is_room_creator){
          this.game_channel.trigger('client-joined', {
            username: this.state.username
          });
        }

      });

      this.is_channel_binded = true;

    }
  }

  render() {
    return(
    <View style={styles.container}>
      <Header 
      onPressHome = {this.onPressHome}
      title={"PaintSplat"} 
      />
      <Spinner
          style={styles.spinner}
          isVisible={this.state.is_waiting}
          size={75}
          type={"WanderingCubes"}
          color={"#549eff"}
        />
        {
          !this.state.is_playingSp && !this.state.is_playing && !this.state.is_waiting &&
          <Home
            username={this.state.name}
            onChangeUsername={this.onChangeUsername}
            onPressCreateRoom={this.onPressCreateRoom}
            onPressCreateRoomSP={this.onPressCreateRoomSP}
            onPressJoinRoom={this.onPressJoinRoom}
            
            joinRoom={this.joinRoom}
            show_prompt={this.state.show_prompt}
            onCancelJoinRoom={this.onCancelJoinRoom}
          />
        }
        {
          this.state.is_playingSp &&
          <SinglePlayer
            username={this.state.username}
            piece={this.state.piece}
            is_room_creator={this.state.is_room_creator}
            endGame={this.endGame}
          />
        }
        {
          this.state.is_playing &&
          <Board
            channel={this.game_channel}
            username={this.state.username}
            piece={this.state.piece}
            rival_username={this.state.rival_username}
            is_room_creator={this.state.is_room_creator}
            endGame={this.endGame}
          />
        }
    </View>
    );
  }

  onChangeUsername(username) {
    this.setState({username});
  }


  onPressCreateRoom() {

    let room_id = shortid.generate();
    this.game_channel = this.pusher.subscribe('private-' + room_id);

    // alert the user of the ID that the friend needs to enter
    Alert.alert(
      'Share this room ID to your friend',
      room_id,
      [
        {text: 'Done'},
      ],
      { cancelable: false }
    );

    // show loading state while waiting for someone to join the room
    this.setState({
      piece: 'X', // room creator is always X
      is_waiting: true,
      is_room_creator: true
    });

  }

  onPressCreateRoomSP() {

    // show loading state while waiting for someone to join the room
    this.setState({
      piece: 'X', // room creator is always X
      is_room_creator: true,
      is_playingSp: true
    }); 
  }

  onPressHome(){
    this.endGame();
  }


  onPressJoinRoom() {
    this.setState({
      show_prompt: true
    });
  }


  joinRoom(room_id) {
    this.game_channel = this.pusher.subscribe('private-' + room_id);
    setTimeout(this.joinRoom2, 2000)
  }

  joinRoom2(){
    this.game_channel.trigger('client-joined', {
      username: this.state.username
    });

    this.setState({
      piece: 'O',
      show_prompt: false,
      is_waiting: true
    });
  }

  onCancelJoinRoom() {
    this.setState({
      show_prompt: false
    });
  }


  endGame() {
    this.setState({
      username: '',
      piece: '',
      rival_username: '',
      is_playing: false,
      show_prompt: false,
      is_waiting: false,
      is_room_creator: false,
      is_playingSp: false
    });

    this.game_channel = null;
    this.is_channel_binded = false;
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fcbe11',
  },
  spinner: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 50
  }
});