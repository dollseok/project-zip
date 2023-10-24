import {
    StyleSheet,
    Text,
    View,
    Button,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';
import React, { useRef, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Webview } from 'react-native-webview';

export default function IntroScreen({ navigation }) {
    const rotateValue = useRef(new Animated.Value(0)).current; // 초기 값 0

    const rotateAnimation = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['-15deg', '0deg'],
    });

    useEffect(() => {
        const animate = () => {
            // -15도에서 0도로
            Animated.timing(rotateValue, {
                toValue: 1,
                duration: 1000, // 1초
                useNativeDriver: true,
            }).start(() => {
                // 0도에서 -15도로
                Animated.timing(rotateValue, {
                    toValue: 0,
                    duration: 1000, // 1초
                    useNativeDriver: true,
                }).start(animate); // 애니메이션 끝날 때마다 재시작
            });
        };

        animate(); // 애니메이션 시작

        return () => {
            rotateValue.stopAnimation(); // 컴포넌트 unmount 시 애니메이션 중지
        };
    }, []);

    useEffect(() => {
        SplashScreen.preventAutoHideAsync(); // Splash 화면을 숨기지 않도록 설정
        setTimeout(() => {
            SplashScreen.hideAsync(); // 3초 후에 Splash 화면 숨기기
        }, 3000);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Text
                style={{ ...styles.logo, transform: [{ rotate: rotateAnimation }] }}
            >
                zip
            </Animated.Text>
            <Image
                source={require('../assets/welcome.png')}
                style={styles.welcomeImage}
            />
            <TouchableOpacity
                onPress={() => navigation.navigate('카카오')}
                style={styles.outlinedButton}
            >
                <Image
                    source={require('../assets/free-icon-kakao-talk-2111496.png')}
                    style={styles.icon}
                />
                <Text style={styles.outlinedButtonText}>카카오로 시작하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlinedButton}>
                <Image
                    source={require('../assets/free-icon-naver-11423248.png')}
                    style={styles.icon}
                />
                <Text style={styles.outlinedButtonText}>네이버로 시작하기</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logo: {
        fontSize: 50,
        fontWeight: 'bold',
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
        transform: [{ rotate: '-15deg' }], // 이 부분을 추가합니다.
    },
    welcomeImage: {
        width: 300, // 원하는 크기로 조정하세요
        height: 150, // 원하는 크기로 조정하세요
        resizeMode: 'contain', // 이미지 크기 조절 방법 선택
        margin: 100,
    },
    outlinedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: 'transparent',
    },
    icon: {
        width: 24, // 아이콘의 크기. 필요에 따라 조절 가능
        height: 24, // 아이콘의 크기. 필요에 따라 조절 가능
        marginRight: 40, // 텍스트와의 간격
    },
    outlinedButtonText: {
        fontSize: 18,
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1, // 다른 요소 위에 올라오게 설정
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});