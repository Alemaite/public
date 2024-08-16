package com.recipes.recipes_service.domain;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Document(collection = "users")
@AllArgsConstructor
@Getter
@Builder
@Setter
public class User {
    @Id
    private ObjectId id;
    private String email;
    private String fullName;
    private ArrayList<Recipe> favorites;

    @JsonProperty("id")
    public String getStringId() {
        return this.id.toHexString();
    }
}
