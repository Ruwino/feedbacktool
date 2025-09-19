import { ClassController } from "./Controller/ClassController";
import { StudentController } from "./Controller/StudentController";
import { SubjectController } from "./Controller/SubjectController";
import { QuestionController } from "./Controller/QuestionController";
import { RegisterController } from "./Controller/RegisterController";
import { RegisterService } from "./Business/Service/RegisterService";
import { GradeController } from "./Controller/GradeController";
import { ClassService } from "./Business/Service/ClassService";
import { SubjectService } from "./Business/Service/SubjectService";
import { StudentService } from "./Business/Service/StudentService";
import { QuestionService } from "./Business/Service/QuestionService";
import { IRegisterRepository } from "./Data/Interfaces/IRegisterRepository";
import { ISubjectRepository } from "./Data/Interfaces/ISubjectRepository";
import { IStudentRepository } from "./Data/Interfaces/IStudentRepository";
import { IClassRepository } from "./Data/Interfaces/IClassRepository";
import { IQuestionRepository } from "./Data/Interfaces/IQuestionRepository";
import { ClassRepository } from "./Data/Repository/ClassRepository";
import { RegisterRepository } from "./Data/Repository/RegisterRepository";
import { SubjectRepository } from "./Data/Repository/SubjectRepository";
import { StudentRepository } from "./Data/Repository/StudentRepository";
import { QuestionRepository } from "./Data/Repository/QuestionRepository";
import { IGradeRepository } from "./Data/Interfaces/IGradeRepository";
import { GradeRepository } from "./Data/Repository/GradeRepository";

import { AuthService } from "./Business/Service/AuthService";
import { LoginService } from "./Business/Service/LoginService";
import { LoginController } from "./Controller/LoginController";
import { AuthRepository } from "./Data/Repository/AuthRepository";
import { LoginRepository } from "./Data/Repository/LoginRepository";
import { Authenticator } from "./Middleware/Authenticator";
import { TestController } from "./Controller/TestController";
import { TestService } from "./Business/Service/TestService";
import { TestRepository } from "./Data/Repository/TestRepository";
import { GradeService } from "./Business/Service/GradeService";

// Nieuwe imports voor gerefactorde GradeRepository
import { UserRepository } from "./Data/Repository/UserRepository";
import { AnswerRepository } from "./Data/Repository/AnswerRepository";
import { LearningObjectiveRepository } from "./Data/Repository/LearningObjectiveRepository";
import { IUserRepository } from "./Data/Interfaces/IUserRepository";
import { IAnswerRepository } from "./Data/Interfaces/IAnswerRepository";
import { ILearningObjectiveRepository } from "./Data/Interfaces/ILearningObjective";
import { StatController } from "./Controller/StatController";
import { StatService } from "./Business/Service/StatService";
import { StatRepository } from "./Data/Repository/StatRepository";
import { AuthController } from "./Controller/AuthController";
import { HintRepository } from "./Data/Repository/HintRepository";

/**
 * @author Roan Slingerland
 */
class Container {
  private static instance: Container;

  // Middleware
  private authHandler: Authenticator;
  private authService: AuthService;
  private authRepository: AuthRepository;

  // Controller layers
  private classController: ClassController;
  private studentController: StudentController;
  private subjectController: SubjectController;
  private questionController: QuestionController;
  private loginController: LoginController;
  private testController: TestController;
  private registerController: RegisterController;
  private gradeController: GradeController;
  private statController: StatController;
  private authController: AuthController;

  // Service layers
  private classService: ClassService;
  private studentService: StudentService;
  private subjectService: SubjectService;
  private questionService: QuestionService;
  private loginService: LoginService;
  private registerService: RegisterService;
  private testService: TestService;
  private gradeService: GradeService;
  private statService: StatService;

  // Repository layers
  private hintRepository: HintRepository;
  private classRepository: IClassRepository;
  private studentRepository: IStudentRepository;
  private subjectRepository: ISubjectRepository;
  private questionRepository: QuestionRepository;
  private loginDatabase: LoginRepository;
  private testRepository: TestRepository;
  private registerRepository: RegisterRepository;
  private gradeRepository: IGradeRepository;

  // Nieuwe repository instanties voor GradeRepository
  private userRepository: IUserRepository;
  private answerRepository: AnswerRepository;
  private learningObjectiveRepository: LearningObjectiveRepository;
  private statRepository: StatRepository;

  private constructor() {
    // Initialize middleware
    this.authRepository = new AuthRepository();
    this.authService = new AuthService(this.authRepository);
    this.authHandler = new Authenticator(this.authService);

    // Initialize database layers
    this.hintRepository = new HintRepository();
    this.classRepository = new ClassRepository();
    this.studentRepository = new StudentRepository();
    this.subjectRepository = new SubjectRepository();
    this.answerRepository = new AnswerRepository();
    this.questionRepository = new QuestionRepository(this.answerRepository, this.hintRepository);
    this.loginDatabase = new LoginRepository();
    this.learningObjectiveRepository = new LearningObjectiveRepository();
    this.testRepository = new TestRepository(this.subjectRepository, this.questionRepository, this.learningObjectiveRepository);
    this.registerRepository = new RegisterRepository();

    // Initialize repositories needed for GradeRepository
    this.userRepository = new UserRepository();

    // Initialize GradeRepository with dependencies
    this.gradeRepository = new GradeRepository(
      this.userRepository,
      this.testRepository,
      this.answerRepository,
      this.learningObjectiveRepository
    );
    this.statRepository = new StatRepository();

    // Initialize service layers
    this.loginService = new LoginService(this.loginDatabase);
    this.classService = new ClassService(this.classRepository);
    this.studentService = new StudentService(this.studentRepository);
    this.subjectService = new SubjectService(this.subjectRepository, this.classRepository);
    this.questionService = new QuestionService(this.questionRepository);
    this.testService = new TestService(this.testRepository);
    this.registerService = new RegisterService(
      this.registerRepository,
      this.userRepository
    );
    this.gradeService = new GradeService(
      this.gradeRepository,
      this.userRepository,
      this.testRepository,
      this.answerRepository  // Voeg testRepository toe als derde parameter
    );
    this.statService = new StatService(this.statRepository);

    // Initialize controller layers
    this.classController = new ClassController(this.classService);
    this.studentController = new StudentController(this.studentService);
    this.subjectController = new SubjectController(this.subjectService);
    this.questionController = new QuestionController(this.questionService);
    this.loginController = new LoginController(this.loginService);
    this.testController = new TestController(this.testService);
    this.registerController = new RegisterController(this.registerService);
    this.gradeController = new GradeController(this.gradeService);
    this.statController = new StatController(this.statService);
    this.authController = new AuthController(this.authService);
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public getLoginController(): LoginController {
    return this.loginController;
  }

  public getClassController(): ClassController {
    return this.classController;
  }

  public getStudentController(): StudentController {
    return this.studentController;
  }

  public getSubjectController(): SubjectController {
    return this.subjectController;
  }

  public getQuestionController(): QuestionController {
    return this.questionController;
  }

  public getAuthenticator(): Authenticator {
    return this.authHandler;
  }

  public getTestController(): TestController {
    return this.testController;
  }
  public getRegisterController(): RegisterController {
    return this.registerController;
  }

  public getGradeController(): GradeController {
    return this.gradeController;
  }

  public getStatController(): StatController {
    return this.statController;
  }
  public getAuthController(): AuthController {
    return this.authController;
  }
}

export default Container;
