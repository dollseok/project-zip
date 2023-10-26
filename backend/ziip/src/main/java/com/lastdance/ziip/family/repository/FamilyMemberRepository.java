package com.lastdance.ziip.family.repository;

import com.lastdance.ziip.family.repository.entity.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
}
