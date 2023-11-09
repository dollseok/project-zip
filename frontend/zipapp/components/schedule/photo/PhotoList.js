import {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axiosFileInstance from '../../../util/FileInterceptor';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

export default function PhotoList(props) {
  const {scheduleId, photos} = props;

  const [images, setImages] = useState([]); // 업로드할 이미지들
  // console.log('등록된 이미지: ', photos);

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

    fd.append('dto', {string: JSON.stringify(dto), type: 'application/json'});

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
      <ScrollView style={styles.albumContent} horizontal={true}>
        {photos.map(item => {
          return (
            <View style={styles.eachPhotoContainer} key={item.imgUrl}>
              <Image style={styles.eachPhoto} source={{uri: item.imgUrl}} />
            </View>
          );
        })}
      </ScrollView>
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
  eachPhotoContainer: {
    // width: 80,
    // height: 80,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 12,
  },
  eachPhoto: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
});
