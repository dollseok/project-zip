import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {useEffect, useState} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-modern-datepicker';
import axiosInstance from '../../util/Interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import refreshState from '../../atoms/refreshState';
import {useRecoilState} from 'recoil';

export default function AlbumScreen({navigation}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 초기 년도 설정
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 초기 월 설정 (0은 1월을 의미)

  const [refresh, setRefresh] = useRecoilState(refreshState);

  const [isExpanded, setIsExpanded] = useState(false);

  const showExpanded = () => {
    setIsExpanded(true);
  };

  const hideExpanded = () => {
    setIsExpanded(false);
  };

  // 연월 선택창 모달 설정
  const [isModalVisible, setisModalVisible] = useState(false);
  const showPickerModal = () => {
    setisModalVisible(true);
  };
  const hidePickerModal = () => {
    setisModalVisible(false);
  };
  // 연월 선택했을 경우 실행될 함수
  const handleDatePickerChange = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    hidePickerModal();
  };

  const [photos, setPhotos] = useState([]);

  // 사진 클릭 시 일기, 일정 화면으로 이동
  const onNavigate = item => {
    console.log(item);
    const itemCategory = item.category;

    if (itemCategory === 'DIARY') {
      navigation.navigate('일기', {
        dateInfo: item.startDate,
      });
    } else {
      navigation.navigate('캘린더', {
        dateInfo: item.startDate,
      });
    }
  };

  // 월별 사진 조회
  const getMonthlyAlbumData = async (year, month) => {
    const familyId = await AsyncStorage.getItem('familyId');

    axiosInstance
      .get(`/album/month`, {
        params: {
          year: year,
          month: month,
          familyId: familyId,
        },
      })
      .then(res => {
        const monthlyPhotos = res.data.data.images;
        console.log('월별 사진 데이터: ', monthlyPhotos);
        setPhotos(monthlyPhotos);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getMonthlyAlbumData(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, refresh]);

  return (
    <View style={styles.container}>
      {/* 연월 선택 */}
      <View style={styles.dateContainer}>
        {/* 중앙 정렬을 위해 안보이게 처리 */}
        <View style={{paddingLeft: 15, opacity: 0}}>
          <Ionicons name="calendar-outline" size={30} color="black" />
        </View>
        <View style={{opacity: 0}}>
          <Text>월</Text>
        </View>
        {/* 선택된 날짜정보 */}
        <View style={styles.selectDate}>
          <View style={styles.selectYear}>
            <Text style={styles.selectYearFont}>{selectedYear}</Text>
          </View>
          <View style={styles.selectMonth}>
            <Text style={styles.selectMonthFont}>{selectedMonth}</Text>
          </View>
        </View>
        <View style={{justifyContent: 'flex-end', paddingBottom: 10}}>
          <Text style={styles.selectMonthUnitFont}>월</Text>
        </View>
        {/* 날짜 선택창 여는 버튼 */}
        <View style={styles.selectDateBtn}>
          <TouchableOpacity onPress={showPickerModal}>
            <Ionicons name="calendar-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* 연월 선택 모달 */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.pickerContainer}>
          <DatePicker
            mode="monthYear"
            selectorStartingYear={2020}
            onMonthYearChange={selectedDate => {
              const [year, month] = selectedDate.split(' ');
              handleDatePickerChange(year, month);
            }}
          />
        </View>
      </Modal>
      {/* 사진 리스트 */}
      <View style={styles.albumContainer}>
        {photos.length === 0 ? <Text>등록된 사진이 없습니다.</Text> : <></>}
        {/* 확대 토글 */}
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{width: 40, borderWidth: 1, alignItems: 'center'}}
            onPress={showExpanded}>
            <Text style={{fontSize: 20}}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: 40, borderWidth: 1, alignItems: 'center'}}
            onPress={hideExpanded}>
            <Text style={{fontSize: 20}}>-</Text>
          </TouchableOpacity>
        </View>

        {isExpanded ? (
          // 확대 모드
          <FlatList
            key="expandedList"
            data={photos}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onNavigate(item);
                }}>
                <ImageBackground
                  source={{uri: item.imgUrl}}
                  style={styles.eachPhotoContainerExpanded}
                  imageStyle={styles.eachPhoto}>
                  <View style={styles.photoDetailExpanded}>
                    <View style={styles.photoDateExpanded}>
                      <Text style={{fontSize: 30, fontFamily: 'Jost-Bold'}}>
                        {item.startDate.split('-')[2]}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: 'Pretendard-Bold',
                        }}>
                        일
                      </Text>
                    </View>
                    <View style={styles.photoSource}>
                      <Text
                        style={{
                          fontFamily: 'Pretendard-SemiBold',
                          fontSize: 26,
                        }}>
                        {item.detail}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            contentContainerStyle={{padding: 20}}
          />
        ) : (
          <FlatList
            key="collapsedList"
            columnWrapperStyle={{justifyContent: 'space-between'}}
            data={photos}
            renderItem={({item}) => (
              <ImageBackground
                source={{uri: item.imgUrl}}
                style={styles.eachPhotoContainer}
                imageStyle={styles.eachPhoto}>
                <View style={styles.photoDetail}>
                  <View style={styles.photoDate}>
                    <Text style={{fontSize: 26, fontFamily: 'Jost-Bold'}}>
                      {item.startDate.split('-')[2]}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: 'Pretendard-Bold',
                      }}>
                      일
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            )}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            numColumns={2}
            contentContainerStyle={{padding: 20}}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  selectDate: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
  },
  selectDateBtn: {
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnContainer: {
    width: '80%',
    alignItems: 'flex-end',
  },
  albumContainer: {
    width: '100%',
    maxHeight: '70%',
  },
  eachPhotoContainer: {
    width: '47%',
    height: 200,
    borderRadius: 16,
    elevation: 5,
  },
  eachPhotoContainerExpanded: {
    width: '100%',
    height: 400,
    borderRadius: 16,
    elevation: 5,
  },
  eachPhoto: {
    width: '100%',
    borderRadius: 16,
  },
  photoDetail: {
    width: '100%',
    height: '100%',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  photoDetailExpanded: {
    width: '100%',
    height: '20%',
    padding: 10,

    flexDirection: 'row',
    alignItems: 'center',
  },
  photoDate: {
    flex: 1,
    flexDirection: 'row',

    justifyContent: 'flex-end',
    alignItems: 'baseline',
  },
  photoDateExpanded: {
    flex: 1,
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'baseline',

    width: '100%',
    height: '100%',
    // borderWidth: 1,
  },
  photoSource: {
    flex: 2,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    // borderWidth: 1,
  },
  selectYearFont: {
    fontSize: 24,
    fontFamily: 'Jost-Bold',
  },
  selectMonthFont: {
    fontSize: 40,
    fontFamily: 'Jost-SemiBold',
  },
  selectMonthUnitFont: {
    fontSize: 15,
    fontFamily: 'Pretendard-Medium',
  },
});
