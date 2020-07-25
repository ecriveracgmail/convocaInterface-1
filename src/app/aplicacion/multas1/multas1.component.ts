import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { combineLatest } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { NbThemeService } from '@nebular/theme';
import { registerMap } from 'echarts';

@Component({
  selector: 'ngx-multas1',
  templateUrl: './multas1.component.html',
  styleUrls: ['./multas1.component.scss']
})
export class Multas1Component implements OnInit {
  @ViewChild(MatSort,{static: true}) sort: MatSort;
  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns:string[]=['Empresa','IA','Multa','Afectados'];
  actEconomicas:any[]=[];
  empresas:any[]=[]
  regiones:any[]=[]
  anios:any[]=[]

  //variables del mapa
  latlong: any = {};
  mapData: any[];
  max = -Infinity;
  min = Infinity;
  options: any;

  bubbleTheme: any;
  geoColors: any[];

  private alive = true;

  datos=[
    {Id:"00001", Nombre:"Minera Yanacocha", IA:250,Multa:4500,Afectados:251, IL:450, AL:200},
    {Id:"00002", Nombre:"Azgard Mineria", IA:150,Multa:450,Afectados:20, IL:40, AL:200},
    {Id:"00003", Nombre:"Asociación Minera SA",Multa:400,IA:50,Afectados:21, IL:50, AL:200},
    {Id:"00004", Nombre:"Belemont Minera", IA:30,Multa:5000,Afectados:400, IL:450, AL:200},
    {Id:"00005", Nombre:"Antamina", IA:250, IL:50,Multa:600,Afectados:31, AL:200},
    {Id:"00006", Nombre:"Minera Yanacocha", IA:20,Multa:400,Afectados:41, IL:450, AL:200},
    {Id:"00007", Nombre:"Minera Yanacocha", IA:20,Multa:300,Afectados:30, IL:450, AL:200},
    {Id:"00008", Nombre:"Minera Yanacocha", IA:50,Multa:800,Afectados:300,IL:450, AL:200},
    {Id:"00009", Nombre:"Minera Yanacocha", IA:250,Multa:700,Afectados:45 ,IL:450, AL:200},
    {Id:"000010", Nombre:"Minera Yanacocha", IA:250,Multa:7400,Afectados:500,IL:450, AL:200},
    {Id:"000010", Nombre:"Minera Yanacocha", IA:250,Multa:7400,Afectados:500,IL:450, AL:200},
    {Id:"000010", Nombre:"Minera Yanacocha", IA:250,Multa:7400,Afectados:500,IL:450, AL:200},
    {Id:"000010", Nombre:"Minera Yanacocha", IA:250,Multa:7400,Afectados:500,IL:450, AL:200},
    {Id:"000010", Nombre:"Minera Yanacocha", IA:250,Multa:7400,Afectados:500,IL:450, AL:200},
    {Id:"000010", Nombre:"Minera Yanacocha", IA:250,Multa:7400,Afectados:500,IL:450, AL:200},
    {Id:"000010", Nombre:"Minera Yanacocha", IA:250,Multa:7400,Afectados:500,IL:450, AL:200},
    {Id:"000010", Nombre:"Minera Yanacocha", IA:250,Multa:7400,Afectados:500,IL:450, AL:200},
    {Id:"000010", Nombre:"Minera Yanacocha", IA:250,Multa:7400,Afectados:500,IL:450, AL:200},
  ]

  constructor( private theme: NbThemeService,
               private http: HttpClient) {
                  
                combineLatest([
                  this.http.get('assets/map/peru1.json'),
                  this.theme.getJsTheme(),
                ])
                  .pipe(takeWhile(() => this.alive))
                  .subscribe(([map, config]: [any, any]) => {
            
                    registerMap('world', map);
                    const colors = config.variables;
                    this.bubbleTheme = config.variables.bubbleMap;
                    this.geoColors = [colors.primary, colors.info, colors.success, colors.warning, colors.danger];
                     this.latlong= {
                      'PE': { 'latitude': -10, 'longitude': -76 }
                     }
                    this.mapData=[
                      { 'code': 'PE', 'name': 'Peru', 'value': 29399817, 'color': this.getRandomGeoColor() }
                    ]
                    this.mapData.forEach((itemOpt) => {
                      if (itemOpt.value > this.max) {
                        this.max = itemOpt.value;
                      }
                      if (itemOpt.value < this.min) {
                        this.min = itemOpt.value;
                      }
                    });
            
                    this.options = {
                      title: {
                        text: '',
                        left: 'center',
                        top: '16px',
                        textStyle: {
                          color: this.bubbleTheme.titleColor,
                        },
                      },
                      tooltip: {
                        trigger: 'item',
                        formatter: params => {
                          return `${params.name}: ${params.value[2]}`;
                        },
                      },
                      visualMap: {
                        show: false,
                        min: 0,
                        max: this.max,
                        inRange: {
                          symbolSize: [6, 60],
                        },
                      },
                      geo: {
                        name: 'World Population (2010)',
                        type: 'map',
                        map: 'world',
                        roam: true,
                        label: {
                          emphasis: {
                            show: false,
                          },
                        },
                        itemStyle: {
                          normal: {
                            areaColor: this.bubbleTheme.areaColor,
                            borderColor: this.bubbleTheme.areaBorderColor,
                          },
                          emphasis: {
                            areaColor: this.bubbleTheme.areaHoverColor,
                          },
                        },
                        zoom: 1,
                      },
                      series: [
                        {
                          type: 'scatter',
                          coordinateSystem: 'geo',
                          data: this.mapData.map(itemOpt => {
                            return {
                              name: itemOpt.name,
                              value: [
                                this.latlong[itemOpt.code].longitude,
                                this.latlong[itemOpt.code].latitude,
                                itemOpt.value,
                              ],
                              itemStyle: {
                                normal: {
                                  color: itemOpt.color,
                                },
                              },
                            };
                          }),
                        },
                      ],
                    };
                  });

                 
                }

  ngOnInit() {
    this.getMultas();
  }

  getMultas(){
    this.dataSource= new MatTableDataSource(this.datos);
    this.dataSource.sort=this.sort;
    this.dataSource.paginator=this.paginator;
   }

   //colores de burbujas
   private getRandomGeoColor() {
     const index = Math.round(Math.random() * this.geoColors.length);
     return this.geoColors[index];
    }

}
