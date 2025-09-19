import { Request, Response, NextFunction } from "express";
import { RegisterService } from "../Business/Service/RegisterService";
import { RegisterModel } from "../Business/Models/RegisterModel";

export class RegisterController {
  private registerService: RegisterService;

  constructor(registerService: RegisterService) {
    this.registerService = registerService;
  }

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check if subjects is present and not empty
      if (
        !req.body.subjects ||
        !Array.isArray(req.body.subjects) ||
        req.body.subjects.length === 0
      ) {
        res
          .status(400)
          .json({ message: "At least one subject must be selected" });
        return;
      }

      // Check if registration code is provided
      if (!req.body.registerCode) {
        res.status(400).json({ message: "Registration code is required" });
        return;
      }

      const registerModel: RegisterModel = new RegisterModel(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.password,
        req.body.subjects
      );

      await this.registerService.register(registerModel, req.body.registerCode);
      res.status(201).json({ message: "User registered successfully" });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message });
    }
  }
}
