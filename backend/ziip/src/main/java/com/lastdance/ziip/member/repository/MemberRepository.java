package com.lastdance.ziip.member.repository;

import com.lastdance.ziip.member.repository.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findBySocialId(String socialId);

    Optional<Member> findByName(String nickname);
}
