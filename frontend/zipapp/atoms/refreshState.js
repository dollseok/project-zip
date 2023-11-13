import {atom} from 'recoil';

// 각종 등록과 삭제가 이루어졌을 때 이 상태값이 1과 -1로 번갈아 바꿔주고,
// 상태값이 바뀔때마다 목록 리스트들을 새로 렌더링 할 수 있도록 사용
const refreshState = atom({
  key: 'refreshState', // unique ID
  default: 1,
});

export default refreshState;
