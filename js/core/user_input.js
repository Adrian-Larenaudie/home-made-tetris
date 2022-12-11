import { speed } from '../data/data.js';
import { game } from '../game.js';
import { grid } from './grid.js';
import { piece } from './piece.js';
import { spin } from './spin.js';

export const user_input = {
    /* ------------------ PROPRIETES ---------------- */
    last_keypress_value: null,
    keydown_flag: false,
    keyup_flag: true,
    spin_index: 0,
    /* ------------------ PROPRIETES ---------------- */

    /* ------------------- METHODES ----------------- */
    add_key_event: () => {
        document.addEventListener('keypress', user_input.on_key_press_handler, true);
        document.addEventListener('keydown', user_input.on_key_down_handler, true);
        document.addEventListener('keyup', user_input.on_key_up_handler, true);
    },

    remove_key_event: () => {
        document.removeEventListener('keypress', user_input.on_key_press_handler, true);
        document.removeEventListener('keydown', user_input.on_key_down_handler, true);
        document.removeEventListener('keyup', user_input.on_key_up_handler, true);
    },

    on_key_press_handler: (event) => {
        if(!game.over && piece.current_positions != null) {
            switch (event.key) {
                case "z":
                    if(!game.pause) {
                        spin.init();
                    }
                    break;
                case "q":                
                    if(user_input.can_current_piece_move(piece.current_positions, 0, 'left') && !game.pause) {
                        //* pour obtenir un comportement propre à tetris on stop l'interval tant que la pièce est en déplacement
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
                    if(user_input.can_current_piece_move(piece.current_positions, 279, 'right') && !game.pause) {
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
                    user_input.manage_pause(false);
                break;
            };
            if(['q', 'd'].includes(event.key)) user_input.last_keypress_value = event.key;
        }     
    },

    on_key_down_handler: (event) => {
        if(event.key === 's' && !game.pause) {
            user_input.keyup_flag = false;
            if(!user_input.keydown_flag) {
                user_input.keydown_flag = true;
                clearInterval(game.interval);
                game.speed = speed.on_key_press_s;
                game.interval = setInterval(game.on_move, game.speed);           
            }
        }
    },

    on_key_up_handler: (event) => {
        if(event.key === 's' && !game.pause) {
            user_input.keydown_flag = false;
            if(!user_input.keyup_flag) {
                user_input.keyup_flag = true;
                clearInterval(game.interval);
                game.speed = speed.current;
                game.interval = setInterval(game.on_move, game.speed);
            }
        }
    },

    on_visibility_change_page_event_handler: () => {
        document.addEventListener("visibilitychange", (event) => {
            user_input.manage_pause(true);
        });
    },

    //* la méthode qui permet de vérifier si la pièce peut se déplacer
    can_current_piece_move: (current_piece_positions, max_position, direction) => {
        let flag = true;
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

    manage_pause: (from_on_visible_event) => {
        if(!game.pause && game.running) {
            game.pause_modal.style.visibility = "visible";
            game.pause = true;
            clearInterval(game.interval);
        } else if(game.pause && game.running && !from_on_visible_event) {
            game.pause_modal.style.visibility = "hidden";
            game.pause = false;
            game.interval = setInterval(game.on_move, game.speed);
        }
    },
    /* ------------------- METHODES ----------------- */
};

/*
*DOCUMENTATION

TODO avant de compléter la documentation de ce fichier corriger le bug sur la touche Q & D détailler dans le readme.md

*DESCRIPTION DES PROPRIETES: (4)
- last_keypress_value:
- keydown_flag: 
- keyup_flag:
- spin_index:

*DESCRIPTION DES METHODES: (8)
- add_key_event(): 
- remove_key_event(): 
- on_key_press_handler(): 
- on_key_down_handler(): 
- on_key_up_handler(): 
- on_visibility_change_page_event_handler(): 
- can_current_piece_move(): 
- manage_pause(): 

*/