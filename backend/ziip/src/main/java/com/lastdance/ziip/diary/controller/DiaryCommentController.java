package com.lastdance.ziip.diary.controller;

import com.lastdance.ziip.diary.dto.request.DiaryCommentWriteRequestDto;
import com.lastdance.ziip.diary.dto.response.DiaryCommentWriteResponseDto;
import com.lastdance.ziip.diary.enums.DiaryResponseMessage;
import com.lastdance.ziip.diary.service.DiaryCommentService;
import com.lastdance.ziip.diary.service.DiaryService;
import com.lastdance.ziip.global.util.ResponseTemplate;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.http.HttpServletRequest;

@Tag(name = "Diary Comment", description = "일기 댓글 관련 API")
@RestController
@RequiredArgsConstructor
@EnableWebMvc
@Slf4j
@RequestMapping("/api/diary/comment")
public class DiaryCommentController {

    private final MemberService memberService;
    private final DiaryCommentService diaryCommentService;

    @Operation(summary = "일기 댓글 작성", description = "일기 댓글 작성 API")
    @PostMapping("/write")
    public ResponseEntity<ResponseTemplate<DiaryCommentWriteResponseDto>> diaryCommentWrite(
            HttpServletRequest httpServletRequest,
            @RequestBody() DiaryCommentWriteRequestDto diaryCommentWriteRequestDto){

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        DiaryCommentWriteResponseDto diaryCommentWriteResponseDto = diaryCommentService.writeDiaryComment(findMember, diaryCommentWriteRequestDto);

        return new ResponseEntity<>(
                ResponseTemplate.<DiaryCommentWriteResponseDto>builder()
                        .msg(DiaryResponseMessage.DIARY_COMMENT_WRITE_SUCCESS.getMessage())
                        .data(diaryCommentWriteResponseDto)
                        .result(true)
                        .build(), HttpStatus.OK);
    }
}
