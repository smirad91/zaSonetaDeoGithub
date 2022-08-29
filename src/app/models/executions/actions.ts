import {Comment} from '../comment'
export interface Actions {
    isCollapsed: boolean;
    id: string;
    action_id:string;
    execution_id: string;
    start_time: number;
    end_time: number;
    duration: number;
    additional_info: string;
    status_id:number;
    unique_identifier: string;
    comments : Comment[];
  }