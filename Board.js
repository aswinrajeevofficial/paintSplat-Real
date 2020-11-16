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

const height_proportion = '80%';
const width_proportion = '95%';
const border_radius = 30;

export default class Board extends Component {

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
            x_score: 0,
            o_score: 0
        }

        this.oColor = '#0092CC';
        this.xColor = '#779933';
        this.backgroundColor = '#fcbe11';

    }


    componentDidMount() {

        this.props.channel.bind('client-make-move', (data) => {
            let moves = this.state.moves;
            let id = this.ids[data.row_index][data.index];
            moves[id] = data.piece;

            this.setState({
                moves
            });

            this.updateScores.call(this, moves);
        });

    }


    updateScores(moves) {

        // Get current user scores
        var pieces = {
            'X': this.state.x_score,
            'O': this.state.o_score
        }

        // Opponent added a dot
        // Update score for their character
        if(this.props.is_room_creator) {
            pieces['O'] += 1;
        } else {
            pieces['X'] += 1;
        }

        // Save the score
        this.setState({
            x_score: pieces['X'],
            o_score: pieces['O']
        });

    }

    render() {
        if(this.props.is_room_creator) {
            var user_score = this.state.x_score;
            var user_color = this.state.xColor;

            var opponent_score = this.state.o_score;
            var opponent_color = this.state.oColor;
        } else {
            var user_score = this.state.o_score;
            var user_color = this.state.oColor;

            var opponent_score = this.state.x_score;
            var opponent_color = this.state.xColor;
        }

        return (
            <View style={styles.board_container}>
                <View style={styles.board}>
                    {this.generateRows()}
                </View>

                <View style={styles.scores_container}>

                    <View style={styles.score}>
                        <Text style={[styles.user_score, {color: user_color}]}>
                            {user_score}
                        </Text>
                        <Text style={[styles.username, {color: user_color}]}>
                            {this.props.username}
                        </Text>
                    </View>

                    <View style={styles.score}>
                        <Text style={[styles.user_score, {color: opponent_color}]}>
                            {opponent_score}
                        </Text>
                        <Text style={[styles.username, {color: opponent_color}]}>
                            {this.props.rival_username}
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


    generateBlocks(row, row_index) {
        return row.map((block, index) => {
            let id = this.ids[row_index][index];

            var color;
            // Pippa look here
            if(this.state.moves[id] == 'X') {
                color = this.xColor;
            } else if(this.state.moves[id] == 'O') {
                color = this.oColor;
            } else {
                // Dot has not been clicked yet
                // Set color of square to black
                color = '#000';
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
            'X': this.state.x_score,
            'O': this.state.o_score
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
                    x_score: pieces['X']
                });
            }else if(this.props.piece === 'O'){
                pieces['O'] += 1;
                this.setState({
                    o_score: pieces['O']
                });
            }

            this.props.channel.trigger('client-make-move', {
                row_index: row_index,
                index: index,
                piece: this.props.piece
            });

        }

        // alert the room creator if they want to restart the game or call it quits
        if(this.props.is_room_creator && moves.indexOf('') == -1){
            Alert.alert(
              "Restart Game",
              "Do you want to restart the game?",
              [
                {
                  text: "Nope. Let's call it quits.",
                  onPress: () => {
                    this.setState({
                                moves: range(36).fill(''),
                                x_score: 0,
                                o_score: 0
                            });
                            this.props.endGame();
                  },
                  style: 'cancel'
                },
                {
                  text: 'Heck yeah!',
                  onPress: () => {
                            this.setState({
                                moves: range(36).fill(''),
                                x_score: 0,
                                o_score: 0
                            });
                  }
                },
              ],
              { cancelable: false }
            );
        }
    }

}

const styles = StyleSheet.create({
    board_container: {
        flex: 9
    },
    board: {
        flex: 7,
        flexDirection: 'column',
        borderWidth: 2,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        //borderBottomWidth: 1,
    },
    block: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    dot_style: {
        width: width_proportion,
        height: height_proportion,
        borderRadius: border_radius,
        color: '#000',
    },
    scores_container: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center'
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
        fontSize: 20
    }
});


Board.propTypes = {
    channel: PropTypes.object,
    username: PropTypes.string,
    color: PropTypes.string,
    piece: PropTypes.string,
    rival_username: PropTypes.string,
    is_room_creator: PropTypes.bool,
    endGame: PropTypes.func.isRequired
}