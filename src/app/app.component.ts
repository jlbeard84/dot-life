import { Component } from '@angular/core';
import { PieceType } from '../enums';
import { Point } from '../models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly gridSize: number = 10;
  private readonly initialCount: number = 2;

  public title = 'dot-life';
  public gameGrid: PieceType[][];

  public redCount: number = 0;
  public greenCount: number = 0;
  public blueCount: number = 0;
  public yellowCount: number = 0;
  public purpleCount: number = 0;


  constructor() {
    this.initialzeGrid();
    this.randomizeStartingPositions();
  }

  private initialzeGrid(): void {
    this.gameGrid = [];

    for (let i = 0; i < this.gridSize; i++) {
      this.gameGrid.push([]);

      for (let j = 0; j < this.gridSize; j++) {
        this.gameGrid[i].push(PieceType.None);
      }
    }
  }

  private randomizeStartingPositions(): void {
    for (let i = 0; i < this.initialCount; i++) {
      this.insertStartingDot(PieceType.Red);
      this.insertStartingDot(PieceType.Green);
      this.insertStartingDot(PieceType.Blue);
      this.insertStartingDot(PieceType.Yellow);
      this.insertStartingDot(PieceType.Purple);
    }
  }

  private insertStartingDot(pieceType: PieceType): void {
    let hasEmptyPosition: boolean = false;

    while (!hasEmptyPosition) {
      const point = this.createRandomPoint();
      const currentPieceType = this.gameGrid[point.X][point.Y];

      if (currentPieceType === PieceType.None) {
        this.gameGrid[point.X][point.Y] = pieceType;
        hasEmptyPosition = true;
      }
    }
  }

  private createRandomPoint(): Point {
    const point = new Point();
    point.X = Math.floor((Math.random() * 10));
    point.Y = Math.floor((Math.random() * 10));

    return point;
  }
}
