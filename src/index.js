import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, StatusBar, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service'
import axios from 'axios';

const api = axios.create({
    baseURL:"http://api.openweathermap.org/data/2.5/"
})



const API_KEY = '91d1976abcd838afa503aeef9f972a42'

   

export default function App(){
    const [hasLocationPermission, setHasLocaitonPermission]= useState(false);
    const [userLocation, setLocation]= useState({});
   
    
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

        finally{
            if(hasLocationPermission){
                Geolocation.getCurrentPosition(
                   position => {
                       setLocation({
                           latitude: position.coords.latitude,
                           longitude: position.coords.longitude
                       });
                   },
                   error=>{
                       console.log(error.code, error.message)
                   },
           
               )}        
        }
    
    }

    

    async function getData(){
        if(userLocation !== false){
        const response = await api.get(`weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=91d1976abcd838afa503aeef9f972a42`)
            console.log(response.data)
            //weather?lat=-22.2196006&lon=-54.8401334&appid=91d1976abcd838afa503aeef9f972a42
            //weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=91d1976abcd838afa503aeef9f972a42
    }
}
    
    useEffect(()=>{
        verifyPermissions();
        
        
        getData();
       
        
        
      //  const response = await fetch.get(`api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`)
      //  console.log(response)

    },[hasLocationPermission])


    return (
        <>
            <StatusBar barStyle='light-content' />
            <View style={styles.container}>
                <Text>Latitude: {userLocation.latitude}</Text>
                <Text>Longitude: {userLocation.longitude}</Text>
              
            </View>

        </>
        )
}

const styles = StyleSheet.create({
   container: {
       flex:1,
       backgroundColor: '#696969',
       justifyContent: 'center',
       alignItems: 'center'
   },
   Text:{
       color: '#FFF',
       fontSize: 35,
       fontWeight:'bold'
   }     
})