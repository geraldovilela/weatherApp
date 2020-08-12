import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, StatusBar, PermissionsAndroid, Button, FlatList } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const api = axios.create({
    baseURL:"http://api.openweathermap.org/data/2.5/"
})



const API_KEY = '5d33b958d2ddf92d1ef0e9ed54e78365'

   

export default function App(){
    const [hasLocationPermission, setHasLocaitonPermission]= useState(false);
    const [error, setError]= useState("");
    const [userLocation, setLocation]= useState({
        latitude:null,
        longitude:null
    });
    const [weather, setWeather] = useState([])
    const [main, setMain] = useState({})
    var response=[];

    const getPosition = () => {
          Geolocation.getCurrentPosition(
            pos => {
              setError("");
              setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
              });
            },
            e => setError(e.message)
          );
        getData();


        };
    

    async function verifyPermissions(){
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if(granted === PermissionsAndroid.RESULTS.GRANTED){
                console.log('permission granted');
                setHasLocaitonPermission(true);
            } else {
                console.log('permission denied.')
                setHasLocaitonPermission(false);
            }
        } catch(err){
            console.warn(err);
        }

    }
        
    async function getData(){
        try {
        const dataApi = await api.get(`weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${API_KEY}&units=metric&lang=pt_br`)
        
        setWeather([dataApi.data.weather]);
        setMain(dataApi.data.main);
            
        } catch (error) {
            console.log(error.message + 'inside catch' )    
        }
        return response;
            //weather?lat=-22.2196006&lon=-54.8401334&appid=91d1976abcd838afa503aeef9f972a42
            //weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=91d1976abcd838afa503aeef9f972a42
    
}
    
    useEffect(()=>{
        verifyPermissions();
        getPosition();
       
        // if(hasLocationPermission){
        //     Geolocation.getCurrentPosition(
        //        position => {
        //            setLocation({
        //                latitude: position.coords.latitude,
        //                longitude: position.coords.longitude
        //            });
        //        },
        //        error=>{
        //            console.log(error.code, error.message)
        //        },
       
        //    )}        
      
    },[hasLocationPermission])


    return (
        <>
            <StatusBar barStyle='light-content' />
            <View style={styles.container}>
               
                {error ? (
                    <Text style={styles.Text}>Error retrieving current position</Text>
                ) : (
                        <>
                            <Text style={styles.Text}>{weather.id}</Text>
                            <Text style={styles.Text}>{main.temp}</Text>
                            
                            <Text style={styles.Text}>{main.temp_min}</Text>
                            <Text style={styles.Text}>{main.temp_max}</Text>
                            
                        </>
                    )}
                <Button title="Atualizar" onPress={getPosition} />
            </View>
        </>
        )
}

const styles = StyleSheet.create({
   container: {
       flex:1,
       backgroundColor: '#F2F2F2',
       justifyContent: 'center',
       alignItems: 'center'
   },
   Text:{
       color: '#060606',
       fontSize: 18,
       fontWeight:'bold'
   }     
})