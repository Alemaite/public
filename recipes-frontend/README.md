# Recipes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.1, and then updated to Angular 17.3.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. Please note that for security reasons I do not provide the file with the client-id for the recipe app to enable OAuth, and you won't be able to use that feature locally.

Additionally, I do not provide the files with authentication details for the MongoDB on the cloud server in the recipes-service project (backend). You can run a MongoDB locally and import the recipes.json in the root directory (src), in case you are interested in running the app with data locally.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests via Jest.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
