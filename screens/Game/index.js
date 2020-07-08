import React, { Component, Fragment } from 'react';
import { View, Dimensions, TouchableOpacity, Text, Image } from 'react-native';
import { Header } from '../../components';
import { Audio } from 'expo-av'
import styles from './styles';
import { generateRGB, mutateRGB } from '../../utilities';

export default class Home extends Component {
  state = {
    points: 0,
    timeLeft: 15,
    rgb: generateRGB(),
    size: 2,
    gameState: 'INGAME'
  };

  async UNSAFE_componentWillMount(){
    this.generateNewRound()
    this.interval = setInterval(async() => {
      if (this.state.gameState === "INGAME") {
        if (this.state.timeLeft <= 0) {
          this.loseFX.replayAsync();
          this.backgroundMusic.stopAsync();
          this.setState({ timeLeft: 0, gameState: 'LOST' });
        } else {
          this.setState({ timeLeft: this.state.timeLeft - 1 });
        }
      }
    }, 1000);
    this.backgroundMusic = new Audio.Sound();
    this.buttonFX = new Audio.Sound();
    this.tileCorrectFX = new Audio.Sound();
    this.tileWrongFX = new Audio.Sound();
    this.pauseInFX = new Audio.Sound();
    this.pauseOutFX = new Audio.Sound();
    this.loseFX = new Audio.Sound();

    try {
      await this.backgroundMusic.loadAsync(
        require('../../assets/music/Komiku_BattleOfPogs.mp3'),
      );
      await this.buttonFX.loadAsync(require('../../assets/sfx/button.wav'));
      await this.tileCorrectFX.loadAsync(
        require('../../assets/sfx/tile_tap.wav'),
      );
      await this.tileWrongFX.loadAsync(
        require('../../assets/sfx/tile_wrong.wav'),
      );
      await this.pauseInFX.loadAsync(require('../../assets/sfx/pause_in.wav'));
      await this.pauseOutFX.loadAsync(
        require('../../assets/sfx/pause_out.wav'),
      );
      await this.loseFX.loadAsync(require('../../assets/sfx/lose.wav'));

      await this.backgroundMusic.setIsLoopingAsync(true);
      await this.backgroundMusic.playAsync();
      // Your sound is playing!
    } catch(err){
      console.log('An erro occurred while loading music');
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  generateSizeIndex = size => {
    return Math.floor(Math.random() * size);
  };

  generateNewRound = () => {
    const RGB = generateRGB();
    const mRGB = mutateRGB(RGB);
    const { points } = this.state;
    const size = Math.min(Math.max(Math.floor(Math.sqrt(points)), 2), 5);
    this.setState({
      size,
      diffTileIndex: [
        this.generateSizeIndex(size),
        this.generateSizeIndex(size),
      ],
      diffTileColor: `rgb(${mRGB.r}, ${mRGB.g}, ${mRGB.b})`,
      rgb: RGB,
    });
  };

  onBottomBarPress = async () => {
    switch(this.state.gameState) {
      case 'INGAME': {
        this.pauseInFX.replayAsync()
        this.setState({ gameState: 'PAUSED' });
        break;
      }
      case 'PAUSED': {
        this.pauseOutFX.replayAsync()
        this.setState({ gameState: 'INGAME' });
        break;
      }
      case 'LOST': {
        this.backgroundMusic.replayAsync();
        await this.setState({ points: 0, timeLeft: 15, size: 2 });
        this.generateNewRound();
        this.setState({
          gameState: "INGAME",
        })
        break;
      }
      default: {
        return null;
      }
    }
  };

  onExitPress = () => {
    this.buttonFX.replayAsync();
    this.backgroundMusic.stopAsync();
    this.props.navigation.navigate('Home')
  }

  onTilePress = (rowIndex, columnIndex) => {
    const { diffTileIndex, points, timeLeft } = this.state;
    if(rowIndex == diffTileIndex[0] && columnIndex == diffTileIndex[1]) {
      console.log('right tile!', points, timeLeft);
      this.tileCorrectFX.replayAsync()
      this.setState({ points: points + 1, timeLeft: timeLeft + 2 });
      this.generateNewRound();
    } else {
      console.log('wrong tile!', points, timeLeft);
      this.tileWrongFX.replayAsync()
      this.setState({ timeLeft: timeLeft - 2 })
    }
  }
  render() {
    const {
      rgb,
      size,
      diffTileIndex,
      diffTileColor,
      gameState
    } = this.state;

    const { width } = Dimensions.get("window");

    const bottomIcon = (gameStateArg) => {
      if(gameStateArg === 'INGAME'){
        return require("../../assets/icons/pause.png")
      } else if(gameStateArg === "PAUSED"){
        return require("../../assets/icons/play.png")
      } else {
        return require("../../assets/icons/replay.png");
      }
    }

    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Header />
        </View>
        <View style={{ height: width * 0.875, width: width * 0.875, flexDirection: 'row' }}>
          {gameState === 'INGAME' ? (Array(size).fill().map((val, columnIndex) => (
            <View style={{ flex: 1, flexDirection: 'column' }} key={columnIndex}>
              {Array(size).fill().map((val, rowIndex) => (
                <TouchableOpacity
                  key={`${rowIndex}.${columnIndex}`}
                  style={{
                    flex: 1,
                    backgroundColor:
                    rowIndex === diffTileIndex[0]
                    && columnIndex === diffTileIndex[1]
                    ? diffTileColor
                    : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                    margin: 2
                  }}
                  onPress={() => this.onTilePress(rowIndex, columnIndex)}
                  />
              ))}
            </View>
          ))) : (
            <View style={styles.pausedContainer}>
              { gameState === 'PAUSED' ? (
                <Fragment>
                  <Image
                    source={require("../../assets/icons/mug.png")}
                    style={styles.pausedIcon}
                    />
                  <Text style={styles.pausedText}>COVFEFE BREAK</Text>
                </Fragment>
              ) : (
                <Fragment>
                  <Image
                    source={require("../../assets/icons/dead.png")}
                    style={styles.pausedIcon}
                    />
                  <Text style={styles.pausedText}>U DED</Text>
                </Fragment>
              )}
              <TouchableOpacity onPress={this.onExitPress}>
                <Image
                  source={require("../../assets/icons/escape.png")}
                  style={styles.exitIcon}
                  />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.bottomContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.counterCount}>
              {this.state.points}
            </Text>
            <Text style={styles.counterLabel}>
              points
            </Text>
            <View style={styles.bestContainer}>
              <Image source={require('../../assets/icons/trophy.png')} style={styles.bestIcon} />
              <Text style={styles.bestLabel}>
                0
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.onBottomBarPress}>
              <Image source={bottomIcon(gameState)} style={styles.bottomIcon} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.counterCount}>
              {this.state.timeLeft}
            </Text>
            <Text style={styles.counterLabel}>
              seconds left
            </Text>
            <View style={styles.bestContainer}>
              <Image source={require('../../assets/icons/clock.png')} style={styles.bestIcon} />
              <Text style={styles.bestLabel}>
                0
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
