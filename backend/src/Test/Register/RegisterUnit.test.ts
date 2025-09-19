import { RegisterModel } from "../../Business/Models/RegisterModel";
import { expect } from "chai";
import * as fc from 'fast-check';

describe("RegisterModel Email Validation Tests", () => {
  it("should accept a valid email format", () => {
    // Arrange
    const validEmail = "juf@example.com";
    const firstName = "Test";
    const lastName = "Teacher";
    const password = "Password123";
    const subjects = ["Wiskunde"];

    // Act & Assert
    try {
      const model = new RegisterModel(
        firstName,
        lastName,
        validEmail,
        password,
        subjects
      );
      expect(model.email).to.equal(validEmail);
    } catch (error: any) {
      expect.fail(`Valid email "${validEmail}" was rejected: ${error.message}`);
    }
  });

  it("should reject an email with double @ symbol", () => {
    // Arrange
    const invalidEmail = "meester@@school.nl";
    const firstName = "Test";
    const lastName = "Teacher";
    const password = "Password123";
    const subjects = ["Wiskunde"];

    // Act & Assert
    try {
      const model = new RegisterModel(
        firstName,
        lastName,
        invalidEmail,
        password,
        subjects
      );
      expect.fail(`Invalid email "${invalidEmail}" was accepted`);
    } catch (error: any) {
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.include("Invalid email format");
    }
  });

  it("should reject an email without @ symbol", () => {
    // Arrange
    const invalidEmail = "docent.school.com";
    const firstName = "Test";
    const lastName = "Teacher";
    const password = "Password123";
    const subjects = ["Wiskunde"];

    // Act & Assert
    try {
      const model = new RegisterModel(
        firstName,
        lastName,
        invalidEmail,
        password,
        subjects
      );
      expect.fail(`Invalid email "${invalidEmail}" was accepted`);
    } catch (error: any) {
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.include("Invalid email format");
    }
  });
});

// Add new tests for subjects array support
describe("RegisterModel Subject Validation Tests", () => {
  it("should accept an array with a single valid subject", () => {
    // Arrange
    const firstName = "Test";
    const lastName = "Teacher";
    const email = "teacher@school.com";
    const password = "Password123";
    const subjects = ["Wiskunde"];

    // Act
    const model = new RegisterModel(
      firstName,
      lastName,
      email,
      password,
      subjects
    );

    // Assert
    expect(model.subjects).to.deep.equal(subjects);
  });

  it("should accept an array with multiple valid subjects", () => {
    // Arrange
    const firstName = "Test";
    const lastName = "Teacher";
    const email = "teacher@school.com";
    const password = "Password123";
    const subjects = ["Wiskunde", "Engels", "Biologie"];

    // Act
    const model = new RegisterModel(
      firstName,
      lastName,
      email,
      password,
      subjects
    );

    // Assert
    expect(model.subjects).to.deep.equal(subjects);
    expect(model.subjects.length).to.equal(3);
  });

  it("should reject an empty array of subjects", () => {
    // Arrange
    const firstName = "Test";
    const lastName = "Teacher";
    const email = "teacher@school.com";
    const password = "Password123";
    const subjects: string[] = [];

    // Act & Assert
    try {
      const model = new RegisterModel(
        firstName,
        lastName,
        email,
        password,
        subjects
      );
      expect.fail("Empty subject array was accepted");
    } catch (error: any) {
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.include("At least one subject must be selected");
    }
  });

  it("should reject an array with invalid subjects", () => {
    // Arrange
    const firstName = "Test";
    const lastName = "Teacher";
    const email = "teacher@school.com";
    const password = "Password123";
    const subjects = ["Wiskunde", "InvalidSubject"];

    // Act & Assert
    try {
      const model = new RegisterModel(
        firstName,
        lastName,
        email,
        password,
        subjects
      );
      expect.fail("Invalid subject array was accepted");
    } catch (error: any) {
      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.include(
        "Invalid subject selection: InvalidSubject"
      );
    }
  });
});

// Monkey tests for RegisterModel
describe("RegisterModel Monkey Tests", () => {
  const validFirstNames = ["John", "Emma", "Li", "José", "Marie-Claire"];
  const validLastNames = ["Smith", "García", "Zhang", "O'Neill", "van der Berg"];
  const validEmails = ["test@example.com", "user@school.nl", "name.surname@domain.co.uk"];
  const validPasswords = ["Password123", "SecurePass!23", "P@ssw0rd2023"];
  const validSubjects = [["Wiskunde"], ["Engels"], ["Biologie"], ["Wiskunde", "Engels"]];
  
  // Random data generators
  function getRandomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Monkey test with random but valid inputs
  it("should handle various combinations of valid inputs", () => {
    // Run multiple random iterations
    for (let i = 0; i < 20; i++) {
      const firstName = getRandomItem(validFirstNames);
      const lastName = getRandomItem(validLastNames);
      const email = getRandomItem(validEmails);
      const password = getRandomItem(validPasswords);
      const subjects = getRandomItem(validSubjects);
      
      try {
        const model = new RegisterModel(
          firstName,
          lastName,
          email,
          password,
          subjects
        );
        
        // Basic structure validation
        expect(model).to.not.be.undefined;
        expect(model.firstName).to.equal(firstName);
        expect(model.lastName).to.equal(lastName);
        expect(model.email).to.equal(email);
        expect(model.subjects).to.deep.equal(subjects);
      } catch (error) {
        expect.fail(`Valid combination failed: ${error}`);
      }
    }
  });

  // Test with invalid random inputs
  it("should gracefully handle random invalid inputs", () => {
    // Try random invalid combinations
    for (let i = 0; i < 20; i++) {
      // Generate potentially problematic inputs
      const inputs = [
        // Random selection for which parameter to make invalid
        getRandomInt(0, 4) === 0 ? getRandomString(getRandomInt(0, 30)) : getRandomItem(validFirstNames),
        getRandomInt(0, 4) === 1 ? getRandomString(getRandomInt(0, 30)) : getRandomItem(validLastNames),
        getRandomInt(0, 4) === 2 ? `${getRandomString(5)}${getRandomInt(0, 1) ? '@' : ''}${getRandomString(5)}` : getRandomItem(validEmails),
        getRandomInt(0, 4) === 3 ? getRandomString(getRandomInt(0, 20)) : getRandomItem(validPasswords),
        getRandomInt(0, 4) === 4 ? (getRandomInt(0, 1) ? [] : ["InvalidSubject"]) : getRandomItem(validSubjects),
      ];

      try {
        const model = new RegisterModel(
          inputs[0] as string,
          inputs[1] as string,
          inputs[2] as string,
          inputs[3] as string,
          inputs[4] as string[]
        );
        
        // If we got here with invalid data, validate the model structure is still intact
        expect(model).to.not.be.undefined;
        expect(typeof model.firstName).to.equal("string");
        expect(typeof model.lastName).to.equal("string");
        expect(typeof model.email).to.equal("string");
        expect(Array.isArray(model.subjects)).to.be.true;
      } catch (error) {
        // We expect errors for invalid inputs, just ensure they're Error instances
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.not.be.empty;
      }
    }
  });

  // Special edge case tests
  it("should handle edge cases without crashing", () => {
    const edgeCases = [
      // Very long inputs
      { fn: "X".repeat(100), ln: "Smith", em: "test@example.com", pw: "Password123", sb: ["Wiskunde"] },
      // Unicode and special characters
      { fn: "Jöhn", ln: "Smith-O'Neill", em: "test+123@example.com", pw: "P@ss123!$", sb: ["Wiskunde"] },
      // Empty strings (should reject them)
      { fn: "", ln: "Smith", em: "test@example.com", pw: "Password123", sb: ["Wiskunde"] },
      // Unusual but potentially valid email formats
      { fn: "John", ln: "Smith", em: "very.unusual@example.com", pw: "Password123", sb: ["Wiskunde"] },
    ];

    for (const testCase of edgeCases) {
      try {
        const model = new RegisterModel(
          testCase.fn,
          testCase.ln,
          testCase.em,
          testCase.pw,
          testCase.sb
        );
        // Some edge cases should be valid
        expect(model).to.not.be.undefined;
      } catch (error) {
        // Some edge cases should cause errors, just ensure they're proper Error instances
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.not.be.empty;
      }
    }
  });
  describe("RegisterModel Property Tests", () => {
  // Property: Model preserves valid input values
  it("should preserve all valid input values", () => {
    // Define valid input generators
    const nameArbitrary = fc.string().filter(s => s.trim().length > 0);
    const emailArbitrary = fc.emailAddress();
    const passwordArbitrary = fc.string().filter(s => 
      /[A-Z]/.test(s) && /[0-9]/.test(s) && s.length >= 8);
    const validSubjectArbitrary = fc.constantFrom("Wiskunde", "Engels", "Biologie");
    const subjectsArbitrary = fc.array(validSubjectArbitrary, { minLength: 1, maxLength: 5 });
    
    // Define the property
    const preservesInputProperty = fc.property(
      nameArbitrary,
      nameArbitrary,
      emailArbitrary,
      passwordArbitrary,
      subjectsArbitrary,
      (firstName, lastName, email, password, subjects) => {
        // Create model with these inputs
        const model = new RegisterModel(firstName, lastName, email, password, subjects);
        
        // Property: model preserves all input values
        return model.firstName === firstName &&
               model.lastName === lastName &&
               model.email === email &&
               JSON.stringify(model.subjects) === JSON.stringify(subjects);
      }
    );
    
    // Assert the property holds
    fc.assert(preservesInputProperty);
  });
  
  // Property: Model always rejects empty subjects array
  it("should always reject empty subjects array", () => {
    const nameArbitrary = fc.string().filter(s => s.trim().length > 0);
    const emailArbitrary = fc.emailAddress();
    const passwordArbitrary = fc.string().filter(s => 
      /[A-Z]/.test(s) && /[0-9]/.test(s) && s.length >= 8);
    
    const rejectsEmptySubjectsProperty = fc.property(
      nameArbitrary,
      nameArbitrary,
      emailArbitrary,
      passwordArbitrary,
      (firstName, lastName, email, password) => {
        try {
          new RegisterModel(firstName, lastName, email, password, []);
          return false; // Should have thrown an error
        } catch (error) {
          return error instanceof Error && 
                 error.message.includes("At least one subject must be selected");
        }
      }
    );
    
    fc.assert(rejectsEmptySubjectsProperty);
  });
  
});
});