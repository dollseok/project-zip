package com.lastdance.ziip.schedule.repository;

import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.schedule.repository.entity.Schedule;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findAllByFamily(Optional<Family> family);
}
