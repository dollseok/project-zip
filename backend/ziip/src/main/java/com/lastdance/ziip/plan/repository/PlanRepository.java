package com.lastdance.ziip.plan.repository;

import com.lastdance.ziip.plan.repository.entity.Plan;
import com.lastdance.ziip.schedule.repository.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlanRepository extends JpaRepository<Plan, Long> {

    List<Plan> findAllBySchedule(Optional<Schedule> schedule);
}
