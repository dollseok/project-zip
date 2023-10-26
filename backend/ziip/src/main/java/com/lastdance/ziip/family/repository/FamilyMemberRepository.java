package com.lastdance.ziip.family.repository;

import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.family.repository.entity.FamilyMember;
import com.lastdance.ziip.member.repository.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
    FamilyMember findByMemberAndFamily(Member findMember, Family family);
}
