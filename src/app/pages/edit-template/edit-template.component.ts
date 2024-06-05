import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TemplatesService} from "../../services/templates.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {take} from "rxjs";
import {NgForOf} from "@angular/common";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-edit-template',
  standalone: true,
  imports: [MatLabel, MatFormField, MatInput, MatButton, RouterLink, ReactiveFormsModule, NgForOf, MatSelect, MatOption],
  templateUrl: './edit-template.component.html',
  styleUrl: './edit-template.component.scss'
})
export class EditTemplateComponent implements OnInit {

  foods: Food[] = [
    {value: 'string', viewValue: 'Строковый'},
    {value: 'integer', viewValue: 'Числовой'},
    {value: 'date', viewValue: 'Дата'},
    {value: 'time', viewValue: 'Время'},
    {value: 'datetime', viewValue: 'Дата и время'},
    {value: 'daterange', viewValue: 'Промежуток даты'},
    {value: 'boolean', viewValue: 'Логический'},
  ];
  public defval: string = "<html lang=\"ru\">\n" +
    "<head>\n" +
    "    <meta charset=\"UTF-8\">\n" +
    "    <style>\n" +
    "\n" +
    "    </style>\n" +
    "</head>\n" +
    "<body>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  templateForm!: FormGroup;
  templateId!: number;
  private fb = inject(FormBuilder)
  private templateService = inject(TemplatesService);
  private router = inject(Router)
  private route = inject(ActivatedRoute);

  get necessaryData(): FormArray {
    return this.templateForm.get('necessary_data') as FormArray;
  }

  ngOnInit(): void {
    this.templateId = Number(this.route.snapshot.paramMap.get('id'));
    this.templateForm = this.fb.group({
      template_name: ['', Validators.required],
      template_content: ['', Validators.required],
      necessary_data: this.fb.array([])
    });

    this.templateService.loadOne(this.templateId).pipe(take(1)).subscribe(template => {
      this.templateForm.patchValue({
        template_name: template.template_name,
        template_content: template.template_content,
      });

      Object.entries(template.necessary_data).forEach(([key, value]) => {
        this.necessaryData.push(this.fb.group({
          key: [key, Validators.required],
          value: [value, Validators.required]
        }));
      });
    });
  }

  addNecessaryData(): void {
    this.necessaryData.push(this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required]
    }));
  }

  insertTemplateVariable(variable: string): void {
    const textarea = document.querySelector('textarea[formControlName="template_content"]') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    textarea.value = text.substring(0, start) + variable + text.substring(end);
    textarea.dispatchEvent(new Event('input')); // Notify Angular of the change
  }

  removeNecessaryData(index: number): void {
    this.necessaryData.removeAt(index);
  }

  onSubmit(): void {
    const formData = this.templateForm.value;
    const necessaryData = formData.necessary_data.reduce((acc: { [key: string]: string }, item: NecessaryDataItem) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    const templateData = {
      template_name: formData.template_name,
      template_content: formData.template_content,
      necessary_data: necessaryData
    };

    this.templateService.editTemplate(templateData, this.templateId).pipe(take(1)).subscribe(() => {
      alert('Шаблон обновлен!')
      this.router.navigate(['/admin/templates'])
    });

  }
}

interface NecessaryDataItem {
  key: string;
  value: string;
}

interface Food {
  value: string;
  viewValue: string;
}
