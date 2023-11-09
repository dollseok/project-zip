package com.lastdance.ziip.schedule.repository;

import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.schedule.repository.entity.Schedule;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface ScheduleRepository extends JpaRepository<Schedule, Long>, QuerydslPredicateExecutor<Schedule> {

    List<Schedule> findAllByFamily(Optional<Family> family);

    List<Schedule> findAllByStartDate(LocalDate todayDateAsLocalDate);

    List<Schedule> findAllByStartDateBetween(LocalDate startDate, LocalDate endDate);

    List<Schedule> findAllByStartDateAndFamilyId(LocalDate todayDateAsLocalDate, Long familyId);

    List<Schedule> findAllByStartDateBetweenAndFamilyId(LocalDate startOfMonth, LocalDate endOfMonth, Long familyId);
}
