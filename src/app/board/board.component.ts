// board.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  board: number[][];
  snakes: number[][];
  ladders: number[][];
  colors: string[][];
  playerPosition: number;
  diceNumber: number | null;
  diceImageSrc: string | null;


  
  diceRollSound: HTMLAudioElement = new Audio('assets/dice_sound.mp3');
  isFlipping: Boolean = false;
  
  constructor() {
    this.board = this.generateBoard();
    this.snakes = this.generateSnakes();
    this.ladders = this.generateLadders();
    this.colors = this.generateColors();
    this.playerPosition = 1;
    this.diceNumber = null;
    this.diceImageSrc = null;
  }

  ngOnInit(): void {}

  private generateBoard(): number[][] {
    let board = [];
    let counter = 1;
    let flag = true;
    for (let i = 0; i < 10; i++) {
      let row = [];
      for (let j = 0; j < 10; j++) {
           row.push(counter++);
      }
      board.push(row);
    }

    return board;
  }

  private generateSnakes(): number[][] {
    return [
      [16, 6],
      [91, 63],
      [49, 11],
      [56, 53],
      [75, 29],
      [98, 60]
    ];
  }

  private generateLadders(): number[][] {
    return [
      [2, 15],
      [5, 25],
      [20, 43],
      [27, 76],
      [40, 66],
      [63, 95]
    ];
  }

  private generateColors(): string[][] {
    let colors = [
      '#f7e116', '#f57f95', '#f57fbe', '#c87ff5', '#7fa6f5', '#5fe3f5', '#fa886e'
    ];

    let boardColors = [];
    for (let i = 0; i < 10; i++) {
      let rowColors = [];
      for (let j = 0; j < 10; j++) {
        let index = Math.floor(Math.random() * colors.length);
        let color = colors[index];
        rowColors.push(color);
      }
      boardColors.push(rowColors);
    }

    return boardColors;
  }

  isSnakeCell(i: number, j: number): boolean {
    return this.snakes.some(snake => snake[0] === (i * 10 + j + 1));
  }

  isLadderCell(i: number, j: number): boolean {
    return this.ladders.some(ladder => ladder[0] === (i * 10 + j + 1));
  }

  isSnakeVisible(i: number, j: number): boolean {
    const snake = this.snakes.find(snake => snake[0] === (i * 10 + j + 1));
    return !!snake && snake[0] === (i * 10 + j + 1);
  }

  isLadderVisible(i: number, j: number): boolean {
    const ladder = this.ladders.find(ladder => ladder[0] === (i * 10 + j + 1));
    return !!ladder && ladder[1] === (i * 10 + j + 1);
  }

  getSnakeDestination(i: number, j: number): number {
    const snake = this.snakes.find(snake => snake[0] === (i * 10 + j + 1));
    return snake ? snake[1] : 0;
  }

  getLadderDestination(i: number, j: number): number {
    const ladder = this.ladders.find(ladder => ladder[0] === (i * 10 + j + 1));
    return ladder ? ladder[1] : 0;
  }

  isPlayerCell(i: number, j: number): boolean {
    return this.playerPosition === (i * 10 + j + 1);
  }
  
  rollDice(): void {
    this.isFlipping = true;

    // Wait for the flip animation to complete before updating the dice image
    setTimeout(() => {
      this.diceRollSound.play();
      this.diceNumber = Math.floor(Math.random() * 6) + 1;
      this.diceImageSrc = `assets/${this.diceNumber}.png`;
      const steps = this.diceNumber;
      this.movePlayer(steps);
      this.isFlipping = false;
    }, 600); 
  }

  movePlayer(steps: number): void {
    const newPosition = this.playerPosition + steps;
  
    // Check if the new position is on a snake or a ladder
    const snake = this.snakes.find(snake => snake[0] === newPosition);
    const ladder = this.ladders.find(ladder => ladder[0] === newPosition);
  
    if (snake) {
      // If the player lands on a snake, move back to the corresponding number
      this.playerPosition = snake[1];
    } else if (ladder) {
      // If the player lands on a ladder, move above to the corresponding number
      this.playerPosition = ladder[1];
    } else {
      // Otherwise, move to the new position
      this.playerPosition = newPosition;
    }
  }
}