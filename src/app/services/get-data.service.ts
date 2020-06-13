import { Injectable, OnInit } from "@angular/core";
import { WikiData } from "../model/data";
import { Observable, BehaviorSubject, EMPTY } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class GetDataService {
  private _wikiData = new BehaviorSubject<any>({});
  private _pieData = new BehaviorSubject<any>([]);
  private _barData = new BehaviorSubject<any>([]);
  dataList: WikiData[] = [];

  constructor() {}

  getData(data): Observable<any> {
    this.dataList = data;
    const v = this.getAxisData();
    this._wikiData.next(v);
    return this._wikiData;
  }

  getAxisData() {
    this.dataList.sort((a, b) => {
      const date1 = new Date(a.time_published);
      const date2 = new Date(b.time_published);
      return date1.getFullYear() - date2.getFullYear();
    });

    const xAxisData: number[] = [];
    const YAxisData: number[] = [];
    let map = new Map<number, number>();

    this.dataList.forEach(wikiData => {
      const date = new Date(wikiData.time_published);
      const year = date.getFullYear();
      if (map.has(year)) {
        map.set(year, map.get(year) + 1);
      } else {
        map.set(year, 1);
      }
    });

    map.forEach((key, value) => {
      xAxisData.push(value);
      YAxisData.push(key);
    });
    return [xAxisData, YAxisData];
  }

  getPieData(limit: number): Observable<any> {
    let map = new Map<String, number>();
    let mapLegend = new Map<String, any[]>();
    let documentIndex = 0;
    let prevIndex;
    this.dataList.forEach(WikiData => {
      const sec = WikiData.sections;
      let secIndex = 0;
      sec.forEach(section => {
        section.attributes.forEach(attr => {
          if (attr.values !== undefined) {
            const valuesList = attr.values;
            valuesList.forEach(attr => {
              const key = attr.name.toLowerCase().trim();
              if (
                key !== "1" &&
                key !== "2" &&
                key !== "3" &&
                key !== "first" &&
                key !== "last" &&
                key !== "pages" &&
                key !== "page"
              ) {
                const input = {
                  document: WikiData.title,
                  section: [secIndex]
                };
                if (prevIndex === undefined) {
                  map.set(key, 1);
                  mapLegend.set(key, [input]);
                } else if (mapLegend.has(key) && documentIndex === prevIndex) {
                  map.set(key, map.get(key) + 1);
                  const info = mapLegend.get(key);
                  const i = info.length - 1;
                  const sect = info[i]["section"];
                  sect.push(secIndex);
                  info[i]["section"] = sect;
                  mapLegend.set(key, info);
                } else if (mapLegend.has(key) && documentIndex !== prevIndex) {
                  map.set(key, map.get(key) + 1);
                  const info = mapLegend.get(key);
                  const i = info.length;
                  info[i] = input;
                  mapLegend.set(key, info);
                } else {
                  map.set(key, 1);
                  mapLegend.set(key, [input]);
                }
                prevIndex = documentIndex;
              }
            });
          }
        });
        secIndex++;
      });
      documentIndex++;
    });
    const sortedMap = new Map(
      [...map.entries()].sort((a, b) => {
        return b[1] - a[1];
      })
    );
    limit = Math.min(limit, sortedMap.size);

    let index = 0;
    let legendD = [];
    let seriesD = [];
    for (let key of sortedMap.keys()) {
      const v = sortedMap.get(key);
      seriesD.push({
        name: key,
        value: v,
        toolTipData: mapLegend.get(key)
      });
      legendD.push(key);
      if (++index === Number(limit)) {
        break;
      }
    }
    const pieData = {
      legendData: legendD,
      seriesData: seriesD
    };

    this._pieData.next(pieData);
    return this._pieData;
  }

  getBarData(limit: number, input: string): Observable<any> {
    let map = new Map<string, number>();
    let mapDate = new Map<string, string[]>();
    let documentIndex = 0;
    let prevIndex = 0;
    this.dataList.forEach(WikiData => {
      const sec = WikiData.sections;
      sec.forEach(section => {
        section.attributes.forEach(attr => {
          if (attr.values !== undefined && documentIndex !== prevIndex) {
            const valuesList = attr.values;
            valuesList.forEach(attr => {
              const key = attr.name.toLowerCase().trim();
              const value = attr.value.trim();
              if (key === input) {
                const date = new Date(
                  WikiData.time_published
                ).toLocaleDateString();
                if (map.has(value)) {
                  map.set(value, map.get(value) + 1);
                  let list = mapDate.get(value);
                  list.push(date);
                  mapDate.set(value, list);
                } else {
                  map.set(value, 1);
                  mapDate.set(value, [date]);
                }
              }
            });
          }
        });
        prevIndex = documentIndex;
      });
      documentIndex++;
    });

    const sortedMap = new Map(
      [...map.entries()].sort((a, b) => {
        return b[1] - a[1];
      })
    );

    let index = 0;
    let topValues = [];
    for (let key of sortedMap.keys()) {
      topValues.push(key);
      if (++index === Number(limit)) {
        break;
      }
    }

    let datas = [];

    topValues.forEach(data => {
      let map = new Map<string, number>();
      let dates = mapDate.get(data);
      dates.forEach(date => {
        if (map.has(date)) {
          map.set(date, map.get(date) + 1);
        } else {
          map.set(date, 1);
        }
      });
      const sortedMap = new Map(
        [...map.entries()].sort((a, b) => {
          let res1 = a[0].split("/");
          let res2 = b[0].split("/");
          if (Number(res1[2]) !== Number(res2[2])) {
            return Number(res1[2]) - Number(res2[2]);
          } else if (Number(res1[1]) !== Number(res2[1])) {
            return Number(res1[1]) - Number(res2[1]);
          } else if (Number(res1[0]) !== Number(res2[0])) {
            return Number(res1[0]) - Number(res2[0]);
          } else {
            return 0;
          }
        })
      );

      let xAxis = [];
      let yAxis = [];

      for (let key of sortedMap.keys()) {
        const v = sortedMap.get(key);
        xAxis.push(v);
        yAxis.push(key);
      }

      datas.push({
        xAxisData: xAxis,
        yAxisData: yAxis,
        attrValue: data
      });
    });
    this._barData = new BehaviorSubject<any>([]);
    this._barData.next(datas);
    return this._barData;
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
}
