package com.lastdance.ziip.album.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlbumMonthRequestDto {

    private Integer year;
    private Integer month;
    private Long familyId;

}
