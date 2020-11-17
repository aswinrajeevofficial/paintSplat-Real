import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button
} from 'react-native';

import Prompt from 'react-native-prompt';

export default class Home extends Component {

    render() {

      return (
        <View style={styles.content_container}>
          <View style={styles.input_container}>
            <TextInput
              style={styles.text_input}
              onChangeText={this.props.onChangeUsername}
              placeholder={"Enter your username"}
              maxLength={20}
              value={this.props.username}
            />
          </View>

          <View style={styles.button_container}>
            <Button
              onPress={this.props.onPressCreateRoom}
              title="Create Room"
              color="#4c87ea"
              style={styles.button}
            />
            <Button
              onPress={this.props.onPressJoinRoom}
              title="Join Room"
              color="#1C1C1C"
              style={styles.button}
            />
          </View>

          <Prompt
            title="Enter Room Name"
            visible={this.props.show_prompt}
            onSubmit={this.props.joinRoom}
            onCancel={this.props.onCancelJoinRoom}
          />
        </View>
      );
    }


  }

  const styles = StyleSheet.create({
    content_container: {
      flex: 1,
    },
    input_container: {
      marginBottom: 20
    },
    button_container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    text_input: {
      backgroundColor: '#FFF',
      color: '#000',
      height: 40,
      borderColor: '#CCC',
      borderWidth: 1,
      marginHorizontal: 25,
      paddingHorizontal: 20
    },
    button: {
      flex: 1,
      padding: 6,
      // borderRadius: 50,
    }
  });

  Home.propTypes = {
    username: PropTypes.string,
    onPressCreateRoom: PropTypes.func.isRequired,
    onPressJoinRoom: PropTypes.func.isRequired,
    show_prompt: PropTypes.bool.isRequired,
    joinRoom: PropTypes.func.isRequired,
    onCancelJoinRoom: PropTypes.func.isRequired
  }