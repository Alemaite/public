package com.recipes.recipes_service.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.mongodb.client.result.DeleteResult;
import com.recipes.recipes_service.repository.RecipesRepository;
import org.assertj.core.api.Assertions;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ActiveProfiles;
import com.recipes.recipes_service.domain.Ingredient;
import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.enums.Unit;

import static org.mockito.Mockito.when;

@DataMongoTest
@ActiveProfiles("test")
public class RecipesServiceImplTest {

    @Autowired
    private MongoTemplate mongoTemplate;
    private RecipesRepository recipesRepository;
    private Recipe recipe;
    private List<Recipe> recipes;
    private Pageable pageRequest;
    private Page<Recipe> recipePage;

    @BeforeEach
    public void init() {
        mongoTemplate = Mockito.mock(MongoTemplate.class);
        recipesRepository = Mockito.mock(RecipesRepository.class);
        pageRequest = PageRequest.of(0, 6, Sort.by("title").ascending());
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
        recipes = new ArrayList<Recipe>();
        recipes.add(recipe);
        recipePage = new PageImpl<>(recipes, pageRequest, recipes.size());
    }

    @Test
    void RecipesService_Update_ReturnsUpdatedRecipe() {
        when(mongoTemplate.save(recipe)).thenReturn(recipe);
        Recipe result = mongoTemplate.save(recipe);
        result.setTitle("Pizza");
        Recipe updatedRecipe = mongoTemplate.save(result);
        Assertions.assertThat(updatedRecipe.getTitle()).isEqualTo("Pizza");
    }

    @Test
    public void RecipesService_Save_ReturnsSavedRecipe() {
        when(mongoTemplate.save(recipe)).thenReturn(recipe);
        Recipe savedRecipe = mongoTemplate.save(recipe);
        Assertions.assertThat(savedRecipe.getTitle()).isNotNull();
    }

    @Test
    public void RecipesService_FindAll_ReturnAllRecipes() {
        when(mongoTemplate.findAll(Recipe.class)).thenReturn(recipes);
        List<Recipe> recipes = mongoTemplate.findAll(Recipe.class);
        Assertions.assertThat(recipes.size()).isGreaterThan(0);
    }

    @Test
    public void RecipesService_FindAllRecipes_ReturnPage() {
        when(recipesRepository.findAll(pageRequest)).thenReturn(recipePage);
        Page<Recipe> foundRecipesPage = recipesRepository.findAll(pageRequest);
        Assertions.assertThat(foundRecipesPage.getTotalElements()).isEqualTo(1);
    }

    @Test
    public void RecipesService_SearchRecipe_ReturnPage() {
        when(recipesRepository.findByTitleContainingIgnoreCase(recipe.getTitle(), pageRequest)).thenReturn(recipePage);
        Page<Recipe> foundRecipePage = recipesRepository.findByTitleContainingIgnoreCase(recipe.getTitle(), pageRequest);
        Assertions.assertThat(foundRecipePage.getTotalElements()).isEqualTo(1);
    }

    @Test
    public void RecipesService_FindById_ReturnRecipe() {
        when(mongoTemplate.findById(recipe.getId(), Recipe.class)).thenReturn(recipe);
        Recipe foundRecipe = mongoTemplate.findById(recipe.getId(), Recipe.class);
        assert foundRecipe != null;
        Assertions.assertThat(foundRecipe.getTitle()).isNotNull();
    }

    @Test
    public void RecipesService_Remove_RemoveRecipes() {
        DeleteResult deleteResult = Mockito.mock(DeleteResult.class);
        when(mongoTemplate.remove(recipe)).thenReturn(deleteResult);
        when(deleteResult.wasAcknowledged()).thenReturn(true);
        DeleteResult result = mongoTemplate.remove(recipe);
        Assertions.assertThat(result.wasAcknowledged()).isTrue();
    }
}
