package com.lastdance.ziip.diary.repository.entity;

import com.lastdance.ziip.diary.enums.IsRead;
import com.lastdance.ziip.member.repository.entity.Member;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class DiaryCommentAlert {

    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_comment_id")
    private DiaryComment diaryComment;

    private IsRead isRead;
}
