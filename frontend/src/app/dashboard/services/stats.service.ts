import { Injectable } from '@angular/core';
import {StatCard} from "../components/models/stat-card";
import {map, Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Streak} from "../components/models/Streak";
import {MadeTestsModel} from "../components/models/MadeTestsModel";

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly httpOptions: object = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  private url = environment.domain;

  constructor(private http: HttpClient) {}

  public getMadeTestsStats(): Observable<StatCard> {
    return this.http.get<MadeTestsModel>(`${this.url}/student/stat/madeTests`, this.httpOptions).pipe(
    map(madeTest => (new StatCard('Gemaakte toetsen', `${madeTest.allTests}`, `${madeTest.currentWeek} `, 'gemaakt deze week', 'fa-check-to-slot', 'icon-color-green'))));
  }

  public getStreakStats(): Observable<StatCard> {
    return this.http.get<Streak>(`${this.url}/student/stat/streak`, this.httpOptions).pipe(
      map(streak => new StatCard('Streak', `${streak.currentStreak} ${streak.currentStreak === 1 ? 'Dag' : 'Dagen'}`, `${streak.longestStreak}`, `${streak.longestStreak === 1 ? 'Dag' : 'Dagen'} hoogste streak`, 'fa-fire', 'icon-color-orange'))
    );
  }

  public getBestObjective(): Observable<StatCard> {
    return this.http.get<string>(`${this.url}/student/stat/bestObjective`, this.httpOptions).pipe(
      map(objective => new StatCard('Beste leerdoel', objective, ' ', ' ', 'fa-star', 'icon-color-yellow'))
    )
  }

  public getClassAverageScore(id: number): Observable<StatCard> {
    return this.http.get<number>(`${this.url}/teacher/stats/class/average/${id}`, this.httpOptions).pipe(
      map(averageScore => new StatCard('Gemiddelde score', averageScore.toString() + "%", '', '', 'fa-chart-simple', 'icon-color-green'))
    );
  }

  public getClassWorstObjective(id: number): Observable<StatCard> {
    return this.http.get<string>(`${this.url}/teacher/stats/class/worstObjective/${id}`, this.httpOptions).pipe(
      map(worstObjective => new StatCard('Slechtste leerdoel', worstObjective, '', '', 'fa-arrow-trend-down', 'icon-color-orange')));
  }

  public getClassTotalTests(id: number): Observable<StatCard> {
    return this.http.get<number>(`${this.url}/teacher/stats/class/totalTests/${id}`, this.httpOptions).pipe(
      map(totalTests => new StatCard('Totaal aantal toetsen gemaakt', totalTests.toString(), '', 'Deze week', 'fa-file-lines', 'icon-color-blue')));
  }
}
