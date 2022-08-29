import { Actions } from "./actions"

export interface Execution {
    id: string;
    amv_id: string;
    user_id: string;
    start_time: Date;
    publish_time: Date;
    duration: number;
    actions? : Actions[];
    softwareVersion?:string;
  }