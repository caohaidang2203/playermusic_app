import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import songs from '../../model/data';
import MusicListItem from '../common/MusicListItem';
// import { FlatList } from 'react-native-gesture-handler';

const PlaylistView = () => (
  <>
    <LinearGradient
      colors={['#E2D1C3', '#E2D1C3', '#E2D1C3']}
      style={styles.linearGradient}>
      <Text style={styles.logo}>MUSIC PLAYLIST</Text>
    </LinearGradient>
  </>
);

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PlaylistView />
      </View>
      <LinearGradient
        colors={['#F9F3F4', '#F5E3E6', '#F5E3E6']}
        style={styles.linearGradientScreen}>
        <FlatList
          data={songs}
          renderItem={({item, index}) => {
            return <MusicListItem item={item} index={index} data={songs} />;
          }}
        />
      </LinearGradient>
      <View style={{marginBottom: 10}}></View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    width: '100%',
    elevation: 5,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#C33764',
    marginLeft: 20,
  },
  linearGradient: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradientScreen: {
    width: '100%',
    height: '95%',
  },
});
