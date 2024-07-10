package com.recipes.recipes_service.facade;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.assertj.core.api.Assertions;
import com.recipes.recipes_service.domain.Ingredient;
import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.enums.Unit;
import com.recipes.recipes_service.repository.RecipesRepository;
import com.recipes.recipes_service.service.RecipesService;

@ExtendWith(MockitoExtension.class)
public class RecipesFacadeTest {

    @Mock
    private RecipesRepository recipesRepository;

    @InjectMocks
    private RecipesService recipesService;

    private Recipe recipe;

    @BeforeEach
    public void init() {
        ArrayList<Ingredient> ingredients = new ArrayList<>();
        ArrayList<String> desc = new ArrayList<>();
        String desc1 = "desc1";
        desc.add(desc1);
        Ingredient ingredient = Ingredient.builder()
                .name("Tomatoes")
                .quantity(100)
                .unit(Unit.GRAMS)
                .build();
        ingredients.add(ingredient);
        recipe = Recipe.builder()
                .id(new ObjectId())
                .title("Burger")
                .ingredients(ingredients)
                .desc(desc)
                .shortDesc("My Short Description")
                .imagePath("My Image Path")
                .build();
    }

    @Test
    public void RecipesFacade_ReadAll_ReturnsAllRecipes() {
        List<Recipe> recipes = Mockito.mock(List.class);
        when(recipesRepository.findAll()).thenReturn(recipes);
        List<Recipe> result = recipesService.readAll();
        Assertions.assertThat(result).isEqualTo(recipes);
    }

    @Test
    public void RecipesFacade_Read_ReturnsRecipe() {
        when(recipesRepository.findById(recipe.getId())).thenReturn(Optional.of(recipe));
        Recipe result = recipesService.read(recipe.getId());
        Assertions.assertThat(result).isEqualTo(recipe);
    }

    @Test
    public void RecipesFacade_ReadWithSearch_ReturnsRecipePage() {
        Page<Recipe> recipes = Mockito.mock(Page.class);
        Pageable pageRequest = Mockito.mock(Pageable.class);
        when(recipesRepository.findByTitleContainingIgnoreCase("search", pageRequest)).thenReturn(recipes);
        Page<Recipe> result = recipesService.readWithSearch(pageRequest, "search");
        Assertions.assertThat(result).isEqualTo(recipes);
    }

    @Test
    public void RecipesFacade_Create_ReturnsSavedRecipe() {
        when(recipesRepository.save(recipe)).thenReturn(recipe);
        Recipe result = recipesService.create(recipe);
        Assertions.assertThat(result).isEqualTo(recipe);
    }

    @Test
    public void RecipesFacade_Update_ReturnsUpdatedRecipe() {
        when(recipesRepository.save(recipe)).thenReturn(recipe);
        Recipe result = recipesService.update(recipe.getId(), recipe);
        Assertions.assertThat(result.getId()).isEqualTo(recipe.getId());
    }

    @Test
    public void RecipesFacade_Delete_ReturnsVoid() {
        assertAll(() -> recipesService.delete(new ArrayList<ObjectId>()));
    }
}
