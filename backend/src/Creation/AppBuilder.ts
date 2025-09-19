import express, { Express, NextFunction } from "express";
import { Server } from "http";

import cors from "cors";
import cookieParser from "cookie-parser";
import { seedDatabase } from "../Database/SeedDatabase";
import { BaseRoutes } from "../Routes/BaseRoutes";
import { sequelize } from "../Database/Configuration";
import { ErrorHandler } from "../Middleware/ErrorHandler";
import dotenv from "dotenv";

export class AppBuilder {
  private app!: Express;
  private routed!: boolean;
  private started!: boolean;
  private server!: Server;

  private logging: boolean;

  constructor(logging: boolean = false) {
    this.logging = logging;

    this.reset();
  }

  public getApp(): Express {
    return this.app;
  }

  public reset(): void {
    this.app = express();
    this.routed = false;
    this.started = false;

    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    dotenv.config();

    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private setupErrorHandling(): void {
    const errorHandler = new ErrorHandler(this.logging);

    this.app.use(
      (
        error: Error,
        req: express.Request,
        res: express.Response,
        next: NextFunction
      ) => {
        errorHandler.invoke(error, res);
      }
    );
  }

  public setRoutes(routesArray: BaseRoutes[]): void {
    if (this.routed) throw new Error("Routes have already been set");
    this.routed = true;

    routesArray.forEach((routes) => {
      this.app.use(routes.getRoute(), routes.getRouter());
    });

    this.setupErrorHandling();
  }

  public async startServer(port: number): Promise<void> {
    if (this.started) throw new Error("Server has already been started");
    this.started = true;

    try {
      await sequelize.sync({ force: process.env.NODE_ENV === "test" });
      await seedDatabase(this.logging);

      this.server = this.app.listen(port, () => {
        if (this.logging) {
          console.log(`App listening at http://localhost:${port}`);
        }
      });
    } catch (error) {
      console.error("Unable to sync database:", error);
    }
  }

  public closeServer(): Promise<void> {
    if (!this.started)
      throw new Error("Server has to start before it can close");

    return new Promise<void>((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          if (this.logging) {
            console.log("App has been closed");
          }

          resolve();
        }
      });
    });
  }
}
