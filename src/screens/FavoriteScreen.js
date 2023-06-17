import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const {height, width} = Dimensions.get('window');
const FavoriteScreen = ({route}) => {
  const navigation = useNavigation();
  // Function to render each favorite song item in the list
  // const {favoriteSongs} = route.params;
  const [favoriteSongs, setFavoriteSongs] = useState(
    route.params.favoriteSongs,
  );

  const deleteSong = index => {
    const newFavoriteSongs = [...favoriteSongs];
    newFavoriteSongs.splice(index, 1);
    setFavoriteSongs(newFavoriteSongs);
    navigation.setParams({favoriteSongs: newFavoriteSongs});
  };

  const renderSongItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          style={[styles.container]}
          onPress={() => {
            navigation.navigate('Music', {
              data: item,
              index: index,
            });
          }}>
          <Image source={item.artwork} style={styles.songImage} />
          <View style={styles.nameView}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.artist}>{item.artist}</Text>
          </View>
          <TouchableOpacity onPress={() => deleteSong(index)}>
            <Image
              source={require('../../assets/img/delete.png')}
              style={styles.deleteBtn}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#FDFCFB', '#E2D1C3', '#E2D1C3']}
      style={styles.linearGradient}>
      <View style={styles.containerPage}>
        <Button
          title="Play favorite songs"
          onPress={() => {
            console.log('press');
          }}
        />
        {favoriteSongs.length > 0 ? (
          <FlatList
            data={favoriteSongs}
            renderItem={renderSongItem}
            keyExtractor={item => item.id.toString()}
          />
        ) : (
          <Text style={styles.emptyText}>No favorite songs</Text>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  containerPage: {
    flex: 1,
  },
  container: {
    width: width - 20,
    height: 80,
    elevation: 5,
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#FFFCFD',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songImage: {
    width: 100,
    height: 70,
    borderRadius: 10,
    marginLeft: 7,
  },
  nameView: {
    paddingLeft: 15,
    width: '63%',
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  artist: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
  },
  deleteBtn: {
    width: 20,
    height: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
    marginLeft: 20,
    marginTop: 20,
  },
  linearGradient: {
    width: width,
    height: height,
  },
});

export default FavoriteScreen;
