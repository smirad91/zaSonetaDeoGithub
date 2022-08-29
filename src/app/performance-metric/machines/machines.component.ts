import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dateFromEpoch } from 'app/filter-results/shared-functions';
import { FullCurrentInfo } from 'app/models/fullCurrentInfoInBegining';
import { Machine } from 'app/models/machine';
import { ApplicationService } from 'app/services/applications/application.service';
import { MachinesService } from 'app/services/machines/machines.service';
import { initializeCurrentApp, reloadMachines, clickForRefresh } from 'app/shared-functions';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent implements OnInit {

  @ViewChild('modalContentEdit') modalContentEdit: TemplateRef<any>;
  @ViewChild('modalContentDelete') modalContentDelete: TemplateRef<any>;
  machines: Machine[];
  machinesObservable: Machine[]
  machinesBh = new BehaviorSubject<boolean>(true)

  newMachineName: string;
  newMachineDescription: string;


  constructor(
    private machinesService: MachinesService,
    private applicationService: ApplicationService,
    private modal: NgbModal,
  ) {

  }

  modalData: {
    machine: Machine;
    newName: string,
    newInfo: string
  };

  async ngOnInit() {
    console.log('oninit machines')
 //   await initializeCurrentApp(this.applicationService)
  const currentApp=await this.applicationService.getDefaultAE()
    this.machinesObservable = await this.machinesService.getMachinesObs(currentApp.enviroment_id).toPromise()
    this.newMachineDescription = ''
    this.newMachineName = ''
  }
  async ngOnDestroy() {
    FullCurrentInfo.temporaryApp = undefined
  }
  openModal(machine: Machine) {

    this.modalData = { machine: machine, newName: machine.name, newInfo: machine.info };
    this.modal.open(this.modalContentEdit, { size: 'lg' });
  }

  openModalDelete(machine: Machine) {
    console.log('otvorimodal')
    this.modalData = { machine: machine, newName: machine.name, newInfo: machine.info };
    this.modal.open(this.modalContentDelete, { size: 'lg' });
  }

  async addMachine() {
    let machine = {
      name: this.newMachineName,
      environment_id: FullCurrentInfo.currentApp.enviroment_id,
      gpu_id: 1,
      os_id: 1,
      memory: 1,
      processor_id: 1,
      info: this.newMachineDescription
    }
    this.newMachineDescription = ""
    this.newMachineName = ""
    console.log(machine)
    await this.machinesService.inputMachine(machine)
    this.afterMachinesListEdited()
  }

  async deleteMachine(id) {
    console.log(id)
    await this.machinesService.deleteMachine(id)
    this.afterMachinesListEdited()
  }

  async editMachine(machine) {
    const machineNew: Machine = {
      id: machine.id,
      name: this.modalData.newName,
      info: this.modalData.newInfo
    }
    await this.machinesService.editMachine(machineNew)
    this.afterMachinesListEdited()
  }

  async afterMachinesListEdited() {
    this.machines = await this.machinesService.getMachinesObs(FullCurrentInfo.getCurrentApp().enviroment_id).toPromise()
    clickForRefresh()
  }

  dateFromEpoch(broj): string {
    return dateFromEpoch(broj)
  }

}
