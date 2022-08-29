import { Observable } from "rxjs"
import { Action } from "./action"
import { AppEnv } from "./appEnv"
import { Application } from "./application"
import { Environment } from "./environments"
import { Machine } from "./machine"
import { Version } from "./version"
import { Versioning } from "./versioning"

export class FullCurrentInfo{
    public static username: string
    public static pas:string;
    public static currentApp:AppEnv
    public static temporaryApp:AppEnv
    //  public static team:User[]
    public static machines:Machine[]
    public static actions:Action[]
    public static environments:Environment[]
    public static users$:Observable<any>

    public static allApplications:AppEnv[]
    public static applicationsOnce:AppEnv[]
    public static applicationsDict:Object
    public static versioning:any[]
    public static versions$:Observable<any>

    public static usagePlans:any

    public static getCurrentApp(){
        if(FullCurrentInfo.temporaryApp!=undefined){
            return FullCurrentInfo.temporaryApp
        }else{
            console.log(FullCurrentInfo.temporaryApp)
            return FullCurrentInfo.currentApp
        }
    }

    public static clearAllInfo(){
        FullCurrentInfo.currentApp=null
        FullCurrentInfo.machines=null
        FullCurrentInfo.actions=null
        FullCurrentInfo.allApplications=null
    }

}