import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import songs from '../../model/data';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import TrackPlayer, {
  Capability,
  usePlaybackState,
  useProgress,
  State,
  Event,
  RepeatMode,
  useTrackPlayerEvents,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';

const {height, width} = Dimensions.get('window');

const Music = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const progress = useProgress();
  const playbackState = usePlaybackState();
  const [repeatMode, setRepeatMode] = useState('off');
  const [favorite, setFavorite] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(route.params.index);
  const ref = useRef();
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artwork, artist} = track;
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });

  useEffect(() => {
    setTimeout(() => {
      ref.current.scrollToIndex({
        animated: true,
        index: currentSong,
      });
    }, 100);
  }, []);

  useEffect(() => {
    setupPlayer();
  }, []);

  const changeRepeatMode = () => {
    if (repeatMode == 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode('track');
    } else if (repeatMode == 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode('repeat');
    } else {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');
    }
  };

  const toggleShuffle = async () => {
    if (shuffle) {
      // Shuffle is currently enabled, disable it
      setShuffle(false);
    } else {
      // Shuffle is currently disabled, enable it
      setShuffle(true);
      // await TrackPlayer.shuffle();
      let queue = await TrackPlayer.getQueue();
      await TrackPlayer.reset();
      queue.sort(() => Math.random() - 0.5);
      await TrackPlayer.add(queue);
    }
  };

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        // Media controls capabilities
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],

        // Capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [Capability.Play, Capability.Pause],

        progressUpdateEventInterval: 1000,
      });
      await TrackPlayer.add(songs);
      TrackPlayer.addEventListener('playback-queue-ended', async () => {
        if (shuffle) {
          // Get a random index within the range of available songs
          const randomIndex = Math.floor(Math.random() * songs.length);

          // Skip to the randomly selected song and play it
          setCurrentSong(randomIndex);
          ref.current.scrollToIndex({
            animated: true,
            index: randomIndex,
          });
          await TrackPlayer.skip(parseInt(randomIndex));
          await TrackPlayer.play();
        } else {
          // Playback queue ended, switch to the next song
          if (songs.length - 1 > currentSong) {
            setCurrentSong(currentSong + 1);
            ref.current.scrollToIndex({
              animated: true,
              index: parseInt(currentSong) + 1,
            });
            await TrackPlayer.skip(parseInt(currentSong) + 1);
            await TrackPlayer.play();
          }
        }
      });
    } catch (e) {}
  };

  const toggleFavorite = () => {
    const songCur = songs[currentSong];
    if (songCur.favorite == false) {
      const isExistInFavorite = favoriteSongs.some(
        song => song.id === songCur.id,
      );
      if (!isExistInFavorite) {
        setFavoriteSongs(prevSongs => [...prevSongs, songCur]);
      }
    }
  };

  const togglePlayback = async playbackState => {
    console.log(playbackState);
    if (
      playbackState === State.Paused ||
      playbackState === State.Ready ||
      playbackState === State.Connecting ||
      playbackState === State.Buffering
    ) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  };
  return (
    <LinearGradient
      colors={
        currentSong % 3 == 0
          ? ['#FAFDFD', '#C4E4E1', '#C4E4E1']
          : currentSong % 3 == 1
          ? ['#FDFCFB', '#E2D1C3', '#E2D1C3']
          : ['#F3E9F3', '#F6F5F6', '#FFE7FE']
      }
      style={styles.linearGradient}>
      <View>
        <View style={styles.info}>
          <FlatList
            horizontal
            ref={ref}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            data={songs}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onScroll={async e => {
              const x = e.nativeEvent.contentOffset.x / width;
              setCurrentSong(parseInt(x.toFixed(0)));
              await TrackPlayer.skip(parseInt(x.toFixed(0)));
              await TrackPlayer.play();
            }}
            onScrollToIndexFailed={() => {}}
            renderItem={() => {
              return (
                <View style={styles.bannerView}>
                  {trackArtwork && (
                    <Image source={trackArtwork} style={styles.banner} />
                  )}
                  <Text style={styles.name}>{trackTitle}</Text>
                  <Text style={styles.artist}>{trackArtist}</Text>
                </View>
              );
            }}
          />
        </View>
        <View style={styles.sliderView}>
          <Slider
            style={styles.sliderBar}
            value={progress.position}
            maximumValue={progress.duration}
            minimumValue={0}
            thumbStyle={{width: 30, height: 30}}
            thumbTintColor={'black'}
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
          />
          <View style={styles.progressDuration}>
            <Text style={styles.progressText}>
              {new Date(progress.position * 1000)
                .toISOString()
                .substring(14, 19)}
            </Text>
            <Text style={styles.progressText}>
              {new Date(progress.duration * 1000)
                .toISOString()
                .substring(14, 19)}
            </Text>
          </View>
        </View>
        <View style={styles.btnArea}>
          <TouchableOpacity
            onPress={async () => {
              if (currentSong > 0) {
                setCurrentSong(currentSong - 1);
                ref.current.scrollToIndex({
                  animated: true,
                  index: parseInt(currentSong) - 1,
                });
                await TrackPlayer.skip(parseInt(currentSong) - 1);
                //await TrackPlayer.play();
              }
            }}>
            <Image
              source={require('../../assets/img/prev.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              // await TrackPlayer.skip(1);
              togglePlayback(playbackState);
            }}>
            <Image
              source={
                playbackState === State.Playing
                  ? require('../../assets/img/pause.png')
                  : require('../../assets/img/play3.png')
              }
              style={[styles.playIcon, {width: 60, height: 60}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              if (songs.length - 1 > currentSong) {
                setCurrentSong(currentSong + 1);
                ref.current.scrollToIndex({
                  animated: true,
                  index: parseInt(currentSong) + 1,
                });
                await TrackPlayer.skip(parseInt(currentSong) + 1);
                //await TrackPlayer.play();
              }
            }}>
            <Image
              source={require('../../assets/img/next.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.btnArea}>
          <TouchableOpacity onPress={changeRepeatMode}>
            <Image
              source={
                repeatMode === 'off'
                  ? require('../../assets/img/repeat_off.png')
                  : repeatMode === 'track'
                  ? require('../../assets/img/repeat-one.png')
                  : require('../../assets/img/repeat.png')
              }
              style={[styles.icon, {marginRight: 20, width: 35, height: 30}]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleShuffle}>
            <Image
              source={
                shuffle
                  ? require('../../assets/img/shuffle1.png')
                  : require('../../assets/img/shuffle.png')
              }
              style={[
                styles.icon,
                {marginLeft: 30, width: 30, height: 30, marginRight: 15},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleFavorite}>
            <Image
              source={
                favorite === false
                  ? require('../../assets/img/heart1.png')
                  : require('../../assets/img/heart2.png')
              }
              style={[styles.icon, {marginLeft: 30, width: 40, height: 40}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FavoriteScreen', {favoriteSongs});
            }}>
            <Image
              source={require('../../assets/img/favoriteList.png')}
              style={[styles.icon, {marginLeft: 55, width: 27, height: 27}]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Music;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerView: {
    width: width,
    height: (height * 1) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  banner: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 20,
  },
  name: {
    marginTop: 5,
    fontSize: 22,
    marginLeft: 20,
    fontWeight: '700',
    color: '#000',
  },
  artist: {
    marginTop: 5,
    fontSize: 18,
    marginLeft: 20,
    fontWeight: '400',
    color: '#000',
  },
  sliderView: {
    marginTop: 0,
    alignSelf: 'center',
    width: '90%',
  },
  btnArea: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  btnArea1: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  icon: {
    width: 50,
    height: 50,
  },
  playIcon: {
    marginLeft: 40,
    marginRight: 40,
  },
  sliderBar: {
    width: 370,
    height: 20,
    flexDirection: 'row',
  },
  info: {
    marginBottom: 50,
    marginTop: -10,
  },
  progressDuration: {
    width: 345,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  progressText: {
    color: 'black',
    fontWeight: '500',
  },
  linearGradient: {
    width: width,
    height: height,
  },
});
