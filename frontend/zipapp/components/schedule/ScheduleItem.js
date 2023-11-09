import {
  LayoutAnimation,
  UIManager,
  Platform,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useState, useEffect} from 'react';
import ScheduleUpdate from './ScheduleUpdate';
import PlanList from './plan/PlanList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosInstance from '../../util/Interceptor';
import PhotoList from './photo/PhotoList';

// if (
// 	Platform.OS === 'android' &&
// 	UIManager.setLayoutAnimationEnabledExperimental
// ) {
// 	UIManager.setLayoutAnimationEnabledExperimental(true);
// }

export default function ScheduleItem({startDate, scheduleId}) {
  const [schedule, setSchedule] = useState([]);
  const [plans, setPlans] = useState([]);

  console.log('ScheduleItem - 일정 정보: ', schedule);
  console.log(new Date(schedule.startDate));

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
        setSchedule(scheduleDetail);

        const PlanDetail = res.data.data.scheduleDetailPlanResponseDtos;
        setPlans(PlanDetail);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getScheduleDetail(scheduleId);
  }, []);

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
    <View style={[styles.eachItem, expanded ? styles.expandedItem : null]}>
      <View
        style={[
          styles.eachSchedule,
          styles.shadowProps,
          expanded ? styles.expandedItem : null,
        ]}>
        {/* 일정 정보 */}
        {/* 일정 소제목과 수정 버튼 */}
        {expanded ? (
          <View style={styles.scheduleHeader}>
            <View style={styles.scheduleSubTitle}>
              <Text>일정</Text>
            </View>
            <TouchableOpacity onPress={onModal}>
              <Text>수정</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.scheduleInfo}
          onPress={() => toggleExpanded()}>
          {/* 일자 */}
          <View style={styles.scheduleDay}>
            <View style={styles.dayText}>
              <Text style={styles.scheduleDayFont}>
                {startDate.split('-')[2]}
              </Text>
              <Text style={{fontSize: 15}}>일</Text>
            </View>
          </View>
          {/* 제목 */}
          <View style={styles.scheduleTitle}>
            <Text style={{fontSize: 20, fontWeight: '600'}}>
              {schedule.title}
            </Text>
          </View>
          {/* 준비 상태 */}
          <View style={styles.ready}>
            <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
              <Ionicons name="checkbox-outline" size={16} color="black" />
              <Text>준비중</Text>
            </View>
            <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
              <Ionicons name="checkbox-outline" size={16} color="black" />
              <Text>준비완료</Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* 계획 목록 */}
        {expanded ? (
          <View>
            <PlanList scheduleId={scheduleId} plans={plans} />
            <PhotoList scheduleId={scheduleId} />
          </View>
        ) : null}
      </View>
      <ScheduleUpdate
        schedule={schedule}
        scheduleId={scheduleId}
        updateModalVisible={updateModalVisible}
        setUpdateModalVisible={setUpdateModalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  eachItem: {
    width: '100%',
    height: 71,
  },
  // 일정 아이템 스타일
  eachSchedule: {
    gap: 10,

    backgroundColor: 'white',
    borderRadius: 16,

    width: '100%',
    height: 71,

    padding: 10,
  },
  // 확장 되었을 때 스타일
  expandedItem: {
    height: 400,
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
    gap: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleDay: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
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
  ready: {
    flex: 1,
  },
  scheduleInfo: {
    flexDirection: 'row',
  },
  planInfo: {
    borderColor: 'black',
    borderWidth: 1,
  },
});
