package com.lastdance.ziip.member.repository;

import com.lastdance.ziip.member.repository.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

}
