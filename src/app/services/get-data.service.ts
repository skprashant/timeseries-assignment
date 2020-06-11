import { Injectable, OnInit } from "@angular/core";
import { WikiData } from "../model/data";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class GetDataService {
  private _wikiData = new BehaviorSubject<any>([]);
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

  getHistogramData() {}

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
}
