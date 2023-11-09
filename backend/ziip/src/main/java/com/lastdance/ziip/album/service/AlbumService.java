package com.lastdance.ziip.album.service;

import com.lastdance.ziip.album.dto.request.AlbumMonthRequestDto;
import com.lastdance.ziip.album.dto.response.AlbumListResponseDto;
import com.lastdance.ziip.album.dto.response.AlbumMonthResponseDto;
import com.lastdance.ziip.member.repository.entity.Member;

public interface AlbumService {
    AlbumListResponseDto listAlbum(Member findMember, Long familyId);
    AlbumMonthResponseDto monthAlbum(Member fineMember, AlbumMonthRequestDto albumMonthRequestDto);
}
