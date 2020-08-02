import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class GetDataService {
  private _lineData = new BehaviorSubject<any>({});
  dataList: any[] = [];
  lines: any;

  constructor() {}

  getData(data): Observable<any> {
    this.lines = data;
    const v = this.getLineChartData();
    this._lineData.next(v);
    return this._lineData;
  }

  getLineChartData() {
    for (const line of this.lines.split(/[\r\n]+/)){
      const v = line.split(",");
      this.dataList.push(v);
    }
    return this.dataList;
  }
}
