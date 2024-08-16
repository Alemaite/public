package com.recipes.recipes_service.dto;

import com.recipes.recipes_service.domain.Recipe;
import lombok.Getter;

import java.util.ArrayList;

@Getter
public class UpdateFavoriteRecipesDto {
    private String email;
    private ArrayList<Recipe> recipes;
}
