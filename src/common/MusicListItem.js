import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const {height, width} = Dimensions.get('window');
const MusicListItem = ({item, index, data}) => {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          {marginBottom: index == data.length - 1 ? 30 : 0},
        ]}
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
      </TouchableOpacity>
    </View>
  );
};

export default MusicListItem;

const styles = StyleSheet.create({
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
  play: {
    width: 30,
    height: 30,
  },
});
