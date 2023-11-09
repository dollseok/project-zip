import {StyleSheet, View, Text, ScrollView} from 'react-native';
import DiaryItem from './DiaryItem';
import {useState} from 'react';

export default function DiaryList(props) {
  const {diarys, selectedMonth, selectedYear} = props;
  // console.log('해당 월의 일기리스트: ', diarys);

  return (
    <View style={styles.diaryList}>
      {!diarys.length ? <Text>등록된 일기가 없습니다.</Text> : <></>}
      <ScrollView>
        {diarys.map(diary => {
          return (
            <DiaryItem
              diarySummary={diary}
              key={diary.diaryId}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}></DiaryItem>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  diaryList: {
    marginTop: 20,
    // borderWidth: 1,
    // borderColor: 'black',
    // alignItems: 'center',
    width: '80%',
    height: '60%',
    gap: 10, // 일정별 간격
  },
});
