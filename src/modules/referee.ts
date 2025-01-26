import { Chess } from "chess.js";

interface gameState {
    whiteEngine: string;
    blackEngine: string;

    whiteToPlay: boolean;

    game: Chess;
}


class Referee {

    state: gameState;

    onMove: (move: string) => void;
    

}