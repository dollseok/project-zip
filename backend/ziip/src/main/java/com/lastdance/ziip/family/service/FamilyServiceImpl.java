package com.lastdance.ziip.family.service;

import com.lastdance.ziip.family.dto.request.FamilyRegisterRequest;
import com.lastdance.ziip.family.dto.response.FamilyRegisterResponseDto;
import com.lastdance.ziip.family.repository.FamilyMemberRepository;
import com.lastdance.ziip.family.repository.FamilyRepository;
import com.lastdance.ziip.family.repository.entity.Family;
import com.lastdance.ziip.family.repository.entity.FamilyMember;
import com.lastdance.ziip.global.awsS3.S3Uploader;
import com.lastdance.ziip.member.dto.FileDto;
import com.lastdance.ziip.member.repository.entity.Member;
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
    public FamilyRegisterResponseDto registFamily(Member findMember, FamilyRegisterRequest familyRegisterRequest, MultipartFile file) throws IOException {

        String code = String.valueOf(UUID.randomUUID());
        System.out.println(code);
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

}
