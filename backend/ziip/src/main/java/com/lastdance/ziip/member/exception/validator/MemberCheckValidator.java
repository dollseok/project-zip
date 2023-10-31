package com.lastdance.ziip.member.exception.validator;

import com.lastdance.ziip.member.exception.NoExistMember;
import com.lastdance.ziip.member.repository.entity.Member;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Component
public class MemberCheckValidator {

    public void checkMemberExist(Optional<Member> member){
        if(member.isEmpty()){
            throw new NoExistMember("일치하는 회원이 존재하지 않습니다.");
        }
    }
}
