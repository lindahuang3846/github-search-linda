import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react'
import { StyleSheet, Text, View, TextInput, Button, FlatList, Image} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar, TouchableOpacity} from 'react-native-elements';


export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

    const searchRepositories = async () => {
      try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${searchQuery}`);
        const data = await response.json();
        setSearchResults(data.items);
      } catch (error) {
        console.error('Error searching repositories:', error);
      }
    };

    const renderItem = ({ item }) => (
      
      <View style={{ padding: 10 }}>
        <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.owner.avatar_url }}
      />
        <Text>{item.full_name}</Text>
        <Text>{item.description}</Text>
        <Image>{item.NameImg}</Image>
      </View>
    );

    return (
      <LinearGradient
        colors={['#dda0dd', 'white']}
        style={styles.container}>
          <View style={styles.inputContainer}>
            <SearchBar
              //style={styles.text}
              placeholder="Search"
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
              onChange={searchRepositories}
            />
            <FlatList style={styles.flatlist} contentContainerStyle={styles.content}
                horizontal={false}
              data={searchResults}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </LinearGradient>
      );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100, // Adjust the value as needed
    paddingHorizontal: 20,
  },
});
