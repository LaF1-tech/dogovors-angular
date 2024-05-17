import {Component, inject} from '@angular/core';
import {FooterComponent} from "../../components/footer/footer.component";
import {
  ControlDescriptor,
  ControlType,
  FormBuilderComponent,
  FormConfig, FormConfigControl, FormConfigControls,
  sendHttpRequestAndSubscribe, SubmitEvent
} from "@likdan/form-builder-core";
import {HeaderComponent} from "../../components/header/header.component";
import {Buttons, Controls} from "@likdan/form-builder-material";
import {Validators} from "@angular/forms";
import {EducationEstablishmentsService} from "../../services/education-establishments.service";
import {SpecializationsService} from "../../services/specializations.service";
import {TemplatesService} from "../../services/templates.service";
import {concatMap, from, map, mergeMap, Observable, of, tap, toArray, zip} from "rxjs";
import {Template} from "../../models/templates";
import {MatDialog} from "@angular/material/dialog";
import {FormConfigDialogComponent} from "../../dialog/form-config-dialog/form-config-dialog.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    FooterComponent,
    FormBuilderComponent,
    HeaderComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  private educationalEstablishmentsService = inject(EducationEstablishmentsService)
  private specializationsService = inject(SpecializationsService)
  private templatesService = inject(TemplatesService)
  private dialog = inject(MatDialog)

  form = <FormConfig<any>>{
    controls: {
      educational_establishment_id: {
        label: "Учреждение образования",
        type: Controls.select,
        additionalFields: {
          items: this.educationalEstablishmentsService.getEducationalEstablishmentForSelect()
        },
        validators: [Validators.required],
      },
      specialization_id: {
        label: "Специальность",
        type: Controls.select,
        additionalFields: {
          items: this.specializationsService.getSpecializationForSelect()
        },
        validators: [Validators.required],
      },
      last_name: {
        label: "Фамилия",
        type: Controls.textInput,
        validators: [Validators.required],
      },
      name: {
        label: "Имя",
        type: Controls.textInput,
        validators: [Validators.required],
      },
      middle_name: {
        label: "Отчество",
        type: Controls.textInput,
        validators: [Validators.required],
      },
      phone_number: {
        label: "Номер телефона",
        type: Controls.textInput,
        validators: [Validators.required],
      },
      dateRange: {
        label: "Дата действия",
        type: Controls.dateRange,
        validators: [Validators.required],
      },
      types: {
        label: "Тип заявки",
        type: Controls.select,
        additionalFields: {
          multiple: true,
          items: this.templatesService.getTemplatesForSelect()
        },
        validators: [Validators.required],
      }
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: "Подтвердить",
      onSubmit: sendHttpRequestAndSubscribe({
        url: "/api/v1/applications/create",
        method: "POST",
        sendOnInvalidValidation: false,
      }, this.loadTemplatesAdditionalData.bind(this))
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
      .pipe(map(v => <any>{...event.value, types: Object.fromEntries(v.map(i => [i.template_id, i.value]))}))
      .pipe(tap(console.log))
  }

  private openFormConfigDialog(controls: [number, FormConfigControls]): Observable<any> {
    return this.dialog.open(FormConfigDialogComponent, {
      data: {
        template_id: controls[0],
        controls: controls[1],
      },
      disableClose: true,
    }).afterClosed()
  }

  private loadTemplateAdditionalDataById(templateId: number): Observable<Template> {
    return this.templatesService.loadOne(templateId)
  }

  private generateFormConfigForTemplate(template: Template): [number, FormConfigControls] {
    return [template.template_id, Object.fromEntries(Object.entries(template.necessary_data).map(([key, type]) => {
      return [key, <FormConfigControl>{
        type: this.getControlDescriptorByName(type),
        label: key,
        validators: [Validators.required]
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
