package com.lastdance.ziip.album.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lastdance.ziip.album.enums.ImageCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlbumImageResponseDto {

    private ImageCategory category;
    private String imgUrl;
    private String detail;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate endDate;




}
