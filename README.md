# NAND2Tetris Hack Architecture assembler written in Bun with Typescript

This project presents a Typescript-based 16-bit assembler tailored for the NAND2Tetris Hack Architecture. Leveraging Bun and TypeScript, the assembler provides a robust tool for assembling 16-bit assembly code.

## Features

- Assembles 16-bit assembly code for the NAND2Tetris Hack Architecture.
- Efficiently built with Bun and TypeScript.
- Supports translation of both A-instructions and C-instructions.
- Handles predefined symbols, labels, and custom symbols for a comprehensive assembly process.

## Prerequisites

Before running the assembler, make sure you have the following installed:

- [Bun](https://bun.sh/) (v1.0.0 or higher)
- [TypeScript](https://www.typescriptlang.org/) (v5.0.0 or higher)

## Installation

1. Clone this repository:

```bash
git clone https://github.com/ogzhanolguncu/16bit-ts-assembler
```

## Usage

```bash
bun run build

//Then run

./16bit-assembler test-files/Add.asm
```
