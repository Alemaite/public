package com.recipes.recipes_service.dto;

import com.recipes.recipes_service.domain.Recipe;
import lombok.Getter;

@Getter
public class AddRecipeToFavoritesDto {
    private String email;
    private Recipe recipe;
}
