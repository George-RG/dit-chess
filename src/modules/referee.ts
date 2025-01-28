import { Chess } from "chess.js";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";

const importObject = {
    env: {
        __memory_base: 0,
    }
};
interface gameState {
    whiteEngineSource: string;
    blackEngineSource: string;

    whiteToPlay: boolean;

    whiteEngineMove: (boardState: string, possibleMoves: string[]) => Promise<number>;
    blackEngineMove: (boardState: string, possibleMoves: string[]) => Promise<number>;
    game: Chess;

    timeout: number;
    moveInterval: number;
}

interface gameStatus {
    gameLoading: boolean;
    gameReady: boolean;
    gameStarted: boolean;
    gamePaused: boolean;
    gameEnded: boolean;
}

// Random engine for testing - we gotta beat this!
const randomEngine = async function (_: string, possibleMoves: string[]): Promise<number> {
    return new Promise<number>((resolve, _) => {
        var randomIdx = Math.floor(Math.random() * possibleMoves.length)
        resolve(randomIdx)
    });
}

const build_engine = (wasm: WebAssembly.WebAssemblyInstantiatedSource, timeout: number) => {
    return async (boardState: string, possibleMoves: string[]): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            const memory = new Uint8Array((wasm.instance.exports["memory"] as WebAssembly.Memory).buffer)
            for (let i = 0; i < boardState.length; i++) {
                memory[i] = boardState.charCodeAt(i)
            }
            memory[boardState.length] = 0
            const moves_str = possibleMoves.join(" ");
            for (let i = 0; i < moves_str.length; i++) {
                memory[boardState.length + 1 + i] = moves_str.charCodeAt(i)
            }
            memory[boardState.length + 1 + moves_str.length] = 0

            const timer = setTimeout(() => {
                reject(new Error("Timeout"))
            }, timeout * 1000 + 100)

            try {
                const moveIndex = (wasm.instance.exports["choose_move"] as (arg1: number, arg2: number, arg3: number) => number)(0, boardState.length + 1, timeout)

                resolve(moveIndex)
            } catch (e) {
                reject(e)
            } finally {
                clearTimeout(timer)
            }
        });
    }
}

export class Referee {

    state: gameState;

    onMove: (move: string, newBoardFen: string) => void;

    status: gameStatus;

    constructor(whiteEngine?: string, blackEngine?: string, onMove?: (move: string, newBoardFen: string) => void, delay?: number) {
        this.state = {
            whiteEngineSource: whiteEngine || '',
            blackEngineSource: blackEngine || '',
            whiteToPlay: false, // White always starts
            game: new Chess(),
            whiteEngineMove: randomEngine,
            blackEngineMove: randomEngine,
            timeout: 5,
            moveInterval: delay || 1,
        };

        this.status = {
            gameLoading: false,
            gameReady: false,
            gameStarted: false,
            gamePaused: false,
            gameEnded: false,
        }

        this.onMove = onMove || function () { };
    }

    // Method to pass to the chessboard component
    onDragStart: (args: { piece: Piece, sourceSquare: Square }) => boolean = (args) => {
        if (this.state.game.isGameOver() === true ||
            (this.state.game.turn() === 'w' && args.piece.search(/^b/) !== -1 && this.state.whiteEngineSource === 'human') ||
            (this.state.game.turn() === 'b' && args.piece.search(/^w/) !== -1 && this.state.blackEngineSource === 'human')) {
            return false;
        }
        return true;
    }

    onDrop: (source: string, target: string) => boolean = (source: string, target: string) => {
        try {
            const move = this.state.game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });

            if (move === null) return false;

            this.onMove(move.san, this.state.game.fen());
            this.gameDriver();
            return true;
        }
        catch {
            return false;
        }
    }

    set setDelay(delay: number) {
        this.state.moveInterval = delay;
    }

    async initGame(whiteEngine?: string, blackEngine?: string, delay?: number, onMove?:(move: string, newBoardFen: string) => void) {
        if (this.status.gameStarted || this.status.gameLoading) return;
        this.status.gameLoading = true;

        if (!whiteEngine && this.state.whiteEngineSource === '') {
            throw new Error('No white engine provided');
        }

        if (!blackEngine && this.state.blackEngineSource === '') {
            throw new Error('No black engine provided');
        }

        if (whiteEngine) {
            this.state.whiteEngineSource = whiteEngine;
        }

        if (blackEngine) {
            this.state.blackEngineSource = blackEngine;
        }

        if (delay){
            this.state.moveInterval = delay;
        }

        if (onMove){
            this.onMove = onMove;
        }

        const promises = []
        if (this.state.whiteEngineSource.endsWith('.wasm')) {
            promises.push(WebAssembly.instantiateStreaming(fetch(`engines/${this.state.whiteEngineSource}`), importObject))
        }

        if (this.state.blackEngineSource.endsWith('.wasm')) {
            promises.push(WebAssembly.instantiateStreaming(fetch(`engines/${this.state.blackEngineSource}`), importObject))
        }

        if (this.state.whiteEngineSource === 'random') {
            this.state.whiteEngineMove = randomEngine
        }

        if (this.state.blackEngineSource === 'random') {
            this.state.blackEngineMove = randomEngine
        }

        // Fetch all engines and then start the game(s)
        Promise.all(promises).then(wasms => {
            var engine_index = 0
            if (this.state.whiteEngineSource.endsWith('.wasm')) {
                this.state.whiteEngineMove = build_engine(wasms[engine_index], this.state.timeout)
                engine_index += 1
            }
            if (this.state.blackEngineSource.endsWith('.wasm')) {
                this.state.blackEngineMove = build_engine(wasms[engine_index], this.state.timeout)
                engine_index += 1
            }

            // Start the game loop
            this.status.gameReady = true;
        })
    }

    startGame() {
        if (!this.status.gameReady) return;

        this.gameDriver();
        this.status.gameLoading = false;
        this.status.gamePaused = false;
        this.status.gameLoading = false;
        this.status.gameEnded =false;
        this.status.gameStarted = true;
    }

    pauseGame(){
        if (!this.status.gameStarted) return

        this.status.gamePaused = true;
    }

    resumeGame(){
        if (!this.status.gameStarted) return

        this.status.gamePaused = false;
        this.gameDriver();
    }

    async gameDriver() {
        if(this.status.gamePaused || this.status.gameEnded) return;

        this.state.whiteToPlay = !this.state.whiteToPlay;

        if (this.state.game.isGameOver()) {
            if (this.state.game.isCheckmate()) {
                console.log("Checkmate!")
            } else if (this.state.game.isDraw()) {
                console.log("Draw!")
            }
            this.status.gameEnded = true;
            return;
        }

        if (this.state.whiteToPlay && this.state.whiteEngineSource === 'human'
            || !this.state.whiteToPlay && this.state.blackEngineSource === 'human'
        ) {
            console.log("Human's turn")
            return;
        }

        const boardState = this.state.game.fen();
        const possibleMoves = this.state.game.moves();

        const moveFunc = this.state.whiteToPlay ? this.state.whiteEngineMove : this.state.blackEngineMove;
        const moveIndex = await moveFunc(boardState, possibleMoves).catch((err) => {
            console.error(err)
            return -1;
        });

        if (moveIndex === -1) {
            return;
        }

        if(this.status.gamePaused) {
            this.state.whiteToPlay = !this.state.whiteToPlay
            return;
        }

        this.state.game.move(possibleMoves[moveIndex]);
        this.onMove(possibleMoves[moveIndex], this.state.game.fen());
        // Wait for the next move
        setTimeout(() => {
            this.gameDriver();
        }, this.state.moveInterval * 1000);
    }
}