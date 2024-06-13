import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxMaskDirective} from "ngx-mask";
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate
} from '@angular/material/datepicker';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {TemplatesService} from "../../services/templates.service";
import {ControlDescriptor, FormConfigControl, FormConfigControls, SubmitEvent} from "@likdan/form-builder-core";
import {concatMap, from, map, Observable, take, toArray, zip} from "rxjs";
import {Template} from "../../models/templates";
import {FormConfigDialogComponent} from "../../dialog/form-config-dialog/form-config-dialog.component";
import {Controls} from "@likdan/form-builder-material";
import {MatDialog} from "@angular/material/dialog";
import {ApplicationsService} from "../../services/applications.service";
import {MatOption, MatSelect} from "@angular/material/select";
import {EducationEstablishmentsService} from "../../services/education-establishments.service";
import {SpecializationsService} from "../../services/specializations.service";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, MatDatepickerModule, MatFormFieldModule, MatDatepickerToggle, MatDateRangePicker, MatLabel, MatStartDate, MatEndDate, MatSelect, MatOption, MatInput, MatButton],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})

export class MainPageComponent implements OnInit {
  types: RawItem[] = []
  educationalEstablishments: RawItem[] = []
  specializations: RawItem[] = []

  range = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
  });
  mainForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    last_name: new FormControl<string>('', [Validators.required]),
    middle_name: new FormControl<string>('', [Validators.required]),
    educational_establishment_id: new FormControl<number>(0, [Validators.required]),
    specialization_id: new FormControl<number>(0, [Validators.required]),
    types: new FormControl<any>([], [Validators.required]),
    dateRange: this.range,
    phone_number: new FormControl<string>('', [Validators.required]),
  });
  private applicationsService = inject(ApplicationsService);
  private educationalEstablishmentsService = inject(EducationEstablishmentsService)
  private specializationsService = inject(SpecializationsService)
  private templatesService = inject(TemplatesService)
  private dialog = inject(MatDialog)

  ngOnInit() {
    this.templatesService.getTemplatesForSelect().pipe(take(1)).subscribe(data => {
      this.types = data
    });

    this.specializationsService.getSpecializationForSelect().pipe(take(1)).subscribe(data => {
      this.specializations = data
    })

    this.educationalEstablishmentsService.getEducationalEstablishmentForSelect().pipe(take(1)).subscribe(data => {
      this.educationalEstablishments = data
    })
  }

  addCountryCode(phoneNumber: string): string {
    const countryCode = "+375";

    if (!phoneNumber.startsWith(countryCode)) {
      return countryCode + phoneNumber;
    }

    return phoneNumber;
  }

  onSubmit() {
    if (this.mainForm.valid) {
      this.mainForm.value.phone_number = this.addCountryCode(this.mainForm.value.phone_number!)
      const event: SubmitEvent<any> = {
        value: this.mainForm.value, valid: this.mainForm.valid, errors: this.mainForm.errors,
      };
      this.loadTemplatesAdditionalData(event).subscribe(result => {
        this.applicationsService.create(result).pipe(take(1)).subscribe(() => {
          alert('Заявка оставлена.')
          window.location.reload();
        })
      });
    } else {
      console.error(this.mainForm.errors);
    }

  }

  private loadTemplatesAdditionalData(event: SubmitEvent<any>): Observable<any> {
    const types$: Observable<Template[]> = zip(event.value.types.map((i: number) => this.loadTemplateAdditionalDataById(i)))
    return types$
      .pipe(map(tt => tt.filter(t => !!t.necessary_data)))
      .pipe(map(tt => tt.map(this.generateFormConfigForTemplate.bind(this))))
      .pipe(concatMap(tt => from(tt)))
      .pipe(concatMap(cc => this.openFormConfigDialog(cc)))
      .pipe(toArray())
      .pipe(map(v => {
        const types = event.value.types.reduce((acc: { [key: number]: any }, typeId: number) => {
          const foundType = v.find(i => i.template_id === typeId);
          acc[typeId] = foundType ? foundType.value : {};
          return acc;
        }, {});
        return <any>{...event.value, types};
      }))
  }

  private openFormConfigDialog(controls: [number, FormConfigControls]): Observable<any> {
    return this.dialog.open(FormConfigDialogComponent, {
      data: {
        template_id: controls[0], controls: controls[1],
      }, disableClose: true,
    }).afterClosed()
  }

  private loadTemplateAdditionalDataById(templateId: number): Observable<Template> {
    return this.templatesService.loadOne(templateId)
  }

  private generateFormConfigForTemplate(template: Template): [number, FormConfigControls] {
    return [template.template_id, Object.fromEntries(Object.entries(template.necessary_data).map(([key, type]) => {
      return [key, <FormConfigControl>{
        type: this.getControlDescriptorByName(type), label: key, validators: [Validators.required]
      }]
    }))]
  }

  private getControlDescriptorByName(name: string): ControlDescriptor {
    switch (name) {
      case "integer":
        return Controls.numberInput
      case "string":
        return Controls.textInput
      case "boolean":
        return Controls.checkbox
      case "dateRange":
        return Controls.dateRange
      case "date":
        return Controls.date
      case "datetime":
        return Controls.datetime
      case "time":
        return Controls.time
      default:
        return Controls.textInput
    }
  }
}

interface RawItem {
  value: number;
  display: string;
}
