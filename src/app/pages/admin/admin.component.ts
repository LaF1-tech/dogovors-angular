import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, inject} from '@angular/core';
import {MatTreeNestedDataSource, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink, RouterOutlet} from "@angular/router";
import {UserService} from "../../services/user.service";
import {filter, map, Observable, switchMap, take} from "rxjs";
import {FormConfigDialogComponent} from "../../dialog/form-config-dialog/form-config-dialog.component";
import {FormConfigControls} from "@likdan/form-builder-core";
import {Controls} from "@likdan/form-builder-material";
import {MatDialog} from "@angular/material/dialog";

interface FoodNode {
  name: string;
  url?: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
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
    name: 'Сменить пароль',
    url: '/chart'
  },
];

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
export class AdminComponent {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  private userService = inject(UserService)
  private dialog = inject(MatDialog)

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

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
          },
        },
      },
      disableClose: true,
    }).afterClosed()
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}
