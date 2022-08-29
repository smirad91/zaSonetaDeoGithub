export interface Machine {
    id?: number;
    name: string;
    memory?: number;
    info?: string,
    application_id?: string
    processor_id?: number;
    insert_at?: number;
    insert_by?: number;
    change_at?: number;
    change_by?: number;
    status_id?: number;
  }