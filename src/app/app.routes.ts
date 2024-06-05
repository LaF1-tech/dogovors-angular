import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("src/app/pages/login-page/login-page.component").then((m) => m.LoginPageComponent),
  },
  {
    path: "admin",
    loadComponent: () => import("src/app/pages/admin/admin.component").then((m) => m.AdminComponent),
    children: [
      {
        path: "create",
        loadComponent: () => import("src/app/pages/create-user/create-user.component").then((m) => m.CreateUserComponent)
      }, {
        path: "applications",
        loadComponent: () => import("src/app/pages/applications/applications.component").then((m) => m.ApplicationsComponent)
      }, {
        path: "specializations",
        loadComponent: () => import("src/app/pages/specializations/specializations.component").then((m) => m.SpecializationsComponent)
      }, {
        path: "educationalestablishments",
        loadComponent: () => import("src/app/pages/eduestablishments/eduestablishments.component").then((m) => m.EduestablishmentsComponent)
      }, {
        path: "templates",
        loadComponent: () => import("src/app/pages/templates/templates.component").then((m) => m.TemplatesComponent)
      }, {
        path: "contracts",
        loadComponent: () => import("src/app/pages/contracts/contracts.component").then((m) => m.ContractsComponent)
      }, {
        path: "charts",
        loadComponent: () => import("src/app/pages/charts/main/main.component").then((m) => m.MainComponent)
      }
    ],
  },
  {
    path: "apply",
    loadComponent: () => import("src/app/pages/main-page/main-page.component").then(c => c.MainPageComponent)
  },
  {
    path: "periodchart",
    loadComponent: () => import("src/app/pages/charts/periodChart/period-chart.component").then(c => c.PeriodChartComponent)
  },
  {
    path: "educhart",
    loadComponent: () => import("src/app/pages/charts/educationalestablishments-chart/educationalestablishments-chart.component").then(c => c.EducationalestablishmentsChartComponent)
  },
  {
    path: "specializationschart",
    loadComponent: () => import("src/app/pages/charts/specialization-chart/specialization-chart.component").then(c => c.SpecializationChartComponent)
  },
  {
    path: "templateschart",
    loadComponent: () => import("src/app/pages/charts/template-chart/template-chart.component").then(c => c.TemplateChartComponent)
  },
  {
    path: "create-template",
    loadComponent: () => import("src/app/pages/create-template/create-template.component").then(c => c.CreateTemplateComponent)
  },
  {
    path: "edit-template/:id",
    loadComponent: () => import("src/app/pages/edit-template/edit-template.component").then(c => c.EditTemplateComponent)
  },
  {
    path: "**",
    redirectTo: "apply"
  }
];
