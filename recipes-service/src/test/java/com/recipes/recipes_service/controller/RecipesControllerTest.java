package com.recipes.recipes_service.controller;

import java.util.ArrayList;
import java.util.List;

import com.recipes.recipes_service.service.impl.RecipesServiceImpl;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recipes.recipes_service.domain.Ingredient;
import com.recipes.recipes_service.domain.Recipe;
import com.recipes.recipes_service.enums.Unit;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;

@WebMvcTest(controllers = RecipesController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class RecipesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RecipesServiceImpl recipesServiceImpl;

    @Autowired
    private ObjectMapper objectMapper;

    private Recipe recipe;
    private Recipe anotherRecipe;
    private List<Recipe> recipes;
    private PageRequest pageRequest;
    private Page<Recipe> recipesPage;

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
        anotherRecipe = Recipe.builder()
                .id(new ObjectId())
                .title("Pizza")
                .ingredients(ingredients)
                .desc(desc)
                .shortDesc("My Short Description")
                .imagePath("My Image Path")
                .build();
        recipes = new ArrayList<>();
        pageRequest = PageRequest.of(0, 6);
        recipes.add(recipe);
        recipes.add(anotherRecipe);
        recipesPage = new PageImpl<>(recipes, pageRequest, recipes.size());
    }

    @Test
    public void RecipesController_ReadAll_ReturnsRecipes() throws Exception {
        given(recipesServiceImpl.readAll()).willReturn(recipes);
        ResultActions response = mockMvc.perform(get("/api/recipes")
                .contentType(MediaType.APPLICATION_JSON));
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title", is(recipes.get(0).getTitle())));
    }

    @Test
    public void RecipesController_Read_ReturnsRecipesPage() throws Exception {
        given(recipesServiceImpl.read(0, 6)).willReturn(recipesPage);
        ResultActions response = mockMvc.perform(get("/api/recipes/page?page=0&size=6")
                .contentType(MediaType.APPLICATION_JSON));
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(recipes.size())));
    }

    @Test
    public void RecipesController_Read_ReturnsRecipeById() throws Exception {
        given(recipesServiceImpl.readById(recipe.getId())).willReturn(recipe);
        ResultActions response = mockMvc.perform(get("/api/recipes/" + recipe.getId())
                .contentType(MediaType.APPLICATION_JSON));
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is(recipe.getTitle())));
    }

    @Test
    public void RecipesController_Create_ReturnsRecipe() throws Exception {
        given(recipesServiceImpl.create(any())).willAnswer((invocation -> invocation.getArgument(0)));
        ResultActions response = mockMvc.perform(post("/api/recipes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recipe)));
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is(recipe.getTitle())));
    }

    @Test
    public void RecipesController_Update_ReturnsUpdatedRecipe() throws Exception {
        recipe.setTitle("Updated Title");
        given(recipesServiceImpl.update(any(), any())).willAnswer((invocation -> invocation.getArgument(1)));
        ResultActions response = mockMvc.perform(put("/api/recipes/" + recipe.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recipe)));
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is(recipe.getTitle())));
    }

    @Test
    public void RecipesController_Delete_ReturnsVoid() throws Exception {
        willDoNothing().given(recipesServiceImpl).delete(any());
        ResultActions response = mockMvc.perform(delete("/api/recipes?ids=" + recipe.getId().toString())
                .contentType(MediaType.APPLICATION_JSON));
        response.andExpect(status().isOk()).andDo(print());
    }
}
