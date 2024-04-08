import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, Image, TouchableOpacity, StyleSheet, Linking, Animated} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { CollapsibleHeaderScrollView, CollapsibleHeaderFlatList } from 'react-native-collapsible-header-views';
import Icon from 'react-native-vector-icons/Octicons';

const Stack = createStackNavigator();
const HEADER_MAX_HEIGHT = 90;
const HEADER_MIN_HEIGHT = 0;

const GitHubSearch = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchQuery !== '') {
      searchRepositories();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchRepositories = async () => {
    const response = await fetch(`https://api.github.com/search/repositories?q=${searchQuery}`);
    const data = await response.json();
    setSearchResults(data.items.slice(0,20));
  };

  const renderItem = ({ item }) => {
    const parts = item.name.split(searchQuery.toLowerCase())
    return (
      <TouchableOpacity onPress={() => navigation.navigate('RepositoryDetails', { repo: item, searchQuery, parts})}>
        <View style={styles.container}>
          <View style = {{flex:1, flexDirection:'row', justifyContent: 'center',alignItems: 'center', paddingTop:10}}>
            <Image
              style={{borderRadius:10, height:30, width:30}}
              source={{ uri: item.owner.avatar_url }}
            />
              <Text style={{fontSize:16, flex:1, paddingTop: 5,paddingRight: 5, paddingBottom: 5, paddingLeft:15}}>
                {item.owner.login}/
                {parts[0]}
                {parts.length > 1 && (
                  <>
                    <Text style={{ fontWeight: "bold" }}>{searchQuery.toLowerCase()}</Text>
                    {parts[1]}
                  </>)
                }
              </Text>
            </View>
            <View style = {{flex:2,justifyContent: 'center', paddingTop:10}}>
            <Text style = {{fontSize:16, textAlign: 'left'}} >{item.description}</Text>
            </View>
        </View>
      </TouchableOpacity>
    );
  }

  
  const [scrollY] = useState(new Animated.Value(0));
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <LinearGradient
    colors={['#E8CDF5', 'white']}
    style={{
      flex: 1,
      paddingTop: 50,
      paddingHorizontal: 20
    }}
  >
    <View>
    <Animated.View style={[styles.header, { height: headerHeight }]}>
    <Icon
        name="mark-github"
        size={40}
        style = {{paddingRight:10}}
      />
      <Text style={styles.headerText}>{'Github Repo Search'}</Text>
    </Animated.View>
      <View 
      style={{ height: 50,borderRadius: 10, marginBottom: 30, marginTop: 0, backgroundColor: 'white', opacity: 0.5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Icon
        name="search"
        size={24}
        style={{padding: 10}}
      />
        <TextInput
          placeholder="Search"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          style={{flex: 1,
            paddingTop: 5,
            paddingBottom: 5,
            fontSize: 16,
          color:'black'}}
        />
        <TouchableOpacity onPress={() =>  setSearchQuery("")}>
        <Icon
        name="x"
        size={24}
        style = {{color:'gray', paddingRight:15}}
      />
       </TouchableOpacity>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} 
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
    </View>
    </LinearGradient>
  );
};

const RepositoryDetailsScreen = ({ route, navigation}) => {
  const { repo, searchQuery, parts } = route.params;
  const [languages, setLanguages] = useState([]);
  const [watchers, setWatchers] = useState(0);
  const [url, setUrl] = useState(0);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(`https://api.github.com/repos/${repo.full_name}/languages`);
    const data = await response.json();
    const keys = Object.keys(data);
    setLanguages(keys);
  
    const response2 = await fetch(`https://api.github.com/repos/${repo.full_name}`);
    const data2 = await response2.json();
    setWatchers(data2.subscribers_count);

    setUrl(`https://github.com/${repo.full_name}`);
    };

    const renderedElements = [];

    for (let i = 0; i < Math.min(languages.length, 6); i++) {
      renderedElements.push(<Text style = {{fontSize:16}} key={i}>{languages[i]}</Text>);
    };


    if (languages.length > 6)
    {renderedElements.push(<Text style = {{fontSize:16}} key={6}>{'Other'}</Text>);};

    const openLink = () => {
      Linking.openURL(url);
    };

  return (
    <LinearGradient
    colors={['#E8CDF5', 'white']}
    style={{
      flex: 1,
      paddingTop: 50,
      paddingHorizontal: 20
    }}
  >
      <View style = {{padding:10}}>
        <View style ={{paddingTop:50}}></View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name='arrow-left' size={30} color="black"/> 
          </TouchableOpacity>
        <View style ={{paddingTop:20}}></View>
        <View style = {{width: 100, height: 100, borderRadius: 50, overflow: 'hidden', backgroundColor:'white'}}>
          <Image 
          style={{width: '100%',height: '100%', resizeMode: 'cover'}}
          source={{ uri: repo.owner.avatar_url }}
          />  
        </View>
        <View style ={{paddingTop:20}}></View>
        <Text style={{fontSize:24}}>
                {repo.owner.login}/
                {parts[0]}
                {parts.length > 1 && (
                  <>
                    <Text style={{ fontWeight: "bold" }}>{searchQuery.toLowerCase()}</Text>
                    {parts[1]}
                  </>)
                }
        </Text>
        <View style ={{paddingTop:10}}></View> 
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Icon name="eye" size={20} style={{color:'grey'}}/>
          <Text style={{paddingLeft:10, color:'grey'}}>{(watchers / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}{'k'}</Text>
          <Icon name="repo-forked" size={20} style={{color:'grey', paddingLeft:15}}/>
          <Text style={{paddingLeft:10, color:'grey'}}>{(repo.forks / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}{'k'}</Text>
          <Icon name="star" size={20} style={{color:'grey', paddingLeft:15}}/>
          <Text style={{paddingLeft:10, color:'grey'}}>{(repo.stargazers_count / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })}{'k'}</Text>
        </View> 
        <View style ={{paddingTop:15}}></View> 
        <View style={styles.line}></View>
        <View style ={{paddingTop:25}}></View> 
        <Text style ={{fontSize:18}}>{repo.description}</Text>
        <View style ={{paddingTop:25}}></View> 
        <Text style = {{fontSize:18, fontWeight: 'bold'}}>{'Languages'}</Text>
        <View style ={{paddingTop:15}}></View>
        <View>
        {renderedElements.map((element, index) => (
          <React.Fragment key={index}>
            {element}
            <View style ={{paddingTop:5}}></View>
          </React.Fragment>
        ))}
      </View>
        <TouchableOpacity onPress={openLink} style={styles.button}>
          <Text style={{color:'white', fontSize:16, textAlign: 'center',fontWeight: 'bold' }}>{'Go to Repo'}</Text>
      </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};


const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="GitHubSearch">
          <Stack.Screen name="GitHubSearch" component={GitHubSearch} options={{ headerShown: false, backgroundColor: 'transparent' } } />
          <Stack.Screen name="RepositoryDetails" component={RepositoryDetailsScreen} options={{ title: 'Repository Details', headerShown: false, backgroundColor: 'transparent' }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'column',
    marginTop:5,
    marginBottom:5,
    height:120
  },
  line: {
    width: '150%',
    height: 1,
    backgroundColor: 'gray',
    opacity : 0.3,
    marginLeft:-40
  },
  button: {
    backgroundColor: '#348feb',
    borderRadius: 50,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    bottom: -220,
    width:'100%'
  },
  header: {
    justifyContent: 'left',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 0, 
    marginTop: 20, 
    padding: 5, 
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
