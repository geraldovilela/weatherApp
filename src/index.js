import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, StatusBar, PermissionsAndroid, Button, Image } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const api = axios.create({
    baseURL:"http://api.openweathermap.org/data/2.5/"
})



const API_KEY = 'bb92b1bccc257c178ab9cc71c452261c'

   

export default function App(){
    const [hasLocationPermission, setHasLocaitonPermission]= useState(false);
    const [error, setError]= useState("");
    const [userLocation, setLocation]= useState({
        latitude:null,
        longitude:null
    });
    const [weather, setWeather] = useState([])
    const [main, setMain] = useState({})
    const [name, setName] = useState('')
    const [sys, setSys] = useState({})
    var icon =null;

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
        setName(dataApi.data.name);
        setSys(dataApi.data.sys);
        getIcon();
            
        } catch (error) {
            console.log(error.message + 'inside catch' )    
        }
        
          
}

     async function getIcon(){
      //**tentando pegar o icone referente ao clima da API. */   
         try {
             icon = await fetch(`http://openweathermap.org/img/wn/${weather.id}@2x.png`)
         } catch (error) {
             console.log(error.message)
         }
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
                            <Text style={styles.Text}> Local {name}, {sys.country} </Text>
                            <Text style={styles.Text}> Temperatura {main.temp} º</Text>
                            
                            <Text style={styles.Text}> Temp. minima {main.temp_min} º</Text>
                            <Text style={styles.Text}> Temp. maxima {main.temp_max} º</Text>
                            
                        </>
                    )}
                <Button title="Atualizar" onPress={getData} />
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