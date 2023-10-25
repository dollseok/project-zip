import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FamilyMainScreen() {
    const [schedules, setSchedules] = useState([]);

    // useEffect(() => {
    //     async function fetchData() {
    //         const familyId = await AsyncStorage.getItem('familyId');
    //         const response = await fetch(`http://10.0.2.2:9090/api/schedule/list?familyId=${familyId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //             }
    //         });

    //         const data = await response.json();
    //         setSchedules(data);
    //     }

    //     fetchData();
    // }, []);

    return (
        <ImageBackground
            source={require('../assets/family.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <Text style={styles.title}>가족 메인 화면</Text>
            <FlatList 
                data={schedules}
                renderItem={({ item }) => (
                    <View style={styles.scheduleItem}>
                        <Text>{item.name}</Text>
                        <Text>{item.startDate} - {item.endDate}</Text>
                    </View>
                )}
                keyExtractor={item => item.scheduleId.toString()}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scheduleItem: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        width: '90%',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
});
