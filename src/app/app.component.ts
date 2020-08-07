import { Component, OnInit } from "@angular/core";
import { EChartOption } from "echarts";
import { GetDataService } from "./services/get-data.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "timeseries-assignment";
  dataLoaded = false;
  barChartOption: EChartOption;

  constructor(
    private getDataService: GetDataService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.httpClient.get("assets/final.txt", 
    {responseType: 'text'}).subscribe(data => {
      this.getDataService.getData(data).subscribe(res => {
        this.rendeLineChartOption(res);
      });
    });
  }

  onScroll(e) {
    console.log(e);
  }
  

  rendeLineChartOption(myData) {
    let dateList = myData.map(function (item) {
        return item[1];
    });
    let dayValueList = myData.map(function (item) {
        return item[2];
    });

    let nightValueList = myData.map(function (item) {
      return item[3];
    });

    this.barChartOption = {
      title: {
        text: 'Weather Report'
    },
    toolbox: {
      feature: {
          saveAsImage: {
          }
      }
    },
    tooltip: {
      trigger: "axis",
      position: function (pt) {
        return [pt[0], '10%'];
      },
      formatter: function(params) { 
        const date = new Date(2019, 0, params[0].dataIndex + 1 );
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        let res: any = date.toLocaleDateString('en-US', options);
        let arr: any = params;
        arr.forEach((data) => {
            res += '<br/>' + data.marker + data.seriesName + ': ' + data.value + " °C";
        });
        return res;
      }
    },
    legend: {
        data: ['Day Temp', 'Night Temp']
    },
    grid: {
        bottom: '20%',
        containLabel: true
    },
    dataZoom: [
      {
          show: true,
          realtime: true,
          start: 0,
          end: 100,
      }
    ],
    xAxis: [{
        boundaryGap: [0, 30],
        data: dateList,
        name: "Months",
        nameLocation: "middle",
        nameGap: 35,
        nameTextStyle: { color: "black", fontWeight: "bold" },
    }
    ],
    yAxis: {
      name: "Temperature in °C",
      type: "value",
      nameLocation: "middle",
      nameGap: 50,
      nameTextStyle: { color: "black", fontWeight: "bold" },
      axisLabel: {
        formatter: '{value} °C'
      }
    },
    series: [
        {   
            name: 'Day Temp',
            type: 'line',
            data: dayValueList
        },
        {
            name: 'Night Temp',
            type: 'line',
            data: nightValueList
        }
    ]
    };
  }
}
