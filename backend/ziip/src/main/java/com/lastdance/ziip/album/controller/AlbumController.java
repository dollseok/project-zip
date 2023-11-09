package com.lastdance.ziip.album.controller;

import com.lastdance.ziip.album.dto.response.AlbumListResponseDto;
import com.lastdance.ziip.album.enums.AlbumResponseMessage;
import com.lastdance.ziip.album.service.AlbumService;
import com.lastdance.ziip.global.util.ResponseTemplate;
import com.lastdance.ziip.member.repository.entity.Member;
import com.lastdance.ziip.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import javax.servlet.http.HttpServletRequest;

@Tag(name = "Album", description = "일기 관련 API")
@RestController
@RequiredArgsConstructor
@EnableWebMvc
@Slf4j
@RequestMapping("/api/album")
public class AlbumController {

    private final MemberService memberService;
    private final AlbumService albumService;

    @Operation(summary = "사진첩 전체 조회", description = "일기, 일정 모든 사진 조회")
    @GetMapping("/list")
    public ResponseEntity<ResponseTemplate<AlbumListResponseDto>> albumList(
            HttpServletRequest httpServletRequest,
            @RequestParam(name = "familyId") long familyId){

        String token = httpServletRequest.getHeader("Authorization");
        if(token == null){
            return null;
        }
        Member findMember = memberService.findMemberByJwtToken(token);

        AlbumListResponseDto albumListResponseDto = albumService.listAlbum(findMember, familyId);

        return new ResponseEntity<>(
                ResponseTemplate.<AlbumListResponseDto>builder()
                        .msg(AlbumResponseMessage.ALBUM_LIST_SUCCESS.getMessage())
                        .data(albumListResponseDto)
                        .result(true)
                        .build(), HttpStatus.OK);
    }

}
