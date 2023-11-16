import {useEffect, useState} from 'react';
import {
  StyleSheet,
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import axiosFileInstance from '../../../util/FileInterceptor';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import refreshState from '../../atoms/refreshState';
import {useRecoilState} from 'recoil';

export default function PhotoList(props) {
  const {scheduleId, photos, navigation} = props;

  const [images, setImages] = useState([]); // 업로드할 이미지들
  // console.log('등록된 이미지: ', photos);
  const [refresh, setRefresh] = useRecoilState(refreshState);

  const onNavigate = item => {
    // console.log(item);
    navigation.navigate('앨범');
  };

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
    } catch (e) {
      console.log(e.code, e.message);
    }
  };

  const onUploadImage = () => {
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

    // console.log('폼데이터: ', fd);

    axiosFileInstance
      .post(`/schedule/photo/register`, fd, {
        transformRequest: (data, headers) => {
          return data;
        },
      })
      .then(res => {
        console.log(res);
        if (res.data.msg === '일정 사진 등록 성공') {
          setRefresh(refresh => refresh * -1);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (images.length > 0) {
      onUploadImage();
    }
  }, [images]);

  return (
    <View style={styles.albumContainer}>
      <View style={styles.albumHeader}>
        <Text style={styles.scheduleSubTitle}>사진첩</Text>
        <TouchableOpacity onPress={onSelectImage}>
          <Ionicons name="add-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.albumContent} horizontal={true}>
        {photos.map(item => {
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.eachPhotoContainer}
              key={item.imgUrl}
              onPress={() => onNavigate(item)}>
              <Image style={styles.eachPhoto} source={{uri: item.imgUrl}} />
            </TouchableOpacity>
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
  scheduleSubTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 5,
  },
});
