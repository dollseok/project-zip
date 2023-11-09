import {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import axiosFileInstance from '../../../util/FileInterceptor';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

export default function PhotoList(props) {
  const {scheduleId} = props;

  const [images, setImages] = useState([]);

  // 이미지 가져오기
  const onSelectImage = async () => {
    await setImages([]);
    console.log('onSelectImage 실행!');
    try {
      const response = await MultipleImagePicker.openPicker({
        usedCameraButton: false,
        maxVideo: 1,
        // selectedAssets: images,
        isExportThumbnail: true,
        isCrop: true,
        isCropCircle: true,
      });
      await setImages(response);
      console.log('선택한 이미지들: ', images);
    } catch (e) {
      console.log(e.code, e.message);
    }

    const fd = new FormData();

    const dto = {
      scheduleId: scheduleId,
    };

    // fd.append(
    //   'dto',
    //   new Blob([JSON.stringify(dto)], {type: 'application/json'}),
    // );
    fd.append('dto', dto);

    images.map(item => {
      let image = {
        uri: item.path,
        type: 'image/jpeg',
        name: 'photo.jpg',
      };
      fd.append('files', image);
    });

    console.log('폼데이터: ', fd);

    axiosFileInstance
      .post(`/schedule/photo/register`, fd, {
        headers: {
          'content-type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
          return data;
        },
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.albumContainer}>
      <View style={styles.albumHeader}>
        <Text>사진첩</Text>
        <TouchableOpacity onPress={onSelectImage}>
          <Text>추가</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.albumContent}>
        <View style={styles.albumPhoto}></View>
        <View style={styles.albumPhoto}></View>
        <View style={styles.albumPhoto}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  photoContainer: {},
  albumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  albumContent: {
    flexDirection: 'row',
  },
  albumPhoto: {
    width: 80,
    height: 80,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 12,
  },
});
