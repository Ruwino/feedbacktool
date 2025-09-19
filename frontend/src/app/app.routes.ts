import { Routes } from '@angular/router';
import { AddClassComponent } from "./class/pages/add-class/add-class.component";
import {LoginComponent} from "./Login/pages/login-page/login.component";
import {StudentOverviewComponent} from "./students/pages/student-overview/student-overview.component";
import {GradeOverviewComponent} from "./grades/pages/grade-overview/grade-overview.component";
import {TestOverviewComponent} from "./TestOverview/pages/test-overview/test-overview.component";
import { QuestionPageComponent } from './Questions/pages/question-page/question-page.component';
import { TestCreationComponent } from './tests/pages/test-creation/test-creation.component';
import { RegisterComponent } from './register/pages/register.component';
import {DashboardComponent} from "./dashboard/pages/dashboard/dashboard.component";
import {AuthGuard} from "./Guards/auth.guard";
import { TestViewComponent } from './tests/pages/test-view/test-view.component';
import { RequestErrorComponent } from './request-error/request-error.component';
import { TestEditComponent } from './tests/pages/test-edit/test-edit.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Student', 'Teacher']}
  },
  {
    path: 'class/add',
    component: AddClassComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Teacher']}
  },
  {
    path: "students/overview",
    component: StudentOverviewComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Teacher']}
  },
  {
    path: 'grade/overview',
    component: GradeOverviewComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Teacher']}
  },

  {
    path: 'grade/overview/:studentId',
    component: GradeOverviewComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Teacher']}
  },

  {
    path: 'grades',
    component: GradeOverviewComponent,
    canActivate: [AuthGuard],
    data: { 
      roles: ['Student'],
      viewMode: 'student' 
    }
  },
  
  {
    path: "test/overview",
    component: TestOverviewComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Student']}
  },
  {
    path: "test/take/:testId",
    component: QuestionPageComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Student']}
  },
  {
    path: 'test/create',
    component: TestCreationComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Teacher']}
  },
  {
    path: "test/:testId",
    component: TestViewComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Teacher']}
  },
  {
    path: "test/edit/:testId",
    component: TestEditComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Teacher']}
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'request-error/:statusCode',
    component: RequestErrorComponent
  }
];
