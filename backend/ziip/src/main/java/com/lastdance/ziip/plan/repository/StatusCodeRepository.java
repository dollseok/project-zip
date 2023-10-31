package com.lastdance.ziip.plan.repository;

import com.lastdance.ziip.plan.enums.Code;
import com.lastdance.ziip.plan.repository.entity.StatusCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatusCodeRepository extends JpaRepository<StatusCode, Long> {

    StatusCode findByCode(Code code);
}
