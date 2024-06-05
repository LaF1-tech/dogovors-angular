export interface Template {
  template_id: number,
  template_name: string,
  template_content: string,
  necessary_data: { [key: string]: string }
}
