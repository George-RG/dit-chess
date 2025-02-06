import { Chess } from "chess.js";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";

const baseUrl = import.meta.env.BASE_URL;

const importObject = {
    env: {
        __memory_base: 0,
        abort: () => { throw new Error("abort") }
    }
};

export interface gameState {
    whiteEngineSource: string;
    blackEngineSource: string;

    whiteToPlay: boolean;

    whiteEngineMove: (boardState: string, possibleMoves: string[]) => Promise<number>;
    blackEngineMove: (boardState: string, possibleMoves: string[]) => Promise<number>;
    game: Chess;

    timeout: number;
    moveInterval: number;
}

export interface gameStatus {
    gameLoading?: boolean;
    gameReady?: boolean;
    gameStarted?: boolean;
    gamePaused?: boolean;
    gameEnded?: boolean;
}

// Random engine for testing - we gotta beat this!
const randomEngine = async function (_: string, possibleMoves: string[]): Promise<number> {
    return new Promise<number>((resolve, _) => {
        const randomIdx = Math.floor(Math.random() * possibleMoves.length)
        resolve(randomIdx)
    });
}

const build_engine = (wasm: WebAssembly.WebAssemblyInstantiatedSource, timeout: number) => {
    // Check that the wasm module has the necessary exports
    if (!wasm.instance.exports["choose_move"]) {
        throw new Error("WASM module does not have the necessary exports")
    }

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
                const func = wasm.instance.exports["choose_move"] as (arg1: number, arg2: number, arg3: number) => number
                const moveIndex = func(0, boardState.length + 1, timeout)
                if(moveIndex < 0 || moveIndex >= possibleMoves.length) {
                    reject(new Error("Invalid move index"))
                }

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
    onStatusChange: (status: gameStatus) => void;
    onGameEnd: (winner: string) => void;

    status: gameStatus;

    constructor(whiteEngine?: string, blackEngine?: string, onMove?: (move: string, newBoardFen: string) => void, delay?: number, onStatusChange?: (status: gameStatus) => void, onGameEnd?: (winner: string) => void) {
        this.state = {
            whiteEngineSource: whiteEngine || '',
            blackEngineSource: blackEngine || '',
            whiteToPlay: false, // White always starts
            game: new Chess(),
            whiteEngineMove: randomEngine,
            blackEngineMove: randomEngine,
            timeout: 5,
            moveInterval: delay === undefined ? 1 : delay,
        };

        this.status = {
            gameLoading: false,
            gameReady: false,
            gameStarted: false,
            gamePaused: false,
            gameEnded: true,
        }

        this.onMove = onMove || function () { };
        this.onStatusChange = onStatusChange || function () { };
        this.onGameEnd = onGameEnd || function () { };
    }

    updateStatus(newStatus: gameStatus) {
        if (newStatus.gameEnded !== undefined) {
            this.status.gameEnded = newStatus.gameEnded;
        }

        if (newStatus.gameLoading !== undefined) {
            this.status.gameLoading = newStatus.gameLoading;
        }

        if (newStatus.gamePaused !== undefined) {
            this.status.gamePaused = newStatus.gamePaused;
        }

        if (newStatus.gameReady !== undefined) {
            this.status.gameReady = newStatus.gameReady;
        }

        if (newStatus.gameStarted !== undefined) {
            this.status.gameStarted = newStatus.gameStarted;
        }

        this.onStatusChange(this.status);
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

    async initGame(whiteEngine?: string, blackEngine?: string, onMove?: (move: string, newBoardFen: string) => void, delay?: number, onStatusChange?: (status: gameStatus) => void, onGameEnd?: (winner: string) => void) {
        if (this.status.gameStarted || this.status.gameLoading) return;
        
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

        if (onStatusChange){
            this.onStatusChange = onStatusChange;
        }

        if (onGameEnd){
            this.onGameEnd = onGameEnd;
        }
                
        // Reset the game
        this.updateStatus({ gameLoading: true });
        this.state.game.reset();

        const promises = []
        if (this.state.whiteEngineSource.endsWith('.wasm')) {
            try
            {
                const wasmPromise = WebAssembly.instantiateStreaming(fetch(baseUrl + `/engines/${this.state.whiteEngineSource}`), importObject)
                promises.push(wasmPromise)   
            } catch (e) {
                console.error(e)
            }                     
        } else if (this.state.whiteEngineSource === 'random') {
            this.state.whiteEngineMove = randomEngine
        } else if (this.state.whiteEngineSource === 'human') {
            // Do nothing
        } else {
            throw new Error('Invalid white engine source');
        }

        if (this.state.blackEngineSource.endsWith('.wasm')) {
            try
            {
                const wasmPromise = WebAssembly.instantiateStreaming(fetch(baseUrl + `/engines/${this.state.blackEngineSource}`), importObject)
                promises.push(wasmPromise)   
            } catch (e) {
                console.error(e)
            }                     
        } else if (this.state.blackEngineSource === 'random') {
            this.state.blackEngineMove = randomEngine
        } else if (this.state.blackEngineSource === 'human') {
            // Do nothing
        } else {
            throw new Error('Invalid black engine source');
        }

        // Fetch all engines and then start the game(s)
        const wasms = await Promise.all(promises)
        let engine_index = 0
        if (this.state.whiteEngineSource.endsWith('.wasm')) {
            this.state.whiteEngineMove = build_engine(wasms[engine_index], this.state.timeout)
            engine_index += 1
        }
        if (this.state.blackEngineSource.endsWith('.wasm')) {
            this.state.blackEngineMove = build_engine(wasms[engine_index], this.state.timeout)
            engine_index += 1
        }

        this.updateStatus({ gameReady: true });
    }

    concludeGame(winner: string) {
        if(this.status.gameEnded) return;

        this.updateStatus({
            gameStarted: false,
            gamePaused: false,
            gameEnded: true,
            gameLoading: false,
            gameReady: false
        })
        
        this.onGameEnd(winner);
    }

    startGame() {
        if (!this.status.gameReady) return;

        this.updateStatus({
            gameStarted: true,
            gamePaused: false,
            gameEnded: false,
            gameLoading: false,
            gameReady: false
        })
        this.gameDriver();
    }

    pauseGame(){
        if (!this.status.gameStarted) return

        this.updateStatus({ gamePaused: true });
    }

    resumeGame(){
        if (!this.status.gameStarted) return

        this.updateStatus({ gamePaused: false });
        this.gameDriver();
    }

    stopGame(){
        if (!this.status.gameStarted) return

        this.concludeGame('stop');
    }


    async gameDriver() {
        if(this.status.gamePaused || this.status.gameEnded) return;

        this.state.whiteToPlay = !this.state.whiteToPlay;

        if (this.state.game.isGameOver()) {
            if (this.state.game.isCheckmate()) {
                const winner = this.state.whiteToPlay ? 'black' : 'white';
                console.log(`${winner} wins!`)
                this.concludeGame(winner);

            } else if (this.state.game.isDraw()) {
                this.concludeGame('draw');
            }
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
            if(err.message === "Timeout") {
                if(this.state.whiteToPlay){
                    this.concludeGame("black")
                }
                else{
                    this.concludeGame("white")
                }
                
                return -2;
            }

            console.error(err)
            return -1;
        });

        if (moveIndex === -1) {
            this.concludeGame("error");
            return;
        }

        if (moveIndex === -2) {
            return;
        }

        if(this.status.gamePaused) {
            this.state.whiteToPlay = !this.state.whiteToPlay
            return;
        }

        this.state.game.move(possibleMoves[moveIndex]);
        this.onMove(possibleMoves[moveIndex], this.state.game.fen());
        // Wait for the next move
        if(this.state.moveInterval > 0)
        {
            setTimeout(() => {
                this.gameDriver();
            }, this.state.moveInterval * 1000);
        } else {
            this.gameDriver();
        }
    }
}