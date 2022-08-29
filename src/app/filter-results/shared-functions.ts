import { Actions } from "app/models/executions/actions"
import { Execution } from "app/models/executions/execution"
import { ResultData } from "app/models/result-data"
import { Injectable } from '@angular/core';
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

let izvanSvega:any;
let putanjaDoExekucije:string;
let biggerStyle={
  color: undefined,
  fontSize: '18px',
  fontFamily: 'Vedrana, Arial, sans-serif',
  fontWeight: 400,
  cssClass: 'apexcharts-xaxis-title',
}

let smallerStyle={
  color: undefined,
  fontSize: '14px',
  fontFamily: 'Vedrana, Arial, sans-serif',
  fontWeight: 400,
  cssClass: 'apexcharts-xaxis-title',
}


@Injectable()
export class SharedFunctions {

  
    appendToResultFromShared(executions:Execution[], actionIds:Array<string>, sortByVersion:boolean, multipleActions:boolean){
      let finalResultBre = new Map<number, Map<number, Map<number, Array<ResultData>>>>()
      let versionIndexes = new Map<any, number>();
      let versionIndexesReverse = new Map<number, any>();
      let seriesOption  
      executions.forEach(function(execution){
            let actions = getActionsFromExecution(actionIds, execution)
            actions.forEach(function(action){
              if(multipleActions){
                seriesOption = action.id
              }else{
                seriesOption = execution.amv_id
              }
              if(action.start_time!=null && action.end_time!=null){
                appendToResult2(execution.id, dateFromEpoch(execution.start_time), execution.softwareVersion, seriesOption, action.duration, action.additional_info, finalResultBre, sortByVersion, versionIndexes, versionIndexesReverse)
              }
            })
      
        })
        return [finalResultBre, versionIndexes, versionIndexesReverse]
      }
    

      getChartData(seriess, res, versionIndexes, versionIndexesReverse,indexesReverse, sortByVersion, multipleActions:boolean, themeColors):any{

        let ukupanBroj =0
        seriess.forEach(element => {
          ukupanBroj += element.data.length
        });

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
          "July", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        let xasysTitle="Date"
        if(sortByVersion){
          xasysTitle = "Version"
        }
        let yasysTitle="Seconds"
        let dataElement = {
          chart: {
            height: 500,
            type: 'scatter',
            zoom: {
              enabled: true,
              type: 'xy'
            },
          },
          colors: themeColors,
          series: seriess,
          legend: {
            showForSingleSeries: true,
            fontSize:smallerStyle.fontSize,
            fontFamily:smallerStyle.fontFamily,
            fontWeight:smallerStyle.fontWeight,
          },
          markers: {
            onClick: function(e) {
              if(document.querySelector('#selectedExecution')==undefined){
                let node = document.createElement("a")
                node.setAttribute('id', 'selectedExecution')
                node.setAttribute("href", putanjaDoExekucije)
                node.setAttribute("routerLinkActive", "active")
                node.setAttribute("ng-reflect-router-link-active", "active")
                node.setAttribute("ng-reflect-router-link", "/filter-results/action-statistic")
                const pText = document.createElement('p')
                pText.setAttribute('style', 'text-align: center;')
                pText.textContent = 'Open selected execution'
                node.appendChild(pText)
                const parentGuest = document.querySelector('#inputFields')
                parentGuest.parentNode.insertBefore(node, parentGuest.nextSibling);
              }else{
                document.querySelector('#selectedExecution').setAttribute("href", putanjaDoExekucije)
              }
              e.stopPropagation();
              showTooltip()
              let canvas = document.querySelector("#chartField")
              canvas.addEventListener('click', function(){hideTooltip()})
              }
          },
          xaxis: {
            labels: {
              formatter: function(value, timestamp, opts) {
                if(sortByVersion){
                  return versionIndexesReverse.get(parseInt(value))
                }else{
                  if(ukupanBroj >6){
                    const razmak = Math.round((ukupanBroj-2)/4)
                    if(value==1 || value==ukupanBroj || (value-1)%razmak==0){
                      let n = Math.round(parseFloat(value))
                      let date= new Date(versionIndexesReverse.get(n))
                      return monthNames[date.getMonth()]+" \'"+ date.getFullYear().toString().slice(-2)
                    }else{
                      return ''
                    }
                  }else{
                    let n = Math.round(parseFloat(value))
                    let date= new Date(versionIndexesReverse.get(n))
                    return monthNames[date.getMonth()]+" \'"+ date.getFullYear().toString().slice(-2) 
                  }
                }
    
              }, 
              style:smallerStyle,
              rotate: 0,
              hideOverlappingLabels: true
            },
            tickAmount:versionIndexes.size-1,
            type:"numeric",
            tooltip: {
              formatter: function(val, opts):string {
                const opt = <any> opts;
                let ai = indexesReverse.get(opt.w.config.series[opt.seriesIndex].name)
                let dur = opt.w.globals.series[opt.seriesIndex][opt.dataPointIndex]
                let finalTooltip = res.get(ai).get(parseInt(val)).get(dur)[0]
                let dateOfExecution = new Date(finalTooltip.date)
                let addInfo=""
                if(finalTooltip.addInfo!=null && finalTooltip.addInfo!=""){
                  addInfo = "</br>" + finalTooltip.addInfo
                }
                izvanSvega = finalTooltip.duration +addInfo//+'</br><a target="_blank" routerLinkActive="active" ng-reflect-router-link-active="active" ng-reflect-router-link="/filter-results/action-statistic"  href="/filter-results/action-statistic/'+finalTooltip.execution+'">open execution</a>'
                putanjaDoExekucije = "/filter-results/action-statistic/"+finalTooltip.execution
                if(sortByVersion){                           
                  return versionIndexesReverse.get(parseInt(val))
                }else{
                  let date= new Date(versionIndexesReverse.get(parseInt(val)))
                  return monthNames[date.getMonth()]+" "+date.getDate().toString()+", "+date.getFullYear().toString()
                }
              },
              style: smallerStyle
            },

          },
          yaxis: {
            // tickAmount: 7,
            labels:{
              formatter: (value) => { return Math.round(value) },
            },
            title: {
              text: yasysTitle,
              style: smallerStyle
            }
          },
          tooltip: {
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
              return (
                '<div class="arrow_box">' +
                "<span>" + izvanSvega+
                "</span>" +
                "</div>"
              );
            }
          }
        }
        return dataElement
      }



     

}

function showTooltip(){
  if(document.getElementById("tooltipOpacity")==undefined){
    let node = document.createElement("style")
    node.setAttribute("id", "tooltipOpacity")
    const newContent = document.createTextNode(".apexcharts-tooltip {opacity: 1 !important;pointer-events:auto;}");
    node.appendChild(newContent);

    let parentNode = document.getElementsByClassName("card-body")[1]
    parentNode.insertBefore(node, parentNode.childNodes[0])
  }
}

function hideTooltip(){
  if(document.getElementById("tooltipOpacity")!=undefined){
    document.getElementById("tooltipOpacity").remove()
  }
}

export function dateFromEpoch(epochTime){
  var d = new Date(0);
  d.setUTCMilliseconds(epochTime);
  return d.toString();
}

export function epochFromDate(date){
  let dateFrom = new Date(date).getTime()
  return dateFrom;
}

export function clickToShowInfoAngularProblem(){
  setTimeout("document.getElementById('inputFields').click()",1000)
}

export function getExecutionTimestampAsString(da:Date){
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
  "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  let d = new Date(da)
  let strDate = monthNames[d.getMonth()]+" "+d.getDate().toString()+", "+d.getFullYear().toString()
  strDate += " - "+d.getHours().toString() + ":"+d.getMinutes().toString()
  return strDate + " (30 sec)"
}

export function getExecutionDescriptionAsString(da:Execution){
  return "No app name - No machine name - No version"
}


export function changeVisibilityId(id:string,rotate:boolean,setVisible:boolean) {
  var x = document.getElementById(id);
  if(rotate){
    x.hidden = !x.hidden
  }else{
    if(setVisible){
      x.hidden=false
    }else{
      x.hidden=true
    }
  }
}

export function changeVisibilityName(element:any,rotate:boolean,setVisible:boolean) {
  var x = element
  if(rotate){
    x.hidden = !x.hidden
  }else{
    if(setVisible){
      x.hidden = false
    }else{
      x.hidden = true
    }
  }
  
}


function getActionsFromExecution(actionIds:string[], execution:Execution):Actions[]{
    let actions=[]
    execution.actions.forEach(function(action){
      if(actionIds.includes(action.id)){
          actions.push(action)
      }
    })
    return actions
  }

//finalResultBre: actionId/machineId => index => duration => [[date:number, version:string, addInfo:string]]
function appendToResult2(executionId, startTime:any, softwareVersion:string, seriesValue:any, value:number, additionalInfo:string, finalResultBre:Map<number, Map<number, Map<number, Array<ResultData>>>>, sortByVersion:boolean, versionIndexes:Map<any, number>, versionIndexesReverse:Map<any, number>){
  value = value/1000
  let valueToPut;
    if(sortByVersion){
      valueToPut=softwareVersion
    }else{
      valueToPut=startTime
    }
    let data = {execution:executionId, duration:value, addInfo:additionalInfo}
    let index=getIndex(valueToPut, versionIndexes)
    if(index==undefined){
      index = setIndex(versionIndexes, versionIndexesReverse, valueToPut)
    }
    if(finalResultBre.get(seriesValue)!=undefined){
      if(finalResultBre.get(seriesValue).get(index)!=undefined){
          if(finalResultBre.get(seriesValue).get(index).get(value)!=undefined){
            let f = finalResultBre.get(seriesValue).get(index).get(value)
            f.push(data)
            finalResultBre.get(seriesValue).get(index).set(value, f)
          }else{
            finalResultBre.get(seriesValue).get(index).set(value, [data])
          }
      }else{
        finalResultBre.get(seriesValue).set(index, new Map([[value, [data]]]))
      }
    }else{
      finalResultBre.set(seriesValue, new Map([[index, new Map([[value, [data]]])]]))
    }
  }


//versionIndexes:               version/date:any => index:number
//versionIndexesReverse:        index:number => date/version:any

//index is 1...n
function getIndex(value:any, versionIndexes:Map<any, number>):number{
      return versionIndexes.get(value)
  }

function setIndex(versionIndexes:Map<any, number>, versionIndexesReverse:Map<number, any>, value:any):number{
    if(versionIndexes.get(value)==undefined){
    let index = versionIndexes.size+1
    versionIndexes.set(value, index)
    versionIndexesReverse.set(index, value)
    return index
    }

}


