package com.lastdance.ziip.schedule.repository;

import com.lastdance.ziip.schedule.repository.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

}
