import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  play: {
    fontSize: 45,
    fontFamily: "dogbyte",
    color: "#ecf0f1",
    marginTop: 5
  },
  playIcon: {
    height: 60,
    width: 60,
    marginRight: 15
  },
  flexAndAlign: {
     flexDirection: 'row',
     alignItems: 'center'
  },
  hiscore: {
    fontSize: 28.5,
    fontFamily: "dogbyte",
    color: "#ecf0f1",
    marginTop: 5
  },
  trophyIcon: {
    height: 45,
    width: 45,
    marginRight: 12.5
  },
  leaderboard: {
    fontSize: 45,
    fontFamily: 'dogbyte',
    color: '#ecf0f1',
    marginTop: 5,
  },
  leaderboardIcon: {
    height: 60,
    width: 60,
    marginRight: 15,
  },
  bottomContainer: {
    position: "absolute",
    flexDirection: 'row',
    bottom: 0,
    left: 0,
    paddingLeft: 20,
    paddingBottom: 20
  },
  copyrightText: {
    fontSize: 16,
    fontFamily: "dogbyte",
    marginBottom: 2.5,
    marginRight: 40
  },
  soundIcon: {
    marginLeft: 80,
    height: 45,
    width: 45
  }
});
