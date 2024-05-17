import {NestedTreeControl} from '@angular/cdk/tree';
import {Component} from '@angular/core';
import {MatTreeNestedDataSource, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink, RouterOutlet} from "@angular/router";

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
    url:'/admin/contracts'
  },
  {
    name: 'Учреждения образования',
    url:'/admin/educationalestablishments'
  },
  {
    name: 'Специальности',
    url:'/admin/specializations'
  },
  {
    name: 'Шаблоны',
    url:'/admin/templates'
  },
  {
    name: 'Создать пользователя',
    url:'/admin/create'
  },
];

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
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
export class AdminComponent {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}
