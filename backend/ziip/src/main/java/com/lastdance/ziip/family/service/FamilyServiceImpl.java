package com.lastdance.ziip.family.service;

import com.lastdance.ziip.family.dto.request.FamilyNickNameRequest;
import com.lastdance.ziip.family.dto.request.FamilyRegisterAcceptRequestDto;
import com.lastdance.ziip.family.dto.request.FamilyRegisterRequestDto;
import com.lastdance.ziip.family.dto.response.FamilyListDetailResponseDto;
import com.lastdance.ziip.family.dto.response.FamilyListResponseDto;
import com.lastdance.ziip.family.dto.response.FamilyNickNameResponse;
import com.lastdance.ziip.family.dto.response.FamilyRegisterAcceptResponseDto;
import com.lastdance.ziip.family.dto.response.FamilyRegisterResponseDto;
import com.lastdance.ziip.family.exception.MemberAlreadyRegisteredInFamilyException;
import com.lastdance.ziip.family.repository.FamilyMemberRepository;
import com.lastdance.ziip.family.repository.FamilyRepository;
import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.family.repository.entity.FamilyMember;
import com.lastdance.ziip.global.awsS3.S3Uploader;
import com.lastdance.ziip.member.dto.FileDto;
import com.lastdance.ziip.member.repository.entity.Member;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class FamilyServiceImpl implements FamilyService {

    private final FamilyRepository familyRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final S3Uploader s3Uploader;

    @Override
    public FamilyRegisterResponseDto registFamily(Member findMember, FamilyRegisterRequestDto familyRegisterRequest, MultipartFile file) throws IOException {

        String code = String.valueOf(UUID.randomUUID());

        // 이미지 등록 안했을 때
        if(file.isEmpty()){
            Family family = Family.builder()
                    .name(familyRegisterRequest.getName())
                    .content(familyRegisterRequest.getContent())
                    .code(code)
                    .build();

            Family saveFamily = familyRepository.save(family);

            FamilyMember familyMember = FamilyMember.builder()
                    .member(findMember)
                    .family(saveFamily)
                    .nickname(familyRegisterRequest.getNickname())
                    .build();

            FamilyMember saveFamilyMember = familyMemberRepository.save(familyMember);

            FamilyRegisterResponseDto familyRegisterResponseDto = FamilyRegisterResponseDto.builder()
                    .id(saveFamily.getId())
                    .build();

            return familyRegisterResponseDto;
        }
        // 이미지 등록 했을 때
        else{
            String fileUrl = s3Uploader.upload(file, "family");
            String originalName = file.getOriginalFilename();

            FileDto newfileDto = FileDto.builder()
                    .fileOriginalName(originalName)
                    .filePath(fileUrl)
                    .build();

            Family family = Family.builder()
                    .name(familyRegisterRequest.getName())
                    .content(familyRegisterRequest.getContent())
                    .code(code)
                    .profileImgName(newfileDto.getFileOriginalName())
                    .profileImgUrl(newfileDto.getFilePath())
                    .build();

            Family saveFamily = familyRepository.save(family);

            FamilyMember familyMember = FamilyMember.builder()
                    .member(findMember)
                    .family(saveFamily)
                    .nickname(familyRegisterRequest.getNickname())
                    .build();

            FamilyMember saveFamilyMember = familyMemberRepository.save(familyMember);

            FamilyRegisterResponseDto familyRegisterResponseDto = FamilyRegisterResponseDto.builder()
                    .id(saveFamily.getId())
                    .build();

            return familyRegisterResponseDto;
        }

    }

    @Override
    public FamilyRegisterAcceptResponseDto acceptFamily(Member findMember, FamilyRegisterAcceptRequestDto familyRegisterAcceptRequest) {
        Family family = familyRepository.findByCode(familyRegisterAcceptRequest.getFamilyCode());

        FamilyMember existingFamilyMember = familyMemberRepository.findByMemberAndFamily(findMember, family);
        if (existingFamilyMember != null) {
            throw new MemberAlreadyRegisteredInFamilyException("해당 멤버는 이미 이 가족에 등록되어 있습니다.");
        }


        FamilyMember familyMember = FamilyMember.builder()
                .member(findMember)
                .family(family)
                .nickname(familyRegisterAcceptRequest.getNickname())
                .build();

        FamilyMember saveFamilyMember = familyMemberRepository.save(familyMember);

        FamilyRegisterAcceptResponseDto familyRegisterAcceptResponse = FamilyRegisterAcceptResponseDto.builder()
                .familyId(saveFamilyMember.getId())
                .build();

        return familyRegisterAcceptResponse;
    }

    @Override
    public FamilyListResponseDto listFamily(Member findMember) {

        List<FamilyMember> familyMembers = familyMemberRepository.findAllByMember(findMember);

        List<FamilyListDetailResponseDto> familyListDetailResponseDtoList = new ArrayList<>();

        for (FamilyMember familyMember : familyMembers) {
            FamilyListDetailResponseDto familyListDetailResponseDto = FamilyListDetailResponseDto.builder()
                    .id(familyMember.getFamily().getId())
                    .name(familyMember.getFamily().getName())
                    .profileImgUrl(familyMember.getFamily().getProfileImgUrl())
                    .build();

            familyListDetailResponseDtoList.add(familyListDetailResponseDto);
        }

        FamilyListResponseDto familyListResponseDto = FamilyListResponseDto.builder()
                .familyListDetailResponseDtoList(familyListDetailResponseDtoList)
                .build();

        return familyListResponseDto;
    }

    @Override
    public FamilyNickNameResponse modifyNickname(Member findMember,
            FamilyNickNameRequest familyNickNameRequest) {

        FamilyMember familyMember = familyMemberRepository.findByMemberAndFamilyId(findMember, familyNickNameRequest.getFamilyId());

        familyMember.updateNickname(familyNickNameRequest.getNickname());

        FamilyNickNameResponse familyNickNameResponse = FamilyNickNameResponse.builder()
                .familyId(familyMember.getFamily().getId())
                .build();

        return familyNickNameResponse;
    }

}
