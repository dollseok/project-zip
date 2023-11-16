import {
  LayoutAnimation,
  UIManager,
  Platform,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {useState, useEffect} from 'react';
import ScheduleUpdate from './ScheduleUpdate';
import PlanList from './plan/PlanList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosInstance from '../../util/Interceptor';
import PhotoList from './photo/PhotoList';
import refreshState from '../../atoms/refreshState';
import {useRecoilState} from 'recoil';

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

export default function ScheduleItem({
  selectedYear,
  selectedMonth,
  scheduleId,
  navigation,
}) {
  const [schedule, setSchedule] = useState([]);
  const [plans, setPlans] = useState([]);
  const [photos, setPhotos] = useState([]);

  const [refresh, setRefresh] = useRecoilState(refreshState);

  // 준비 여부
  const [getReady, setGetReady] = useState(0);

  const getReadyStatus = plans => {
    console.log('할일 리스트:', plans);

    plans.map(plan => {
      if (plan.statusCode === 0) {
        console.log(plan.statusCode);
        setGetReady(false);
      }
    });

    setGetReady(true);
  };

  useEffect(() => {
    getReadyStatus(plans);
  }, [plans]);
  // console.log('ScheduleItem - 일정 정보: ', schedule);
  // console.log('ScheduleItem - 할일 정보: ', plans);
  // console.log('ScheduleItem - 사진 정보: ', photos);

  // 일정 날짜 컴포넌트
  const ScheduleDate = ({startDate, endDate}) => {
    const startYear = new Date(startDate).getFullYear();
    const startMonth = new Date(startDate).getMonth() + 1;
    const startDay = new Date(startDate).getDate();

    const endYear = new Date(endDate).getFullYear();
    const endMonth = new Date(endDate).getMonth() + 1;
    const endDay = new Date(endDate).getDate();

    return (
      <View style={styles.scheduleDate}>
        {Number(startYear) !== Number(selectedYear) ? (
          <View>
            <Text style={styles.dateFont}>{startYear}</Text>
          </View>
        ) : (
          <></>
        )}
        <View style={styles.scheduleStartDate}>
          <Text style={styles.dateFont}>{startMonth}</Text>
          <Text style={styles.dateUnitFont}>월</Text>
          <Text style={styles.dateFont}>{startDay}</Text>
          <Text style={styles.dateUnitFont}>일</Text>
        </View>
        {`${startYear}-${startMonth}-${startDay}` ===
        `${endYear}-${endMonth}-${endDay}` ? (
          <></>
        ) : (
          <View>
            <View style={styles.scheduleEndDate}>
              <Text style={styles.dateFont}>-</Text>
              <Text style={styles.dateFont}>{endMonth}</Text>
              <Text style={styles.dateUnitFont}>월</Text>
              <Text style={styles.dateFont}>{endDay}</Text>
              <Text style={styles.dateUnitFont}>일</Text>
            </View>
            {Number(endYear) !== Number(selectedYear) ? (
              <View>
                <Text style={styles.dateFont}>{endYear}</Text>
              </View>
            ) : (
              <></>
            )}
          </View>
        )}
      </View>
    );
  };

  // 일정 상세 데이터 가져오기
  const getScheduleDetail = scheduleId => {
    axiosInstance
      .get(`/schedule/detail`, {
        params: {
          scheduleId: scheduleId,
        },
      })
      .then(res => {
        const scheduleDetail = res.data.data;
        // console.log('일정 상세: ', res.data.data);
        setSchedule(scheduleDetail);

        const PlanDetail = res.data.data.plans;
        setPlans(PlanDetail);

        const PhotoDetail = res.data.data.photos;
        setPhotos(PhotoDetail);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getScheduleDetail(scheduleId);
    getReadyStatus(plans);
  }, [refresh]);

  // 일정 수정 모달 설정
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const onModal = () => {
    setUpdateModalVisible(true);
  };

  // 일정 아이템이 확장되었는지 여부
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.eachItem, expanded ? styles.expandedItem : null]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View
        style={[
          styles.eachSchedule,
          styles.shadowProps,
          expanded ? styles.expandedItem : null,
          expanded ? null : {justifyContent: 'center'},
        ]}>
        {/* 일정 정보 */}
        {/* 일정 소제목과 수정 버튼 */}
        {expanded ? (
          <View style={styles.scheduleHeader}>
            <View>
              <Text style={styles.scheduleSubTitle}>일정</Text>
            </View>
            <TouchableOpacity onPress={onModal}>
              <Text style={{color: 'black'}}>수정</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.scheduleInfo}
          onPress={() => toggleExpanded()}>
          {/* 일자 */}
          <ScheduleDate
            startDate={schedule.startDate}
            endDate={schedule.endDate}
          />
          {/* 제목 */}
          <View style={styles.scheduleTitle}>
            <Text style={styles.scheduleSubTitle}>{schedule.title}</Text>
          </View>
          {/* 준비 상태 */}
          <View style={styles.ready}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                opacity: getReady ? 0.2 : 1,
              }}>
              <Ionicons name="checkbox-outline" size={14} color="black" />
              <Text style={{fontSize: 11, left: 4}}>준비중</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                top: 3,
                opacity: getReady ? 1 : 0.2,
              }}>
              <Ionicons name="checkbox-outline" size={14} color="black" />
              <Text style={{fontSize: 11, left: 4}}>준비완료</Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* 계획 목록 */}
        {expanded ? (
          <View>
            <PlanList scheduleId={scheduleId} plans={plans} />
            <PhotoList
              scheduleId={scheduleId}
              photos={photos}
              navigation={navigation}
            />
          </View>
        ) : null}
      </View>
      <ScheduleUpdate
        schedule={schedule}
        scheduleId={scheduleId}
        updateModalVisible={updateModalVisible}
        setUpdateModalVisible={setUpdateModalVisible}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  eachItem: {
    width: '100%',
    height: 90,

    // marginVertical: ,
  },

  scheduleSubTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    padding: 5,
  },

  // 일정 아이템 스타일
  eachSchedule: {
    gap: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    height: 90,
    padding: 10,

    // borderWidth: 1,
    // borderColor: 'black',
  },
  // 확장 되었을 때 스타일
  expandedItem: {
    height: 460,
  },
  shadowProps: {
    // ios
    shadowColor: '#000000',
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    // android
    elevation: 8,
  },
  dayText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scheduleHeader: {
    // borderWidth: 1,
    // borderColor: 'black',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleDay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: 30,
  },
  scheduleDayFont: {
    fontSize: 30,
    fontWeight: 'bold',

    textAlignVertical: 'bottom',
  },
  scheduleTitle: {
    flex: 2,
  },
  scheduleTitle: {
    flex: 3,
  },
  ready: {
    marginHorizontal: 10,
    flex: 1,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planInfo: {
    borderColor: 'black',
    borderWidth: 1,
  },
  scheduleStartDate: {
    flexDirection: 'row',
  },
  scheduleEndDate: {
    flexDirection: 'row',
    // borderWidth: 1,
  },
  dateFont: {
    fontSize: 20,
    fontFamily: 'Jost-Bold',
  },
  dateUnitFont: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    textAlignVertical: 'bottom',
  },
  subtitleFont: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scheduleDate: {
    paddingHorizontal: 5,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
