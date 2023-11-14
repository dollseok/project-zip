import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../util/Interceptor';
import axiosFileInstance from '../util/FileInterceptor';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LogoutOrFamilySelectModal = ({
  isModalVisible,
  setModalVisible,
  navigation,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        setModalVisible(!isModalVisible);
      }}>
      <TouchableWithoutFeedback onPress={{}}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('가족선택'); // 가족 선택창으로 이동
                setModalVisible(false);
              }}>
              <Text>가족 선택창으로 이동</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // 로그아웃 로직 구현
                setModalVisible(false);
              }}>
              <Text>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LogoutOrFamilySelectModal;
