package com.lastdance.ziip.schedule.repository;

import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.schedule.repository.entity.Schedule;

import com.querydsl.jpa.QueryHandler;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

public interface ScheduleRepository extends JpaRepository<Schedule, Long>, QuerydslPredicateExecutor<Schedule> {

    List<Schedule> findAllByFamily(Optional<Family> family);

    List<Schedule> findAllByStartDateBeforeAndEndDateAfterAndFamilyId(LocalDate todayDateAsLocalDate, LocalDate todayDateAsLocalDate1, Long familyId);

    List<Schedule> findByFamilyAndMember(Optional<Family> family, Member member);
}
