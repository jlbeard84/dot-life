import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PieceType } from '../enums';
import { Point } from '../models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private readonly gridSize: number = 10;
  private readonly initialCount: number = 2;
  private readonly document: any;

  public title = 'dot-life';
  public gameGrid: PieceType[][];

  public redCount: number = 0;
  public greenCount: number = 0;
  public blueCount: number = 0;
  public yellowCount: number = 0;
  public purpleCount: number = 0;


  constructor(@Inject(DOCUMENT) document) {
    this.document = document;
    this.initialzeGrid();
    this.randomizeStartingPositions();
  }

  public ngOnInit(): void {
    this.updateDotClasses();
  }

  public onSpaceClick(spaceNumber: number): void {
    const pieceType = this.getPieceTypeFromPieceNumber(spaceNumber);
    const className = this.getClassNameFromPieceType(PieceType.None);

    const element = this.getPieceElement(spaceNumber);
    element.className = className;
  }

  private updateDotClasses(): void {
    for (let i = 0; i < this.gameGrid.length; i++) {
      for (let j = 0; j < this.gameGrid[i].length; j++) {
        const pieceType: PieceType = this.gameGrid[i][j];
        const className = this.getClassNameFromPieceType(pieceType);

        const pieceNumber: number = (i + (j * 10));

        const element = this.getPieceElement(pieceNumber);
        element.className = className;
      }
    }
  }

  private getClassNameFromPieceType(pieceType: PieceType): string {
    let className: string = 'space';

    switch (pieceType) {
      case PieceType.Red:
        className += ' red-space';
        break;
      case PieceType.Green:
        className += ' green-space';
        break;
      case PieceType.Blue:
        className += ' blue-space';
        break;
      case PieceType.Yellow:
        className += ' yellow-space';
        break;
      case PieceType.Purple:
        className += ' purple-space';
        break;
    }

    return className;
  }

  // private getPieceTypeFromPieceNumber(pieceNumber): PieceType {

  // }

  private getPieceElement(pieceNumber): any {
    const spaceId: string = `space-${pieceNumber}`;

    const element = this.document.getElementById(spaceId);
    return element;
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
