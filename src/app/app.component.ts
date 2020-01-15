import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PieceType, DirectionType, PopDirectionType } from '../enums';
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
  public pieceTypes: typeof PieceType = PieceType;

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
    this.updateCounts();
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
        const rightPoint = new Point(rowNumber, colNumber + 1, spaceNumber + 1);
        spaceNumbersToUpdate.push(rightPoint);

        spaceNumbersToUpdate.push(...this.popInDirection(rightPoint, PopDirectionType.Right, 0));
      }

      if (colNumber !== 0) {
        const leftPoint = new Point(rowNumber, colNumber - 1, spaceNumber - 1);
        spaceNumbersToUpdate.push(leftPoint);

        spaceNumbersToUpdate.push(...this.popInDirection(leftPoint, PopDirectionType.Left, 0));
      }
    } else if (this.direction === DirectionType.UpDown) {
      if (rowNumber !== 9) {
        const downPoint = new Point(rowNumber + 1, colNumber, spaceNumber + 10);
        spaceNumbersToUpdate.push(downPoint);

        spaceNumbersToUpdate.push(...this.popInDirection(downPoint, PopDirectionType.Down, 0));
      }

      if (rowNumber !== 0) {
        const upPoint = new Point(rowNumber - 1, colNumber, spaceNumber - 10);
        spaceNumbersToUpdate.push(upPoint);

        spaceNumbersToUpdate.push(...this.popInDirection(upPoint, PopDirectionType.Up, 0));
      }
    }

    spaceNumbersToUpdate.forEach((point) => {
      this.updatePiece(
        point.X,
        point.Y,
        point.Space,
        this.currentPlayerPieceType);
    });

    this.updateCounts();
  }

  public popInDirection(popPoint: Point, popDirection: PopDirectionType, numberPopped): Point[] {
    const pointsToPop: Point[] = [];

    const pieceAtPoint = this.gameGrid[popPoint.X][popPoint.Y];

    if (pieceAtPoint === PieceType.None) {
      return pointsToPop;
    }

    if (numberPopped > 0) {
      pointsToPop.push(popPoint);
    }

    let newX: number;
    let newY: number;
    let newSpace: number;

    switch (popDirection) {
      case PopDirectionType.Left:
        newX = popPoint.X;
        newY = popPoint.Y - 1;
        newSpace = popPoint.Space - 1;
        break;
      case PopDirectionType.Right:
        newX = popPoint.X;
        newY = popPoint.Y + 1;
        newSpace = popPoint.Space + 1;
        break;
      case PopDirectionType.Up:
        newX = popPoint.X + 1;
        newY = popPoint.Y;
        newSpace = popPoint.Space + 10;
        break;
      case PopDirectionType.Down:
        newX = popPoint.X - 1;
        newY = popPoint.Y;
        newSpace = popPoint.Space - 10;
        break;
    }

    if (newX >= 0 && newX<= 9 && newY >= 0 && newY <= 9) {
      const newPoint = new Point(newX, newY, newSpace);
      pointsToPop.push(...this.popInDirection(newPoint, popDirection, numberPopped + 1));
    }

    return pointsToPop;
  }

  public flipDirection(): void {
    this.direction = this.direction === DirectionType.LeftRight
      ? DirectionType.UpDown
      : DirectionType.LeftRight;
  }

  public getButtonContent(): string {
    return this.direction === DirectionType.LeftRight
    ? '← →'
    : '↑ ↓';
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

  private updateCounts(): void {

    this.redCount = 0;
    this.greenCount = 0;
    this.blueCount = 0;
    this.yellowCount = 0;
    this.purpleCount = 0;

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const pieceType = this.gameGrid[i][j];

        switch (pieceType) {
          case PieceType.Red:
            this.redCount++;
            break;
          case PieceType.Green:
            this.greenCount++;
            break;
          case PieceType.Blue:
            this.blueCount++;
            break;
          case PieceType.Yellow:
            this.yellowCount++;
            break;
          case PieceType.Purple:
            this.purpleCount++;
            break;
        }
      }
    }
  }
}
