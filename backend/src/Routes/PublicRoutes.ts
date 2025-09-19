import Container from "../container";
import { BaseRoutes } from "./BaseRoutes";

/**
 * @author Roan Slingerland
 */
export class PublicRoutes extends BaseRoutes {
  constructor() {
    super();
  }

  protected registerRoutes() {
    this.router.post(
      "/login",
      this.container
        .getLoginController()
        .login.bind(this.container.getLoginController())
    );

    this.router.post(
      "/register",
      this.container
        .getRegisterController()
        .register.bind(this.container.getRegisterController())
    );

    this.router.get(
      "/subjects/all",
      this.container
        .getSubjectController()
        .getAllSubjects.bind(this.container.getSubjectController())
    );
  }

  public getRoute(): string {
    return "/";
  }
}
