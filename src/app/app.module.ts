import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgxEchartsModule } from "ngx-echarts";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import * as echarts from "echarts";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
