import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, Image, Alert } from 'react-native';
import images from '../constants/images'; 
import Footer from '../components/footer';
import { useNavigation, useRoute } from '@react-navigation/native';

const BookSearch = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sortingAlgo } = route.params;
  const [bookName, setBookName] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const transYAnim = useRef(new Animated.Value(-70)).current;
 
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(transYAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, transYAnim]);
  
  const searchBook = async () => {
    try {
      const response = await fetch("https://actual-terribly-longhorn.ngrok-free.app/get-book-id", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: bookName,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.id) {
        const bookId = data.id;
        console.log('Searching for:', bookId);
        navigation.navigate('Swiping', { bookId: bookId, sortingAlgo: sortingAlgo, shouldFetch: true });
      } else {
        Alert.alert("Error", "Book not found. Please try again.");
      }
    } catch (error) {
      console.error('Error searching book:', error);
      Alert.alert("Error finding book", "This book does not exist in our records. Please try again");
    }
  }
  
  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.logo} />
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ translateY: transYAnim }] }]}>
        <Text style={styles.title}>Enter a book title: </Text>
        <View style =  {styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search"
            onChangeText={setBookName}
            value={bookName}
          />
          <TouchableOpacity onPress = {searchBook}>
            <Image source = {images.searchIcon} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
      </Animated.View>
      < Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6E1',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 40,
  },
  title: {
    fontSize: 25,
    fontFamily: 'Roboto-Medium',
    marginBottom: 20,
  },
  logo: {
    marginTop: 20,
    width: 200,
    height: 200,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 200,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    width: 250, 
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  searchIcon: {
    width: 90,
    height: 50,
    marginLeft: -15,
  },
});

export default BookSearch;
