package com.lastdance.ziip.family.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyModifyReqeustDto {
	private long id;
	private String name;
	private String content;
}
