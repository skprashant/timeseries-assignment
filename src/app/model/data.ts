export class WikiData {
  time_published: Date;
  sections: any[];
  title: string;

  constructor(time_published: Date, sections: any[], title: string) {
    this.time_published = time_published;
    this.sections = sections;
    this.title = title;
  }
}
