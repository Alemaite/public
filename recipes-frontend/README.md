# Recipes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.1, and then updated to Angular 17.3.8.

## Running a Server With Docker

- run `docker compose up` in the root directory of this project
- be sure to spin up a backend and MongoDB container (see HELP.MD in recipes-service project) beforehand to fetch data

## Running a Server Without Docker

- make sure at least version 20.14.0 of node.js is installed (https://nodejs.org/)
- make sure at least version 17.3.8 of the Angular CLI is installed globally (`npm install -g @angular/cli@17.3.8`).
- run `npm install` to install all dependencies for this project

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. Please note that for security reasons I do not provide the file with the client-id for the recipe app to enable OAuth, and you won't be able to use that feature locally.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests via Jest.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
