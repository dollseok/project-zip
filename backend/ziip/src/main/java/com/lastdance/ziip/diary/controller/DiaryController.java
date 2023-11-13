package com.lastdance.ziip.diary.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lastdance.ziip.diary.dto.request.DiaryDeleteRequestDto;
import com.lastdance.ziip.diary.dto.request.DiaryModifyRequestDto;
import com.lastdance.ziip.diary.dto.request.DiaryWriteRequestDto;
import com.lastdance.ziip.diary.dto.response.*;
import com.lastdance.ziip.diary.enums.DiaryResponseMessage;
import com.lastdance.ziip.diary.service.DiaryService;
import com.lastdance.ziip.family.service.FamilyService;
import com.lastdance.ziip.global.util.ResponseTemplate;
import com.lastdance.ziip.member.repository.MemberRepository;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

@Tag(name = "Diary", description = "일기 관련 API")
@RestController
@RequiredArgsConstructor
@EnableWebMvc // 어디에 쓰이는건지?
@Slf4j
@RequestMapping("/api/diary")
public class DiaryController {

    private final MemberService memberService;
    private final DiaryService diaryService;

    /**
     * 일기 작성
     * @param httpServletRequest 로그인한 유저의 Id
     * @param jsonString  memberId, familyId, text, content, emotionId
     * @param files 사진 파일 리스트
     * @return
     * @throws IOException
     */
    @Operation(summary = "일기 작성", description = "일기 작성하기 API, 사진 여러장 등록 가능")
    @PostMapping("/write")
    public ResponseEntity<ResponseTemplate<DiaryWriteResponseDto>> diaryWrite(
            HttpServletRequest httpServletRequest,
            @RequestPart(value="diaryWriteRequest") String jsonString,
            @RequestPart(value="files", required = false) List<MultipartFile> files) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        DiaryWriteRequestDto diaryWriteRequestDto = mapper.readValue(jsonString, DiaryWriteRequestDto.class);

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        DiaryWriteResponseDto diaryWriteResponseDto = diaryService.writeDiary(findMember, diaryWriteRequestDto, files);

        return new ResponseEntity<>(
                ResponseTemplate.<DiaryWriteResponseDto>builder()
                        .msg(DiaryResponseMessage.DIARY_WRITE_SUCCESS.getMessage())
                        .data(diaryWriteResponseDto)
                        .result(true)
                        .build(), HttpStatus.OK);
    }


    /**
     * 일기 리스트 조회
     * @param httpServletRequest 로그인한 유저의 Id
     * @param familyId
     */
    @Operation(summary = "일기 리스트 조회", description = "일기 리스트 조회 API")
    @GetMapping("/list")
    public ResponseEntity<ResponseTemplate<DiaryListResponseDto>> diaryList(
            HttpServletRequest httpServletRequest,
            @RequestParam(name = "familyId") Long familyId){

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }

        Member findMember = memberService.findMemberByJwtToken(token);

        DiaryListResponseDto diaryListResponseDto = diaryService.listDiary(findMember, familyId);

        return new ResponseEntity<>(
                ResponseTemplate.<DiaryListResponseDto>builder()
                        .msg(DiaryResponseMessage.DIARY_LIST_SUCCESS.getMessage())
                        .data(diaryListResponseDto)
                        .result(true)
                        .build(), HttpStatus.OK
        );
    }

    /**
     * 일기 상세 조회
     * @param httpServletRequest 로그인한 유저의 Id
     * @param diaryId
     */
    @Operation(summary = "일기 상세 조회", description = "일기 상세 조회 API, 댓글까지 한번에 조회")
    @GetMapping("/detail")
    public ResponseEntity<ResponseTemplate<DiaryDetailResponseDto>> diaryDetail(
            HttpServletRequest httpServletRequest,
            @RequestParam(name = "diaryId") Long diaryId){

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }
        Member findMember = memberService.findMemberByJwtToken(token);

        DiaryDetailResponseDto diaryDetailResponseDto = diaryService.getDiaryDetail(findMember, diaryId);

        return new ResponseEntity<>(
                ResponseTemplate.<DiaryDetailResponseDto>builder()
                        .msg(DiaryResponseMessage.DIARY_DETAIL_SUCCESS.getMessage())
                        .data(diaryDetailResponseDto)
                        .result(true)
                        .build(),HttpStatus.OK
        );
    }

    @Operation(summary = "일기 수정", description = "일기 수정 API")
    @PutMapping("/modify")
    public ResponseEntity<ResponseTemplate<DiaryModifyResponseDto>> diaryModify(
            HttpServletRequest httpServletRequest,
            @RequestPart(value="diaryModifyRequest") String jsonString,
            @RequestPart(value="file", required = false) MultipartFile file) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        DiaryModifyRequestDto diaryModifyRequestDto = mapper.readValue(jsonString, DiaryModifyRequestDto.class);

        String token = httpServletRequest.getHeader("Authorization");
        if(token == null) {
            return null;
        }
        Member findMember = memberService.findMemberByJwtToken(token);

        DiaryModifyResponseDto diaryModifyResponseDto = diaryService.modifyDiary(findMember, diaryModifyRequestDto, file);

        return new ResponseEntity<>(ResponseTemplate.<DiaryModifyResponseDto>builder()
                .msg(DiaryResponseMessage.DIARY_MODIFY_SUCCESS.getMessage())
                .data(diaryModifyResponseDto)
                .result(true)
                .build(), HttpStatus.OK);
    }


    @Operation(summary = "일기 삭제", description = "일기 삭제 API")
    @DeleteMapping("/delete")
    public ResponseEntity<ResponseTemplate<DiaryDeleteResponseDto>> diaryDelete(
            HttpServletRequest httpServletRequest,
            @RequestParam Long diaryId){

        String token = httpServletRequest.getHeader("Authorization");
        if (token == null) {
            return null;
        }
        Member findMember = memberService.findMemberByJwtToken(token);

        DiaryDeleteResponseDto diaryDeleteResponseDto = diaryService.deleteDiary(findMember, diaryId);

        return new ResponseEntity<>(
                ResponseTemplate.<DiaryDeleteResponseDto>builder()
                        .msg(DiaryResponseMessage.DIARY_DELETE_SUCCESS.getMessage())
                        .data(diaryDeleteResponseDto)
                        .result(true)
                        .build(), HttpStatus.OK);
    }

}
