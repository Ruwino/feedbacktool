export class StatCard {
  private _title: string;
  private _stat: string;
  private _subStat: string;
  private _subText: string;
  private _icon: string;
  private _color: string;

  constructor(title: string, stat: string, subStat: string, subText: string, icon: string, color: string) {
    this._title = title;
    this._stat = stat;
    this._subStat = subStat;
    this._subText = subText;
    this._icon = icon;
    this._color = color;
  }

  public get title(): string {
    return this._title;
  }

  public get stat(): string {
    return this._stat;
  }

  public get subStat(): string {
    return this._subStat;
  }

  public get subText(): string {
    return this._subText;
  }

  public get icon(): string {
    return this._icon;
  }

  public get color(): string {
    return this._color;
  }
}
