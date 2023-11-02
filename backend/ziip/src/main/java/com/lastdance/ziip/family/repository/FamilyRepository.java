package com.lastdance.ziip.family.repository;

import com.lastdance.ziip.family.repository.entity.Family;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FamilyRepository extends JpaRepository<Family, Long> {
    Family findByCode(String familyCode);
}
