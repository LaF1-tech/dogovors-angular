export interface Application {
  id: number,
  educational_establishment_name: string,
  specialization_name: string,
  last_name: string,
  name: string,
  middle_name: string,
  phone_number: string,
  types: { [key: number]: string }
  application_status: string,
  execution_date: string,
  expiration_date: string,
}
