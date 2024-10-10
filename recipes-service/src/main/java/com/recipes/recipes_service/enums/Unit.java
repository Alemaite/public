package com.recipes.recipes_service.enums;

import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Unit {
    GRAMS("g"), KILOGRAMS("kg"), MILLILITERS("ml"), LITERS("l"), PIECES("pcs"), TEASPOONS("tsp"), TABLESPOONS("tbsp"),
    SMALL("small"), MEDIUM("medium"), LARGE("large"), CAN("can"), CUP("cup"), CUPS("cups"), BLOCK("block"),
    PACKAGE("package"),;

    @JsonValue
    private final String value;
}
