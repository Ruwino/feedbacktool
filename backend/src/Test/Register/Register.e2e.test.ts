import { expect } from "chai";
import supertest, { Agent } from "supertest";
import UserTable from "../../Data/Tables/UserTable";
import SubjectTable from "../../Data/Tables/SubjectTable";
import SubjectHasTeacherTable from "../../Data/Tables/SubjectHasTeacherTable";
import { AppBuilder } from "../../Creation/AppBuilder";
import { PublicRoutes } from "../../Routes/PublicRoutes";
import { sequelize } from "../../Database/Configuration";
import RegisterCodeTable from "../../Data/Tables/RegisterCodeTable";

describe("Register endpoints", function () {
  let agent: Agent;
  let appBuilder: AppBuilder;
  let testRegisterCode: string;

  const TEST_EMAIL = "docent@example.com";
  const ALT_TEST_EMAIL = "docent2@example.com";

  after(async () => {
    // Clean up test data
    await SubjectHasTeacherTable.destroy({
      where: {
        user_email: [TEST_EMAIL, ALT_TEST_EMAIL, "newteacher@example.com"],
      },
    });
    await UserTable.destroy({
      where: { email: [TEST_EMAIL, ALT_TEST_EMAIL, "newteacher@example.com"] },
    });
    await RegisterCodeTable.destroy({
      where: { code: "TESTCODE" },
    });

    // Close server
    await appBuilder.closeServer();
  });

  before(async () => {
    // Set up the app with routes
    appBuilder = new AppBuilder();
    appBuilder.setRoutes([new PublicRoutes()]);

    // Start server for testing
    await appBuilder.startServer(1);

    // Create the agent for making requests
    agent = supertest.agent(appBuilder.getApp());

    // Make sure test data doesn't exist
    await SubjectHasTeacherTable.destroy({
      where: {
        user_email: [TEST_EMAIL, ALT_TEST_EMAIL, "newteacher@example.com"],
      },
    });
    await UserTable.destroy({
      where: { email: [TEST_EMAIL, ALT_TEST_EMAIL, "newteacher@example.com"] },
    });
    await RegisterCodeTable.destroy({
      where: { code: "TESTCODE" },
    });

    // Ensure subjects exist in the database
    await sequelize.sync();

    // Create test subject if it doesn't exist
    await SubjectTable.findOrCreate({
      where: { name: "Biologie" },
      defaults: { name: "Biologie" },
    });

    // Create a test registration code
    await RegisterCodeTable.create({
      code: "TESTCODE",
    });
    testRegisterCode = "TESTCODE";
  });

  describe("POST /register", function () {
    it("should successfully register a user with valid data", async function () {
      // Arrange: Create test data with subjects as array
      const userData = {
        firstName: "Test",
        lastName: "Docent",
        email: TEST_EMAIL,
        password: "SterkWachtwoord123",
        repeatPassword: "SterkWachtwoord123",
        subjects: ["Biologie"], // Now using subjects array instead of single subject
        registerCode: testRegisterCode, // Add the registration code
      };

      // Act: Send registration request
      const response = await agent.post("/register").send(userData).expect(201);

      // Flexible assertion that works with different response formats
      const responseText = JSON.stringify(response.body).toLowerCase();
      expect(responseText).to.include("regist");

      // Assert: Check database for user creation
      const user = await UserTable.findOne({
        where: { email: userData.email },
      });

      // First check if user is not null
      expect(user).to.not.be.null;

      if (user) {
        expect(user.first_name).to.equal(userData.firstName);
        expect(user.last_name).to.equal(userData.lastName);

        // Check subject association
        const subjectAssociation = await SubjectHasTeacherTable.findOne({
          where: { user_email: userData.email },
        });

        expect(subjectAssociation).to.not.be.null;
      }
    });

    it("should validate email format", async function () {
      // Arrange: Create test data with invalid email
      const userData = {
        firstName: "Test",
        lastName: "Docent",
        email: "invalid-email-format",
        password: "SterkWachtwoord123",
        repeatPassword: "SterkWachtwoord123",
        subjects: ["Biologie"], // Use subjects array
        registerCode: testRegisterCode, // Add the registration code
      };

      // Act & Assert: Send request and check response
      const response = await agent.post("/register").send(userData).expect(400);
    });

    it("should return 400 when registering with missing required fields", async function () {
      // Test with missing email
      const response1 = await agent
        .post("/register")
        .send({
          firstName: "Test",
          lastName: "Docent",
          password: "SterkWachtwoord123",
          repeatPassword: "SterkWachtwoord123",
          subjects: ["Biologie"], // Use subjects array
          registerCode: testRegisterCode, // Add the registration code
        })
        .expect(400);

      // Test with missing password
      const response2 = await agent
        .post("/register")
        .send({
          firstName: "Test",
          lastName: "Docent",
          email: ALT_TEST_EMAIL,
          repeatPassword: "SterkWachtwoord123",
          subjects: ["Biologie"], // Use subjects array
          registerCode: testRegisterCode, // Add the registration code
        })
        .expect(400);

      // Test with missing subject
      const response3 = await agent
        .post("/register")
        .send({
          firstName: "Test",
          lastName: "Docent",
          email: ALT_TEST_EMAIL,
          password: "SterkWachtwoord123",
          repeatPassword: "SterkWachtwoord123",
          subjects: [], // Empty subjects array
          registerCode: testRegisterCode, // Add the registration code
        })
        .expect(400);

      // Test with missing register code
      const response4 = await agent
        .post("/register")
        .send({
          firstName: "Test",
          lastName: "Docent",
          email: ALT_TEST_EMAIL,
          password: "SterkWachtwoord123",
          repeatPassword: "SterkWachtwoord123",
          subjects: ["Biologie"], // No register code
        })
        .expect(400);
    });

    it("should return 400 when registering with an existing email", async function () {
      // Arrange: First register a user
      const userData = {
        firstName: "Test",
        lastName: "Docent",
        email: ALT_TEST_EMAIL,
        password: "SterkWachtwoord123",
        repeatPassword: "SterkWachtwoord123",
        subjects: ["Biologie"], // Use subjects array
        registerCode: testRegisterCode, // Add the registration code
      };

      // Register the user first
      await agent.post("/register").send(userData).expect(201);

      // Act & Assert: Try to register again with the same email
      const response = await agent.post("/register").send(userData).expect(400);
    });

    it("should return 400 when registering with a non-existent subject", async function () {
      // Arrange: Create test data with non-existent subject
      const userData = {
        firstName: "Test",
        lastName: "Docent",
        email: "newteacher@example.com",
        password: "SterkWachtwoord123",
        repeatPassword: "SterkWachtwoord123",
        subjects: ["NonExistentSubject"], // Use subjects array with invalid subject
        registerCode: testRegisterCode, // Add the registration code
      };

      // Act & Assert
      const response = await agent.post("/register").send(userData).expect(400);
    });

    it("should return 400 when registering with an invalid registration code", async function () {
      // Arrange: Create test data with invalid registration code
      const userData = {
        firstName: "Test",
        lastName: "Docent",
        email: "newteacher@example.com",
        password: "SterkWachtwoord123",
        repeatPassword: "SterkWachtwoord123",
        subjects: ["Biologie"],
        registerCode: "INVALIDCODE", // Invalid registration code
      };

      // Act & Assert
      const response = await agent.post("/register").send(userData).expect(400);
    });
  });
});
