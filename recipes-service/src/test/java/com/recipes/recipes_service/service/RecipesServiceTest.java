package com.recipes.recipes_service.service;

import java.util.ArrayList;
import java.util.List;

import com.mongodb.client.result.DeleteResult;
import org.assertj.core.api.Assertions;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ActiveProfiles;
import com.recipes.recipes_service.domain.Ingredient;
import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.enums.Unit;

import static org.mockito.Mockito.when;

@DataMongoTest
@ActiveProfiles("test")
public class RecipesServiceTest {

        @Autowired
        private MongoTemplate mongoTemplate;
        private Recipe recipe;

        @BeforeEach
        public void init() {
                mongoTemplate = Mockito.mock(MongoTemplate.class);
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
                Assertions.assertThat(savedRecipe).isNotNull();
        }

        @Test
        public void RecipesService_FindAll_ReturnAllRecipes() {
                when(mongoTemplate.save(recipe)).thenReturn(recipe);
                mongoTemplate.save(recipe);
                List<Recipe> recipes = mongoTemplate.findAll(Recipe.class);
                Assertions.assertThat(recipes).isNotNull();
                Assertions.assertThat(recipe.getId()).isNotNull();
        }

        @Test
        public void RecipesService_FindById_ReturnRecipe() {
                when(mongoTemplate.findById(recipe.getId(), Recipe.class)).thenReturn(recipe);
                Recipe foundRecipe = mongoTemplate.findById(recipe.getId(), Recipe.class);
                Assertions.assertThat(foundRecipe).isNotNull();
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
