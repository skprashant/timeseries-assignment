import { Component, OnInit } from "@angular/core";
import { EChartOption } from "echarts";
import { GetDataService } from "./services/get-data.service";
import { HttpClient } from "@angular/common/http";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "timeseries-assignment";
  private limit = 5;
  private barChartLimit = 2;
  dataLoaded = false;
  pieChartLoaded = false;
  barChartOption: EChartOption;
  pieChartOption: EChartOption;
  chartOptions: EChartOption[] = [];

  constructor(
    private getDataService: GetDataService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.httpClient.get<any[]>("assets/final.json").subscribe(data => {
      this.getDataService.getData(data).subscribe(res => {
        this.renderBarChart(res[1], res[0]);
        this.dataLoaded = true;
      });
    });
  }

  onLimitChange(value) {
    this.limit = value;
  }

  onLimitChangeOfBar(value) {
    this.barChartLimit = value;
  }

  loadBarChart() {
    this.chartOptions = [];
    this.getDataService
      .getBarData(this.barChartLimit, "location")
      .subscribe(data => {
        data.forEach(element => {
          let option = this.getBarChartOption(
            element.xAxisData,
            element.yAxisData,
            element.attrValue
          );
          this.chartOptions.push(option);
        });
      });
  }

  loadPieChart() {
    this.getDataService.getPieData(this.limit).subscribe(data => {
      this.renderPieChart(data);
      this.pieChartLoaded = true;
    });
  }

  renderPieChart(gdata) {
    this.pieChartOption = {
      title: {
        text: "Pie Chart",
        subtext: "Attribute distribution",
        left: "center",
        top: 10
      },
      tooltip: {
        trigger: "item",
        formatter: function(params) {
          const tipInfo = params["data"];
          console.log(tipInfo.toolTipData);
          let list = tipInfo.toolTipData;
          let html = "<ul>";
          list.forEach(element => {
            const section = element.section.slice(0, 5) + ".....";
            html +=
              "<li> Document : " +
              element.document +
              " and in sections = " +
              section +
              "</li>";
          });

          html = html + "</ul>";
          return (
            `Attribute = ${tipInfo.name} <br/> : Total count = ${tipInfo.value}  <br/>
          ` + html
          );
        }
      },
      legend: {
        type: "scroll",
        orient: "vertical",
        right: 90,
        top: 50,
        bottom: 20,
        data: gdata.legendData
      },
      series: [
        {
          top: 50,
          name: "Attribute",
          type: "pie",
          radius: "75%",
          center: ["50%", "50%"],
          data: gdata.seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
  }

  renderBarChart(xAxisData, yAxisData) {
    this.barChartOption = {
      title: {
        text: "Bar Chart",
        subtext: "Time series graph ",
        left: "center"
      },
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
          top: 50,
          center: ["50%", "50%"],
          data: xAxisData,
          type: "bar",
          areaStyle: {}
        }
      ]
    };
  }

  getBarChartOption(xAxisData, yAxisData, value) {
    let chartOption: EChartOption = {
      title: {
        text: "Attribute = " + value,
        subtext: "Attribute value distribution",
        left: "center"
      },
      xAxis: {
        name: "Year of publition",
        nameLocation: "middle",
        nameGap: 25,
        nameTextStyle: { color: "black", fontWeight: "bold" },
        type: "category",
        data: yAxisData
      },
      yAxis: {
        name: "No of documents value present",
        type: "value",
        nameLocation: "middle",
        nameGap: 50,
        nameTextStyle: { color: "black", fontWeight: "bold" }
      },
      series: [
        {
          top: 50,
          center: ["50%", "50%"],
          data: xAxisData,
          type: "bar",
          areaStyle: {}
        }
      ]
    };
    return chartOption;
  }
}
