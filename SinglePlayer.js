import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Alert
} from 'react-native';

import range from 'lodash.range';

const board_height = '50%';
const board_width = '60%';
const board_inner_padding = '1%';

const height_proportion = '80%';
const width_proportion = '95%';
const border_radius = 33;

export default class SinglePlayer extends Component {

    constructor() {
        super();

        this.generateRows = this.generateRows.bind(this);
        this.generateBlocks = this.generateBlocks.bind(this);

        this.ids = [
            [0, 1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10, 11],
            [12, 13, 14, 15, 16, 17],
            [18, 19, 20, 21, 22, 23],
            [24, 25, 26, 27, 28, 29],
            [30, 31, 32, 33, 34, 35],
        ];

        var num_of_cols = 6;
        this.rows = [
            range(6).fill(''),
            range(6).fill(''),
            range(6).fill(''),
            range(6).fill(''),
            range(6).fill(''),
            range(6).fill('')
        ];

        this.state = {
            moves: range(36).fill(''),
            player_1: 0
        }
        this.xColor = '#779933';
        this.backgroundColor = '#fcbe11';

	}

    updateScores(moves) {

        // Get current user scores
        var pieces = {
            'X': this.state.player_1
        }

        // Opponent added a dot
        // Update score for their character
        if(this.props.is_room_creator) {
            pieces['X'] += 1;
        }

        // Save the score
        this.setState({
            player_1: pieces['X']
        });

        if(moves.indexOf('') == -1){
            this.endGame();
        }

    }

    render() {
        if(this.props.is_room_creator) {
            var user_score = this.state.player_1;
            var user_color = this.state.xColor;
        } else {
            var user_score = this.state.o_score;
            var user_color = this.state.oColor;
        }
        var left = this.getRandomValue(0, 45) + '%';
        var top = this.getRandomValue(0, 60) + '%';

        return (
            <View style={styles.page_container}>
                <View style={styles.board_container}>
                        <View style={[styles.board, {marginLeft: left, marginTop: top}]}>
                            {this.generateRows()}
                        </View>
                    </View>

                    <View style={styles.scores_container}>
                        <View style={styles.score}>
                            <Text style={[styles.user_score, {color: this.xColor}]}>
                                {user_score}
                            </Text>
                            <Text style={[styles.username, {color: this.xColor}]}>
                                {this.props.username}
                            </Text>
                        </View>
                    </View>

            </View>
        );
    }


    generateRows() {
        return this.rows.map((row, index) => {
            return (
                <View style={styles.row} key={index}>
                    {this.generateBlocks(row, index)}
                </View>
            );
        });
    }

    getRandomValue(min, max) {
        return String(Math.random() * (max - min) + min);
    }

    generateBlocks(row, row_index) {
        return row.map((block, index) => {
            let id = this.ids[row_index][index];

            var color;
            // Pippa look here
            if(this.state.moves[id] == 'X') {
                color = this.xColor;
            }else {
                // Dot has not been clicked yet
                // Set color of square to black
                color = this.backgroundColor;
            }

            return (
                <TouchableHighlight
                    key={index}
                    onPress={this.onMakeMove.bind(this, row_index, index)}
                    underlayColor={"#CCC"}
                    style={styles.block}>

                    <Text style={[styles.dot_style, {backgroundColor:color}]}>

                    </Text>

                </TouchableHighlight>
            );
        });
    }


    onMakeMove(row_index, index) {

        var pieces = {
            'X': this.state.player_1
        }

        let moves = this.state.moves;
        let id = this.ids[row_index][index];

        if(!moves[id]){ // nobody has occupied the space yet

            moves[id] = this.props.piece;
            this.setState({
                moves
            });

            if(this.props.piece === 'X'){
                pieces['X'] += 1;
                this.setState({
                    player_1: pieces['X']
                });
            }
        }

        if(moves.indexOf('') == -1){
            this.endGame();
        }

    }

    endGame() {
        // All squares have been filled
        // I.e.: no more moves can be made - end game

        var player_1 = this.state.player_1

        var winner = '';
        winner = this.props.username;

        // Add in if statement here
        Alert.alert(
            "The winner is: " + winner,
            "Do you want to restart the game?",
          [
            {
              text: "I'm Out",
              onPress: () => {
                this.setState({
                            moves: range(36).fill(''),
                            player_1: 0
                        });
                        this.props.endGame();
              },
              style: 'cancel'
            },
            {
              text: 'Let\'s do this!',
              onPress: () => {
                        this.setState({
                            moves: range(36).fill(''),
                            player_1: 0
                        });
              }
            },
          ],
          { cancelable: false }
        );
    }

}

const styles = StyleSheet.create({
    page_container: {
        flex: 9,
    },
    board_container: {
        flex: 6
    },
    board: {
        //flex: 1,
        //flexDirection: 'column',
        borderWidth: 4,
        padding: board_inner_padding,
        borderRadius: 18,
        height: board_height,
        width: board_width
    },
    row: {
        flex: 9,
        flexDirection: 'row',
        //borderBottomWidth: 1,
    },
    block: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot_style: {
        width: width_proportion,
        height: height_proportion,
        color: '#000',
        borderRadius: border_radius
    },
    scores_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        borderRadius: 18
    },
    score: {
        flex: 1,
        alignItems: 'center'
    },
    user_score: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});


SinglePlayer.propTypes = {
    channel: PropTypes.object,
    username: PropTypes.string,
    color: PropTypes.string,
    piece: PropTypes.string,
    rival_username: PropTypes.string,
    is_room_creator: PropTypes.bool,
    endGame: PropTypes.func.isRequired
}