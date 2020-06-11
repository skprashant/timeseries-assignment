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

  chartOption: EChartOption;

  constructor(
    private getDataService: GetDataService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.httpClient.get<any[]>("assets/final.json").subscribe(data => {
      this.getDataService.getData(data).subscribe(res => {
        console.log(res);
        this.renderChart(res[1], res[0]);
      });
    });
  }

  renderChart(xAxisData, yAxisData) {
    this.chartOption = {
      xAxis: {
        name: "Year of publition",
        nameLocation: "middle",
        nameGap: 25,
        nameTextStyle: { color: "black", fontWeight: "bold" },
        type: "category",
        data: yAxisData
      },
      yAxis: {
        name: "No of published pages",
        type: "value",
        nameLocation: "middle",
        nameGap: 50,
        nameTextStyle: { color: "black", fontWeight: "bold" }
      },
      series: [
        {
          data: xAxisData,
          type: "bar",
          areaStyle: {}
        }
      ]
    };
  }
}
