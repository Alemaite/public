module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: [`${__dirname}/setup-jest.ts`],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
};
