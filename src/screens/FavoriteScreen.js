import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {height, width} = Dimensions.get('window');
const FavoriteScreen = ({route}) => {
  const navigation = useNavigation();
  // Function to render each favorite song item in the list
  const {favoriteSongs} = route.params;
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
          <TouchableOpacity>
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
    <View style={styles.containerPage}>
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
});

export default FavoriteScreen;
