import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PieceType, DirectionType } from '../enums';
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
  public direction: DirectionType = DirectionType.LeftRight;
  public currentPlayerPieceType: PieceType = PieceType.Red;

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
    this.initializeDotClasses();
  }

  public onSpaceClick(
    rowNumber: number,
    colNumber: number,
    spaceNumber: number): void {

    const clickedPieceNumber = this.gameGrid[rowNumber][colNumber];

    if (clickedPieceNumber !== this.currentPlayerPieceType) {
      return;
    }

    this.updatePiece(rowNumber, colNumber, spaceNumber, PieceType.None);

    const spaceNumbersToUpdate: Point[] = [];

    if (this.direction === DirectionType.LeftRight) {
      if (colNumber !== 9) {
        spaceNumbersToUpdate.push(new Point(rowNumber, colNumber + 1, spaceNumber + 1));
      }

      if (colNumber !== 0) {
        spaceNumbersToUpdate.push(new Point(rowNumber, colNumber - 1, spaceNumber - 1));
      }
    } else if (this.direction === DirectionType.UpDown) {
      if (rowNumber !== 9) {
        spaceNumbersToUpdate.push(new Point(rowNumber + 1, colNumber, spaceNumber + 10));
      }

      if (rowNumber !== 0) {
        spaceNumbersToUpdate.push(new Point(rowNumber - 1, colNumber, spaceNumber - 10));
      }
    }

    spaceNumbersToUpdate.forEach((point) => {
      this.updatePiece(
        point.X,
        point.Y,
        point.Space,
        this.currentPlayerPieceType);
    });
  }

  private updatePiece(
    rowNumber: number,
    colNumber: number,
    spaceNumber: number, 
    pieceType: PieceType): void {

    const className = this.getClassNameFromPieceType(pieceType);

    const element = this.getPieceElement(spaceNumber);
    element.className = className;

    this.gameGrid[rowNumber][colNumber] = pieceType;
  }

  private initializeDotClasses(): void {
    for (let i = 0; i < this.gameGrid.length; i++) {
      for (let j = 0; j < this.gameGrid[i].length; j++) {
        const pieceType: PieceType = this.gameGrid[i][j];
        const className = this.getClassNameFromPieceType(pieceType);

        const pieceNumber: number = (i * 10) + j;

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
