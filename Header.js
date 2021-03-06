import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';


export default class Header extends Component {

  render() {
    return (
      <View style={styles.title_container}>
        <Text style={styles.title}>{this.props.title}</Text>
        <Button
              onPress={this.props.onPressHome}
              title="Home"
              color="#4c87ea"
          />
      </View>
    );
  }

}


const styles = StyleSheet.create({
  title_container: {
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    letterSpacing: 1,
  }
});


Header.propTypes = {
  title: PropTypes.string.isRequired
}