package com.lastdance.ziip.schedule.exception.validator;

import com.lastdance.ziip.schedule.exception.NoExistSchedulePhoto;
import com.lastdance.ziip.schedule.exception.NoMatchingManager;
import com.lastdance.ziip.schedule.repository.entity.SchedulePhoto;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@NoArgsConstructor
@Component
public class ScheduleValidator {

    public void checkSchedulePhotoExist(Optional<SchedulePhoto> schedulePhoto){
        if(schedulePhoto.isEmpty()){
            throw new NoExistSchedulePhoto("해당 일정의 사진이 존재하지 않습니다.");
        }
    }
    public void checkSchedulePhotoManager(SchedulePhoto schedulePhoto, Long memberId){
        if(schedulePhoto.getMember().getId() != memberId){
            throw new NoMatchingManager("해당 계획의 담당자가 아닙니다.");
        }
    }
}
