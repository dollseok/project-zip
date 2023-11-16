package com.lastdance.ziip.schedule.repository;

import com.lastdance.ziip.schedule.repository.entity.Schedule;
import com.lastdance.ziip.schedule.repository.entity.SchedulePhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SchedulePhotoRepository extends JpaRepository<SchedulePhoto, Long> {

    List<SchedulePhoto> findAllBySchedule(Optional<Schedule> schedule);
}
