package com.lastdance.ziip.global.util;

import com.lastdance.ziip.plan.enums.Code;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class CodeConverter implements AttributeConverter<Code, Integer> {

    @Override
    public Integer convertToDatabaseColumn(Code code) {
        if (code == null) {
            return null;
        }
        return code.getValue();
    }

    @Override
    public Code convertToEntityAttribute(Integer value) {
        if (value == null) {
            return null;
        }
        for (Code code : Code.values()) {
            if (code.getValue().equals(value)) {
                return code;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }
}
