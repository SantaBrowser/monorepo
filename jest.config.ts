import { getJestProjects } from '@nx/jest';

export default {
    projects: getJestProjects(),
    testMatch: ["**/latest/**/*.test.js"],
};
  