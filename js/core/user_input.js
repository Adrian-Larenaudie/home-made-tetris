import { game } from '../game.js';
import { grid } from './grid.js';
import { piece } from './piece.js';

export const user_input = {
    /* ------------------ PROPRIETES ---------------- */
    last_keypress_value: null,
    keydown_flag: false,
    keyup_flag: true,
    /* ------------------ PROPRIETES ---------------- */

    /* ------------------- METHODES ----------------- */
    add_key_touch_event: () => {
        document.addEventListener('keypress', user_input.on_key_press_handler, true);
        document.addEventListener('keydown', user_input.on_key_down_handler, true);
        document.addEventListener('keyup', user_input.on_key_up_handler, true);
    },

    remove_key_touch_event: () => {
        document.removeEventListener('keypress', user_input.on_key_press_handler, true);
        document.removeEventListener('keydown', user_input.on_key_down_handler, true);
        document.removeEventListener('keyup', user_input.on_key_up_handler, true);
    },

    on_key_press_handler: (event) => {
        if(!game.over && piece.current_positions != null) {
            switch (event.key) {
                case "z":
                    //TODO rotation de la pièce
                    console.log(event.key);
                    break;
                case "q":                
                    if(user_input.can_current_piece_move(piece.current_positions, 0, 'left')) {
                        //* pour obtenir un comportement propre à tetris on stop l'interval tant la pièce est en déplacement
                        //* la pièce ne descend plus tant qu'elle se déplace sur un coté 
                        //* cpdt on ne clear pas l'interval si la dernière touche appuyée est de la touche courante
                        if(event.key === user_input.last_keypress_value) clearInterval(game.interval);
                        piece.current_positions.forEach((position) => {
                            position.x = position.x - 31;
                        });
                        if(event.key === user_input.last_keypress_value) {
                            //* on redessine la grille et la pièce
                            grid.draw();
                            piece.draw(piece.current_type);
                            //* et on remet l'interval pour que la pièce descende à nouveau
                            game.interval = setInterval(game.on_move, game.speed);
                        }
                       
                    }
                    break;
                case "d":
                    if(user_input.can_current_piece_move(piece.current_positions, 279, 'right')) {
                        if(event.key === user_input.last_keypress_value) clearInterval(game.interval);
                        piece.current_positions.forEach((position) => {
                            position.x = position.x + 31;
                        })
                        if(event.key === user_input.last_keypress_value) {
                            //* on redessine la grille et la pièce
                            grid.draw();
                            piece.draw(piece.current_type);
                            //* et on remet l'interval pour que la pièce descende à nouveau
                            game.interval = setInterval(game.on_move, game.speed);
                        }
                       
                    }
                    break;
                case " ":
                    //TODO on jouera une pause 
                break;
            };
            user_input.last_keypress_value = event.key;
        }     
    },

    on_key_down_handler: (event) => {
        user_input.keyup_flag = false;
        if(!user_input.keydown_flag && event.key === 's') {
            user_input.keydown_flag = true;
            clearInterval(game.interval);
            game.speed = 50;
            game.interval = setInterval(game.on_move, game.speed);           
        }
    },

    on_key_up_handler: (event) => {
        user_input.keydown_flag = false;
        if(!user_input.keyup_flag && event.key === 's') {
            user_input.keyup_flag = true;
            clearInterval(game.interval);
            game.speed = 500;
            game.interval = setInterval(game.on_move, game.speed);
        }
    },

    //* la méthode qui permet de vérifier si la pièce peut se déplacer
    can_current_piece_move: (current_piece_positions, max_position, direction) => {
        let flag = true;
        let value;
        if(direction === 'right') value = 31;
        if(direction === 'left') value = -31;
        current_piece_positions.forEach((current_position) => {
            //* si la position arrive sur une bordure on interdit le déplcament
            if(current_position.x === max_position) {
                flag = false;
            }
            //* si la position arrive sur une pièce déjà placée on interdit aussi le déplacement
            grid.all_positions.forEach((grid_position) => {
                if(direction === 'right' && grid_position.x === (current_position.x + 31) && grid_position.y === current_position.y && grid_position.used === 1) {
                    flag = false;
                }
                if(direction === 'left' && grid_position.x === (current_position.x - 31) && grid_position.y === current_position.y && grid_position.used === 1) {
                    flag = false;
                }
            });
        });

        
        return flag;
    },
    /* ------------------- METHODES ----------------- */
}