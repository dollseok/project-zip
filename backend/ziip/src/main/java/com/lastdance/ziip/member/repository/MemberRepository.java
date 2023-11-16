package com.lastdance.ziip.member.repository;

import com.lastdance.ziip.family.repository.entity.FamilyMember;
import com.lastdance.ziip.member.dto.response.MemberInfoResponseDto;
import com.lastdance.ziip.member.dto.response.MemberProfileImgUrlResponseDto;
import com.lastdance.ziip.member.repository.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findBySocialId(String socialId);

    Optional<Member> findByName(String nickname);

    @Query(value = "SELECT m.fcmToken FROM Member m JOIN FamilyMember fm ON m.id = fm.member.id " +
        "WHERE fm.family.id = :familyId AND fm.member.id != :memberId")
    List<String> findFcmTokensByFamilyIdAndExcludeMemberId(Long familyId, Long memberId);

    @Query(value = "SELECT new com.lastdance.ziip.member.dto.response.MemberProfileImgUrlResponseDto(m.id, m.profileImgUrl) FROM Member m JOIN FamilyMember fm ON m.id = fm.member.id WHERE fm.family.id = :familyId")
    List<MemberProfileImgUrlResponseDto> findIdAndProfileImgUrlById(Long familyId);
}
