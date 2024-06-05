import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, inject, OnInit} from '@angular/core';
import {MatTreeModule, MatTreeNestedDataSource} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {UserService} from "../../services/user.service";
import {filter, Observable, switchMap, take} from "rxjs";
import {FormConfigDialogComponent} from "../../dialog/form-config-dialog/form-config-dialog.component";
import {FormConfigControls} from "@likdan/form-builder-core";
import {Controls} from "@likdan/form-builder-material";
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../models/user";
import {Validators} from "@angular/forms";

interface FoodNode {
  name: string;
  url?: string;
  action?: (value?: any) => void;
  children?: FoodNode[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatTreeModule, MatButtonModule, MatIconModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  public User: any
  TREE_DATA: FoodNode[] = [
    {
      name: 'Заявки',
      url: '/admin/applications',
    },
    {
      name: 'Договора',
      url: '/admin/contracts'
    },
    {
      name: 'Учреждения образования',
      url: '/admin/educationalestablishments'
    },
    {
      name: 'Специальности',
      url: '/admin/specializations'
    },
    {
      name: 'Шаблоны',
      url: '/admin/templates'
    },
    {
      name: 'Создать пользователя',
      url: '/admin/create'
    },
    {
      name: 'Отчеты',
      url: '/admin/charts'
    },
    {
      name: 'Сменить пароль',
      action: () => {
        this.open(this.User)
      },
    }
  ];
  private userService = inject(UserService)
  private dialog = inject(MatDialog)
  private router = inject(Router)

  constructor() {
    this.dataSource.data = this.TREE_DATA;
  }

  getUser() {
    return this.userService.getUser().pipe(take(1)).subscribe((user: User) => {
      this.User = user
    })
  }

  checkUser() {
    if (!this.User) {
      this.router.navigate(['login'])
    }
  }

  ngOnInit() {
    this.getUser().add(() => this.checkUser())
  }

  open(value: any) {
    this.openDialog(value)
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.userService.editUserPassword(v.value.password, value.UserID)))
      .pipe(take(1))
      .subscribe(() => alert('Пароль изменен'))
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  private openDialog(value?: any): Observable<any> {
    return this.dialog.open(FormConfigDialogComponent, {
      data: {
        controls: <FormConfigControls>{
          password: {
            type: Controls.textInput,
            additionalFields: {
              type: "password"
            },
            label: "Пароль",
            validators: [Validators.required, Validators.minLength(4)]
          },
        },
      },
      disableClose: true,
    }).afterClosed()
  }
}
