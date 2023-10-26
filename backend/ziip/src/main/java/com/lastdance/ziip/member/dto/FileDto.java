package com.lastdance.ziip.member.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileDto {

    private String fileOriginalName;
    private String filePath;
}
