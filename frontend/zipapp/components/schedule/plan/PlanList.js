import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import PlanItem from './PlanItem';
import PlanCreate from './PlanCreate';

export default function PlanList(props) {
  const {scheduleId, plans} = props;
  console.log('일정 id: ', scheduleId);

  return (
    <View style={styles.planContainer}>
      <View style={styles.planHeader}>
        <View style={styles.planSubTitle}>
          <Text>할 일</Text>
        </View>
      </View>
      <View style={styles.planList}>
        {/* <FlatList
          data={plans}
          keyExtractor={item => item.planId.toString()}
          renderItem={({item}) => <PlanItem plan={item} />}
        /> */}
        <ScrollView nestedScrollEnabled={true}>
          {plans.map(plan => {
            return <PlanItem plan={plan} />;
          })}
        </ScrollView>
        <PlanCreate scheduleId={scheduleId} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 계획 전체
  planContainer: {},
  // 소제목과 등록 버튼
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planList: {
    height: 150,
  },
});
