import { Router } from "express";
import Container from "../container";

export abstract class BaseRoutes {
    protected router: Router;
    protected container: Container;

    constructor(roles?: string[]) {
        this.router = Router();
        this.container = Container.getInstance();

        if (roles) {
            this.router.use((req, _, next) =>
                this.container.getAuthenticator().validateSession(req, next, roles)
            );
        }

        this.registerRoutes();
    }

    protected abstract registerRoutes(): void;

    public getRouter(): Router {
        return this.router;
    }

    public abstract getRoute(): string;
}
