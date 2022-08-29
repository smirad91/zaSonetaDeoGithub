export interface Action {
    id?: string;
    name?: string;
    application_id?: string,
    insert_at?: Date;
    insert_by?: number;
    change_at?: Date;
    change_by?: number;
    status_id?: number;
  }