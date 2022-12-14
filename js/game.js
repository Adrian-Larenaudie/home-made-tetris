import { user_input } from "./core/user_input.js";
import { grid } from "./core/grid.js";
import { piece } from "./core/piece.js";
import { end_positions, speed } from "./data/data.js";
import { scoring } from "./core/scoring.js";
import { song } from './utils/song.js';

export const game = {
    /* ------------------ PROPRIETES ---------------- */
    over: false,
    running: false,
    interval: null,
    speed: speed.current,
    end_positions: end_positions,
    button: document.querySelector('.launch_button'),
    modal: document.querySelector('.modal'),
    pause_modal: document.querySelector('.modal_pause'),
    pause: false,
    /* ------------------ PROPRIETES ---------------- */

    /* ------------------- METHODES ----------------- */
    init: () => {
        game.running = false;
        song.init();
        scoring.init();
        grid.generate_values();
        grid.draw(); 
        game.modal.style.visibility = 'visible'; 
        game.button.addEventListener('click', (event) => {
            game.running = true;
            clearInterval(game.interval);
            game.speed = speed.current;
            piece.current_positions = null,
            piece.current_type = null,
            piece.current_color = null,   
            game.modal.style.visibility = 'hidden';
            game.launch_game();
        })
    },

    launch_game: () => { 
        piece.get_random_type();    
        game.interval = setInterval(game.on_move, game.speed);
        user_input.add_key_event();
    },

    on_move: () => {
        let move = true;

        piece.starting_positions[piece.current_type].forEach((sarting_position) => {
            grid.all_positions.forEach((grid_position) => {
                if(grid_position.x === sarting_position.x && grid_position.y === sarting_position.y && grid_position.used === 1) {
                    //* si c'est le cas on clear l'interval
                    move = false
                    game.over = true; 
                }
            });
        });

        game.end_positions.forEach((stop_position) => {
            piece.current_positions.forEach((current_position) => {
                if(current_position.x === stop_position.x && current_position.y === stop_position.y) {
                    move = false
                    clearInterval(game.interval);  
                }
            });
        });

        piece.current_positions.forEach((current_position) => {
            grid.all_positions.forEach((grid_position) => {
                if(grid_position.x === current_position.x && grid_position.y === (current_position.y + 31) && grid_position.used === 1) {
                    move = false;
                    clearInterval(game.interval);  
                }
            });
        });

        if(move){
            piece.current_positions.forEach((current_position) => {
                current_position.y += 31;
            });
            grid.draw();
            piece.draw(piece.current_type);
        } else if(!game.over) {
            grid.seat_piece();
        } else {
            scoring.set_best_score();
            game.over = false;    
            user_input.remove_key_event();
            document.querySelector('.modal_title').textContent = 'Game Over!';
            game.init();
        }
    },
    /* ------------------- METHODES ----------------- */
};

//* LET'S GOO!
game.init();
// cet event est appel?? une fois et d??tectera le changement de page pour activer une pause si le jeu est lanc??
user_input.on_visibility_change_page_event_handler();

/* 
*DOCUMENTATION

game.js est le fichier principal.

On retrouve une partie importation des diff??rents objets contenus dans diff??rents fichiers:
- user_input.js permet la gestion des inputs utilisateur
- grid.js permet de g??n??rer les positions de la dessiner et de placer une pi??ce arriv??e en bout de parcours
- piece.js permet de g??n??rer une pi??ce al??atoirement et de la dessiner puis de la redessiner tout au long de son parcours
- data.js regroupe un certain nombre de donn??es sp??cifiques pour faciliter leur pilotage
- scoring.js permet la gestion du score de la partie courante et l'interaction avec le local storage pour stocker, update et ou r??cup??rer le meilleure score
TODO - song.JS permet la gestion du son (fonctionnalit?? ?? faire)

Ensuite nous avons la partie qui contient notre objet game dans lequel on retrouve plusieurs propri??t??s et m??thodes.

Les propri??t??s vont nous permettre de d??terminer un ??tat et les m??thodes de modifier cet ??tat.

*DESCRIPTION DES PROPRIETES: (8)

- running: bool??en qui d??termine si la partie est en cours ?? (true) ou non ?? (false)
- over,  bool??en qui d??termine si la partie est termin??e ou non
- interval: qui va recevoir le setInterval du jeu (permet de g??rer le parcous d'une pi??ce jusqu'?? son positionnement)
- speed: d??finit la vitesse de d??placement de la pi??ce (set interval)
- end_positions: regroupe les positions de la derni??re ligne de la grille
- button: re??oit l'??l??ment du DOM qui permet de lanc?? la partie lors du clique sur cet ??l??ment
- modal: re??oit l'??l??ment du DOM qui contient la boite modale affich?? en d??but et fin de partie
- pause_modal: re??oit l'??l??ment du DOM qui contient la boite modale affich??e lors d'une pause
- pause: bool??en qui d??finit si la pause est activ??e ou non

*DESCRIPTION DES METHODES: (3)

- init() permet d'initialiser une partie, on va y appeler plusieurs m??thodes et effectuer diff??rentes actions:
    - running est pass?? ?? false la partie n'est pas lanc??e
    - initialisation du module scoring.js
    - g??n??ration des valeurs de la grille et de leurs attributs
    - dessin de la grille dans la balise canvas ?? l'aide des valeurs g??n??r??es juste avant
    - affichage de la modale de lancemant de partie
    - ajout de l'event click sur le bouton de lancement de partie. Au click sur ce bouton:
        - le bool??en running passe ?? true la partie est lanc??e
        - on clear l'interval pr??c??dant (pour le cas ou la partie a ??t?? relanc??e)
        - on d??finit la vitesse du jeu ?? l'aide des datas
        - on d??finit les valeurs de la pi??ce courante: (les valeurs de la pi??ce sont toutes ?? null puisque la pi??ce courante n'a pas encore ??t?? g??n??r??e)
            - les positions de la pi??ce courante re??oit null pour valeur 
            - le type de pi??ce courante re??oit null pour valeur 
            - la couleur de la pi??ce courante re??oit null pour valeur  
        - on cache la modale
        - on appel la m??thode qui lance la partie

- launch_game(), permet de lancer la partie, d??tail des instructions:
    - on appel la m??thode du module piece.js qui permet de r??cup??rer une pi??ce al??atoirement parmis les 7 possibles
    - on stock notre interval dans la propri??t?? interval ce qui nous permettra de la stopper facilement, l'interval appelera la m??tode on_move toute les game.speed millisecondes
    - on appel la m??thode du module user_inputs.js qui permet d'activer les ??v??nement sur les inputs utilisateur

- on_move(), permet de g??rer tout le parcours de la pi??ce courante:
    - on a d'abord un flag nomm?? move, pass?? par d??faut ?? true et qui d??termine si la pi??ce courante peut se d??placer ?? true ou pas ?? false
    - ensuite on a 3 bloques de v??rifications qui vont changer ou non notre flag:
        - 1er bloque: check si une des positions de d??part de notre pi??ce est la m??me qu'une pi??ce d??j?? plac??e:
            - pour cela on parcourt toutes les positions de d??part de notre pi??ce courante
            - pour chacune de ces positions on va parcourir toute la grille
            - si la position de d??part match avec la position de la grille et que la valeur used est ?? 1 (signifie que la case est occup??e par une pi??ces d??j?? plac??e)
            - on change le flag move ?? false
            - on passe la valeur de game.over ?? true
        - 2??me bloque: check si une des positions de la pi??ce courante arrive sur une des positions de la derni??re ligne de la grille:
            - on parcourt le tableau des positions de la derni??re ligne de la grille
            - pour chacune de ces positions on va parcourir toutes les positions de la pi??ce courante
            - si la la position de la pi??ce courante match avec la position de la derni??re ligne de la grille
            - on change notre flag move ?? false
            - on clear l'interval en cours
        3??me bloque: check si une des position de la pi??ce courante se trouve sur la case juste avant une case occup??e par une pi??ce d??j?? plac??e:
            - on parcourt toutes les position de la pi??ce courante
            - pour chacune des ces positions on va parcourir toute la grille
            - pour v??rifier si il y a un match on va anticiper la valeur qu'aura la positions de la pi??ce courante lors de son prochain d??placement on peut le traduire comme ceci:
                - si la position courante de la pi??ce + une case vers le bas match avec la position de la grille et que la position de la grille est occup??e par une pi??ce qui est d??j?? plac??e
                - alors on passe notre flag move ?? false
                - et on clear notre interval
    - apr??s avoir fait toutes ces v??rifications on va checker si le flag move est ?? true:
        - si il est true:
            - on parcourt toutes les positions de la pi??ce courante et on leur ajoute la valeur d'une case vers le bas
            - on redessine la grille
            - on redessine la pi??ce avec ses nouvelles positions
        - si game.over est true:
            - on appel la m??thode seat_piece() du module grid.js (nous permettra de placer la pi??ce dans l'objet des positions de la grille)
        - sinon dans la cas ou seulement le flag move est false:
            - on appel la m??thode set_best_score() du module scoring.js qui mettra ?? jour le meilleure score en local storage
            - on remet la valeur du bool??en game.over ?? false
            - on appel la m??thode remove_key_event() du module user_input.js pour d??sactiver les inputs utilisateur
            - on modifie le titre de la modale par Game Over!
            - on appel notre m??thode game.init() 
            - la boucle est boucl??e le user peut relancer une partie

    * --> RDV dans les autres fichiers pour des explications similaires <-- *
*/
