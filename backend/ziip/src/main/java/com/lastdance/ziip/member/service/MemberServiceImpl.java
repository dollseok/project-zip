package com.lastdance.ziip.member.service;

import com.lastdance.ziip.diary.repository.DiaryRepository;
import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.global.auth.jwt.JwtTokenProvider;
import com.lastdance.ziip.global.auth.oauth2.Messaging;
import com.lastdance.ziip.global.auth.oauth2.kakao.KakaoMemberDto;
import com.lastdance.ziip.global.auth.oauth2.kakao.KakaoOAuth2;
import com.lastdance.ziip.global.auth.oauth2.naver.NaverMemberDto;
import com.lastdance.ziip.global.auth.oauth2.naver.NaverOAuth2;
import com.lastdance.ziip.global.awsS3.AwsS3Uploader;
import com.lastdance.ziip.global.awsS3.S3Uploader;
import com.lastdance.ziip.global.exception.CustomException;
import com.lastdance.ziip.global.exception.validator.MemberValidator;
import com.lastdance.ziip.member.dto.FileDto;
import com.lastdance.ziip.member.dto.LoginDto;
import com.lastdance.ziip.member.dto.TokenDto;
import com.lastdance.ziip.member.dto.request.MemberInfoUpdateRequestDto;
import com.lastdance.ziip.member.dto.response.*;
import com.lastdance.ziip.member.enums.Gender;
import com.lastdance.ziip.member.enums.Role;
import com.lastdance.ziip.member.enums.SocialType;
import com.lastdance.ziip.member.repository.MemberRepository;
import com.lastdance.ziip.member.repository.entity.Member;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MemberServiceImpl implements MemberService {
    @Value("${jwt.secretKey}")
    private String secretKey;

//    @Value("${file.member-server-domain}")
//    private String serverDomain;
//
//    @Value("${file.member-url-path}")
//    private String urlPath;


    private final KakaoOAuth2 kakaoOAuth2;
    private final NaverOAuth2 naverOAuth2;
    private final MemberRepository memberRepository;
    //    private final ShowInfoRepository showInfoRepository;
    private final JwtTokenProvider jwtTokenProvider;
    //private final FileUploadUtil fileUploadUtil;
    private final RedisTemplate<String, String> redisTemplate;
    private final MemberValidator memberValidator;
    //private final BbtiRepository bbtiRepository;
    //private final RecordRepository recordRepository;
    //private final DiaryRepository diaryRepository;
    private final S3Uploader s3Uploader;
    private final Messaging messaging;

    // authorizedCode로 가입된 사용자 조회
    @Transactional
    public LoginDto findKakaoMemberByAuthorizedCode(String authorizedCode, String redirectUri, String fcmToken) {
        // 카카오 OAuth2 를 통해 카카오 사용자 정보 조회
        KakaoMemberDto kakaoUserDto = kakaoOAuth2.getMemberInfo(authorizedCode, redirectUri);
        String email = kakaoUserDto.getEmail();

        String socialId = kakaoUserDto.getSocialId();
        Optional<Member> optionalMember = memberRepository.findBySocialId(socialId);

        if (optionalMember.isPresent()) {
            return LoginDto.builder()
                    .id(optionalMember.get().getId())
                    .socialId(optionalMember.get().getSocialId())
                    .socialType(optionalMember.get().getSocialType())
                    .name(optionalMember.get().getName())
                    .fcmToken(optionalMember.get().getFcmToken())
                    .firstLogin(false)
                    .build();
        }
        // 가입된 유저가 아니라면 회원가입 진행
        else {

            // 성별 남성 : F, 여성 : M
//            String kakaoGender = kakaoUserDto.getGender();
//            System.out.println("kakaoGender = " + kakaoGender);
//            Gender gender;
//            if (kakaoGender.equals("male")) {
//                gender = Gender.M;
//            } else if (kakaoGender.equals("female")) {
//                gender = Gender.F;
//            } else {
//                gender = null;
//            }
//            System.out.println(gender);


            Member member = Member.builder()
                    .email(email)
                    .gender(Gender.M)
                    .name("")
                    .profileImgName(null)
                    .profileImgUrl(null)
                    .socialId(socialId)
                    .socialType(SocialType.KAKAO)
                    .fcmToken(fcmToken)
                    .role(Role.USER)
                    .build();
            System.out.println(member.toString());
            Member saveMember = memberRepository.save(member);

            return LoginDto.builder()
                    .id(member.getId())
                    .socialId(member.getSocialId())
                    .socialType(member.getSocialType())
                    .name(member.getName())
                    .fcmToken(member.getFcmToken())
                    .firstLogin(true)
                    .build();
        }
    }

    @Transactional
    public LoginDto findNaverMemberByAuthorizedCode(String authorizedCode, String naverState) {
        // 네이버 OAuth2 를 통해 네이버 사용자 정보 조회
        NaverMemberDto naverMemberDto = naverOAuth2.getMemberInfo(authorizedCode, naverState);
        String email = naverMemberDto.getEmail();

        String socialId = naverMemberDto.getSocialId();
        Optional<Member> optionalMember = memberRepository.findBySocialId(socialId);

        if (optionalMember.isPresent()) {
            return LoginDto.builder()
                    .id(optionalMember.get().getId())
                    .socialId(optionalMember.get().getSocialId())
                    .socialType(optionalMember.get().getSocialType())
                    .name(optionalMember.get().getName())
                    .firstLogin(false)
                    .build();
        }
        // 가입된 유저가 아니라면 회원가입 진행

        else {
            // 성별 남성 : F, 여성 : M
            String naverGender = naverMemberDto.getGender();
            Gender gender;
            if (naverGender.equals("male")) {
                gender = Gender.M;
            } else if (naverGender.equals("female")) {
                gender = Gender.F;
            } else {
                gender = null;
            }

            Member member = Member.builder()
                    .email(email)
                    .gender(gender)
                    .name("")
                    .profileImgName(null)
                    .profileImgUrl(null)
                    .socialId(socialId)
                    .socialType(SocialType.KAKAO)
                    .role(Role.USER)
                    .build();
            Member saveMember = memberRepository.save(member);

            return LoginDto.builder()
                    .id(member.getId())
                    .socialId(member.getSocialId())
                    .socialType(member.getSocialType())
                    .name(member.getName())
                    .firstLogin(true)
                    .build();
        }
    }

    @Transactional
    public TokenDto reissue(String refreshToken) {

        log.info("재발급서비스 진입!!!");

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new CustomException(HttpStatus.BAD_REQUEST, 403, "토큰에 문제 생겼어요");
        }

        String id = Jwts.parser().setSigningKey(secretKey.getBytes())
                .parseClaimsJws(refreshToken).getBody().getId();


        Member findMember = memberRepository.findById(Long.parseLong(id))
                .orElse(null);
        if (findMember == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, -1, "일치하는 유저가 없습니다");
        }

        String redisRefreshToken = redisTemplate.opsForValue().get(Long.toString(findMember.getId()));

        if (!refreshToken.equals(redisRefreshToken)) {
            throw new CustomException(HttpStatus.BAD_REQUEST, -1, "refresh Token 불일치");
        }
        String newAccessToken = jwtTokenProvider.createAccessToken(findMember.getId(), findMember.getSocialId(), findMember.getSocialType());
        String newRefreshToken = jwtTokenProvider.createRefreshToken(findMember.getId());

        jwtTokenProvider.storeRefreshToken(findMember.getId(), newRefreshToken);
        TokenDto tokenDto = new TokenDto();
        tokenDto.setAccessToken(newAccessToken);
        tokenDto.setRefreshToken(newRefreshToken);
        tokenDto.setId(findMember.getId());
        return tokenDto;
    }

    @Transactional(readOnly = true)
    public Member findMemberByJwtToken(String token) {

        String id = String.valueOf(Jwts.parser().setSigningKey(secretKey.getBytes())
                .parseClaimsJws(token).getBody().get("id"));

        return memberRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new IllegalArgumentException("회원아이디 \"" + id + " \" 에해당하는 사용자가 존재하지 않습니다."));
    }

    @Transactional(readOnly = true)
    public MemberInfoResponseDto getMemberInfo(Member findMember) {

        return MemberInfoResponseDto.builder()
                .member(findMember)
                .build();

    }

    @Override
    public MemberAllInfoResponse getALlMemberInfo(Member findMember) {

        MemberAllInfoResponse memberAllInfoResponse = MemberAllInfoResponse.builder()
            .id(findMember.getId())
            .email(findMember.getEmail())
            .name(findMember.getName())
            .gender(findMember.getGender().name())
            .profileImgName(findMember.getProfileImgName())
            .profileImgUrl(findMember.getProfileImgUrl())
            .socialId(findMember.getSocialId())
            .socialType(findMember.getSocialType())
            .role(findMember.getRole().getValue())
            .build();
        return memberAllInfoResponse;
    }

    //    @Override
//    public MyPageMemberInfoResponse getMyPageMemberInfo(int memberId) {
//
//        Optional<Member> member = memberRepository.findById(memberId);
//        return member.map(value -> MyPageMemberInfoResponse.builder()
//                .memberId(value.getId())
//                .nickname(value.getNickname())
//                .followerCnt(value.getFollowers().size())
//                .followingCnt(value.getFollowings().size())
//                .profileImgPath(value.getProfileImgPath())
//                .build()).orElse(null);
//    }

    @Transactional
    public BaseResponseDto updateMemberInfo(Long id, MemberInfoUpdateRequestDto mypageUpdateRequestDto, Member findMember, MultipartFile file) throws IOException {

        if (findMember.getId() != id) {
            throw new IllegalArgumentException("잘못된 접근입니다");
        }

        if (mypageUpdateRequestDto == null) {

            if (file != null) {
//                FileDto newfileDto = fileUploadUtil.uploadFile(file, findMember);
//                findMember.updateMemberInfo(newfileDto);
//                findMember.getProfileImgPath();
                String fileUrl = s3Uploader.upload(file, "member");
                String originalName = file.getOriginalFilename();

                FileDto newfileDto = FileDto.builder()
                        .fileOriginalName(originalName)
                        .filePath(fileUrl)
                        .build();

                findMember.updateMemberInfo(newfileDto);


            }

        } else {
            if (mypageUpdateRequestDto.getName() == null || mypageUpdateRequestDto.getName().isBlank()) {
                throw new CustomException(HttpStatus.BAD_REQUEST, -101, "닉네임은 null이 될 수 없습니다");
            }

            if (!isValidNickname(mypageUpdateRequestDto.getName()) || (mypageUpdateRequestDto.getName().length() < 2 || mypageUpdateRequestDto.getName().length() >= 9)) {
                throw new CustomException(HttpStatus.BAD_REQUEST, -102, "닉네임 정규식 혹은 길이가 맞지 않습니다");
            }

            Optional<Member> findNickname = memberRepository.findByName(mypageUpdateRequestDto.getName());

            //닉네임 중복체크
            if (findNickname.isPresent() && !findMember.getName().equals(findNickname.get().getName())) {
                throw new CustomException(HttpStatus.BAD_REQUEST, -100, "닉네임이 중복되었습니다");
            }

            if (mypageUpdateRequestDto.getFile() != null) {
//                FileDto newfileDto = fileUploadUtil.uploadFile(mypageUpdateRequestDto.getFile(), findMember);
//                findMember.updateMemberInfo(mypageUpdateRequestDto, newfileDto);
//                findMember.getProfileImgPath();

                String fileUrl = s3Uploader.upload(file, "member");
                String originalName = file.getOriginalFilename();

                FileDto newfileDto = FileDto.builder()
                        .fileOriginalName(originalName)
                        .filePath(fileUrl)
                        .build();

                findMember.updateMemberInfo(mypageUpdateRequestDto, newfileDto);

            } else {
                findMember.updateMemberInfo(mypageUpdateRequestDto);
            }
        }

        MemberUpdateResponseDto newMember = MemberUpdateResponseDto.builder()
                .member(findMember)
                .build();

        return BaseResponseDto.builder()
                .success(true)
                .message("사용자 정보를 수정하였습니다")
                .data(newMember)
                .build();
    }

    @Transactional
    public BaseResponseDto updateMemberProfileImage(Member findMember, MultipartFile file) throws IOException {

        if (file == null) {
            Member modifyMember = Member.builder()
                .id(findMember.getId())
                .email(findMember.getEmail())
                .gender(findMember.getGender())
                .name("")
                .profileImgName(null)
                .profileImgUrl(null)
                .socialId(findMember.getSocialId())
                .socialType(SocialType.KAKAO)
                .role(Role.USER)
                .build();

            Member saveMember = memberRepository.save(modifyMember);
        } else {
            String fileUrl = s3Uploader.upload(file, "member");
            String originalName = file.getOriginalFilename();

            Member modifyMember = Member.builder()
                .id(findMember.getId())
                .email(findMember.getEmail())
                .gender(findMember.getGender())
                .name("")
                .profileImgName(originalName)
                .profileImgUrl(fileUrl)
                .socialId(findMember.getSocialId())
                .socialType(SocialType.KAKAO)
                .role(Role.USER)
                .build();

            Member saveMember = memberRepository.save(modifyMember);
        }

        return BaseResponseDto.builder()
            .success(true)
            .message("사용자 프로필 사진을 수정하였습니다")
            .data(findMember.getId())
            .build();
    }

    @Transactional
    public BaseResponseDto updateNickname(String nickname, Member member) {

        if (nickname == null || nickname.isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, -101, "닉네임은 null이 될 수 없습니다");
        }

        if (!isValidNickname(nickname) || (nickname.length() < 2 || nickname.length() >= 9)) {
            throw new CustomException(HttpStatus.BAD_REQUEST, -102, "닉네임 정규식 혹은 길이가 맞지 않습니다");
        }

        Optional<Member> findNickname = memberRepository.findByName(nickname);

        //닉네임 중복체크
        if (findNickname.isPresent() && !member.getName().equals(findNickname.get().getName())) {
            throw new CustomException(HttpStatus.BAD_REQUEST, -100, "닉네임이 중복되었습니다");
        }

        member.updateName(nickname);

        return BaseResponseDto.builder()
                .success(true)
                .message("닉네임이 등록되었습니다")
                .data(NickNameResponseDto.builder()
                        .memberId(member.getId())
                        .name(member.getName())
                        .build())
                .build();
    }

    @Transactional(readOnly = true)
    public BaseResponseDto validNickname(String nickname, Member member) {
        Member findMember = memberRepository.findByName(nickname).orElse(null);
        //닉네임 중복
        if (findMember != null) {

            return BaseResponseDto.builder()
                    .success(false)
                    .message("닉네임이 중복되었습니다")
                    .data(NickNameResponseDto.builder()
                            .memberId(member.getId())
                            .name(nickname)
                            .build())
                    .build();
        }


        return BaseResponseDto.builder()
                .success(true)
                .message("닉네임이 사용가능합니다")
                .data(NickNameResponseDto.builder()
                        .memberId(member.getId())
                        .name(nickname)
                        .build())
                .build();
    }
//
//    @Override
//    public BaseResponseDto deleteMember(Member findMember) {
//        System.out.println("탈퇴 서비스 임플");
//
//        Role role = Role.DELETED;
//        findMember.updateRole(role);
//
//
//        return BaseResponseDto.builder()
//                .success(true)
//                .message("회원 탈퇴를 하셨습니다")
//                .data(findMember.getId())
//                .build();
//
//    }


//    @Transactional
//    public BaseResponseDto deleteMember(Member findMember) {
//
//        memberRepository.delete(findMember);
//
//        return BaseResponseDto.builder()
//                .success(true)
//                .message("회원 탈퇴를 하셨습니다")
//                .data(findMember.getId())
//                .build();
//
//    }

    @Transactional(readOnly = true)
    public MemberInfoResponseDto getDetailMemberInfo(Long id) {

        Optional<Member> targetMember = memberRepository.findById(id);

        memberValidator.checkMember(targetMember, id);

        return MemberInfoResponseDto.builder()
                .member(targetMember.get())
                .build();
    }

    private boolean isValidNickname(String nickname) {

        return Pattern.matches("[a-zA-Z0-9[가-힣]]*$", nickname);
    }

    @Override
    public FcmTokenResponseDto findFcmTokensByFamilyIdAndExcludeMemberId(Member findMember, Long familyId) throws
        IOException {
        List<String> fcmTokens =  memberRepository.findFcmTokensByFamilyIdAndExcludeMemberId(familyId, findMember.getId());

        return FcmTokenResponseDto.builder()
            .fcmToken(fcmTokens)
            .googleAccessToken(messaging.getAccessToken())
            .build();
    }
}
