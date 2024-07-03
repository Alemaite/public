package com.recipes.recipes_service.domain;

import com.recipes.recipes_service.enums.Unit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ingredient {
    private double quantity;
    private Unit unit;
    private String name;
}
