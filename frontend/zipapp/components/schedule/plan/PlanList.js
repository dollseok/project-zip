import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import PlanItem from './PlanItem';
import PlanCreate from './PlanCreate';

export default function PlanList(props) {
  const {scheduleId, plans} = props;
  // console.log('일정 id: ', scheduleId);
  // console.log('계획 리스트?', plans);

  return (
    <View style={styles.planContainer}>
      <View style={styles.planHeader}>
        <View style={styles.planSubTitle}>
          <Text style={styles.scheduleSubTitle}>할 일</Text>
        </View>
      </View>
      <View style={styles.planList}>
        <ScrollView nestedScrollEnabled={true}>
          {plans.map(plan => {
            return <PlanItem plan={plan} key={plan.planId} />;
          })}
        </ScrollView>
      </View>
      <PlanCreate scheduleId={scheduleId} />
    </View>
  );
}

const styles = StyleSheet.create({
  // 계획 전체
  planContainer: {
    marginVertical: 10,
  },
  // 소제목과 등록 버튼
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planList: {
    maxHeight: 120,
    marginVertical: 10,
  },
  scheduleSubTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 5,
    marginTop: 10,
  },
});
