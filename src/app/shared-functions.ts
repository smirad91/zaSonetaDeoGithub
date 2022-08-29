import { BehaviorSubject } from "rxjs"
import { switchMap } from "rxjs/operators"
import { FullCurrentInfo } from "./models/fullCurrentInfoInBegining"
import { ApplicationService } from "./services/applications/application.service"

const machineBh= new BehaviorSubject<boolean>(true)
const actionBh = new BehaviorSubject<boolean>(true)
const applicationBh = new BehaviorSubject<boolean>(true)
const envBh = new BehaviorSubject<boolean>(true)
const versionBh = new BehaviorSubject<boolean>(true)
const usersBh = new BehaviorSubject<boolean>(true)


export async function initializeCurrentApp(applicationService:ApplicationService) {
   // FullCurrentInfo.currentApp = await applicationService.getApplication("UQ2QpV0PU1fn1lW0Jxq_QA").toPromise()
    if(FullCurrentInfo.currentApp==null){
        console.log("----------------------------")
        FullCurrentInfo.currentApp = await applicationService.getDefaultAE()
    }
}

export async function initializeApps(applicationService:ApplicationService){
    FullCurrentInfo.allApplications = await applicationService.getAE().toPromise()
}

export async function initializeInfo(value:{actionsService:any, machinesService:any, versionService:any, applicationService:any, environmentService:any, usersService:any}){
   // const amw = await this.versionService.getEMV(FullCurrentInfo.currentApp.enviroment_id).toPromise()
    FullCurrentInfo.usagePlans = await value.environmentService.getUsagePlans()
    FullCurrentInfo.machines = await value.machinesService.getMachinesObs(FullCurrentInfo.getCurrentApp().enviroment_id).toPromise()
    
    
    FullCurrentInfo.actions = await value.actionsService.getActionsObs(FullCurrentInfo.getCurrentApp().enviroment_id).toPromise()
    FullCurrentInfo.environments = await value.environmentService.getEnvs(FullCurrentInfo.getCurrentApp().application_id).toPromise()
    FullCurrentInfo.versions$ = versionBh.pipe(switchMap(_=>value.versionService.getEMV(FullCurrentInfo.getCurrentApp().enviroment_id))) 
    FullCurrentInfo.users$ = usersBh.pipe(switchMap(_=>value.usersService.getUsers(FullCurrentInfo.getCurrentApp().team_id))) 

    return FullCurrentInfo
  }

export function reloadApplications(){
   applicationBh.next(true)
}

export function reloadMachines(){
   machineBh.next(true)
}

export function reloadActions(){
   actionBh.next(true)
}

export function reloadVersions(){
   versionBh.next(true)
}

export function reloadEnvs(){
    envBh.next(true)
}

export function reloadUsers(){
    usersBh.next(true)
}

export function clickForRefresh(){
    let element: HTMLElement= document.querySelector('#clickHere') as HTMLElement;
    element.click()
}

export function getFormatedData(date){
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
          "July", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
    return monthNames[date.getMonth()]+" \'"+ date.getFullYear().toString().slice(-2)
}

async function getVersionsFullMechanism(versioningService, versioning){
    // let pomVersioning = [];
    // (await versioning).forEach(async function(item){
    //       pomVersioning.push(item.versionId)
    //   }
    // )
    // console.log('pomversioning'+pomVersioning)
    let pomVersions = []
    // await Promise.all(pomVersioning.map(async (i) => {
    //     console.log('i'+i)
    //     let ex = await versionsService.
    //     console.log('ex'+ex)
    //     pomVersions.push(ex[0])
      
    // }));
    pomVersions = await versioningService.getVersionsByAppId().toPromise()
    return pomVersions

}

