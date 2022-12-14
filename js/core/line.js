import { game } from "../game.js";
import { utils } from "../utils/utils.js";
import { grid } from "./grid.js";
import { piece } from "./piece.js";
import { scoring } from "./scoring.js";

export const line = {

    init: () => {
        line.make_array_of_rows();
    },

    make_array_of_rows: () => {
        const all_positions_copy = utils.make_deep_copy_of_array(grid.all_positions);
        let columns_counter = 0;
        let rows_array = [];
        let current_row_array = [];
        for (let i = 0; i < all_positions_copy.length; i++) {
            if(i == all_positions_copy.length - 1) {
                current_row_array.push(all_positions_copy[i]);
                rows_array.push(current_row_array);
                current_row_array = [];
            } else if(all_positions_copy[i].line_number == columns_counter) {
                current_row_array.push(all_positions_copy[i]);
            } else {
                columns_counter++;
                rows_array.push(current_row_array);
                current_row_array = [];
                current_row_array.push(all_positions_copy[i]);
            }
        }
        line.check_and_delete(rows_array);
   },

    check_and_delete: (rows_array) => {
        let flag = true;
        for (let i = 0; i < rows_array.length; i++) {
            for (let j = 0; j < rows_array[i].length; j++) {
                if (rows_array[i][j].used === 0) {
                    flag = false;
                }        
            }
            if(flag) {
                scoring.completed_lines++;
                scoring.update_score();
                if (i != 0) {
                    for (let k = i; k > 0; k--) {
                        if(k > 0) {
                            for (let row = 0; row < rows_array[k].length; row++) {
                                rows_array[k][row].used = rows_array[k - 1][row].used;
                                rows_array[k][row].color = rows_array[k - 1][row].color;      
                            }
                        }                    
                    }
                } else {
                    for (let j = 0; j < rows_array[i].length; j++) {
                        rows_array[i][j].used = 0
                        j % 2 === 0 ? rows_array[i][j].color = '#dbdbdb' : rows_array[i][j].color = '#cecece';                 
                    }   
                }
            }
            flag = true;    
        }
        grid.all_positions = utils.make_deep_copy_of_array(rows_array.flat());
        grid.draw();
        piece.get_random_type();
        game.interval = setInterval(game.on_move, game.speed);      
    },

};


/*
*DOCUMENTATION

ce fichier sert ?? g??rer la compl??tion de ligne: 
le fonctionnemant est le suivant:
-> on va d'abord copier le tableau de toutes les positions de la grille
-> on va op??rer un traitemant sur ce tableau pour faire en sorte qu'il ne contienne que des sous tableaux:
(chaque sous tableau repr??sente une ligne de la grille)
-> ?? partir de ce tableau de sous tableau, on va checker pour chaque sous tableau (ligne), si la ligne courante est compl??te
-> quand c'est le cas on va donner r??troactivement la valeur de la ligne du dessus ?? la ligne courante
-> pour cela on va parcourir le tableau des lignes ?? l'envers ?? partir de la ligne qui est compl??te (afin de remonter vers la 1ere ligne de la grille)
-> dans le cas ou la ligne compl??te est la premi??re ligne de la grille, on ne peut pas lui donner la valeur de la ligne du dessus
puisqu'elle est inexistante: on va donc simplement lui redonner les valeurs par d??faut avant qu'il y ait des pi??ces plac??es sur cette ligne

*DESCRIPTION DES PROPRIETES: (0)

Aucune propri??t??s dans ce module

*DESCRIPTION DES METHODES: (3)

- init(), cette m??tode va simplement initialiser le module en appellant la m??thode make_array_of_rows()

- make_array_of_rows(), cette m??thode retourne un tableau contenant pour chaque ligne de la grille un sous tableau des positions de cette ligne:
    - on commence par faire une copie "profonde" du tableau de toutes les positions
    - on a besoin de compter le nombre de colonnes (10 par ligne), variable: (columns_counter)
    - on veut stocker toutes les lignes dans un tableau ?? part, variable: (rows_array)
    - chaque ligne courante sera stock??e dans un tableau provisoire, variable: (current_row_array)
    - on it??re sur la copie du tableau de toutes les positions:
        - si on arriva ?? la derni??re it??raition
            - on va ajouter cette position dans le tableau (current_row_array)
            - on ajoute la ligne compl??t??e contenu dans (current_row_array) dans le tableau des (rows_array)
            - on vide le tableau (current_row_array)
        - sinon si la valeur du compteur de colonne est ??gal ?? la valeur de la propri??t?? line_number:
        (ici line_number est la propri??t?? du tableau copi?? de toutes les position ?? l'index courant)
            - on push la position courante dans le tableau de la ligne courante: (current_row_array)
        - sinon:
            - on incr??mente le compteur de colonne: (columns_counter)
            - on ajoute la ligne courante compl??t??e: (current_row_array), dans le tableau des lignes: (rows_array)
            - on vide le tableau de la ligne courante: (current_row_array)
            - on d??bute une nouvelle ligne courante: (current_row_array) en lui ajoutant la position courante
    - on appel la m??thode check_and_delete(), en lui passant en param??tre, le tableau qui contient toutes les ligne de la grille, (sous forme de sous tableaux)

- check_and_delete(), cette m??thode permet de v??rifier si il y a des lignes compl??tes, 
    de les supprimer, de faire descendre en cons??quence les lignes incompl??tes du dessus, puis de redessiner la grille: 
    - on a besoin d'un flag pour savoir si la ligne est compl??te ou non: (flag = true par d??faut)
    - on va it??rer sur toutes les lignes du tableau des lignes: 
        - pour chaque ligne on va parcourir chaque cases la composant:
            - si au moins un des index n'a pas sa valeur used ?? 1, on met le flag ?? false (la ligne n'est pas compl??te)
        - si le flag est true: (la ligne courante est compl??te):
            - on met ?? jour le score en ajoutant une ligne compl??te et en appelant la m??thode update_score()
            - si on n'est pas en train de parcourir la 1ere ligne de la grille:
                - on a une ligne compl??te ?? l'index i, on va lui donner la valeur de la ligne du dessus 
                (mais il faut l'appliquer retroactivement aux autres lignes du dessus)
                - on sait que i est aussi ??gal ?? la valeur du nombre de ligne, on va donc parcourir i ?? l'envers:
                (on va utiliser l'index k pour parcourir les lignes du dessus)
                    - et dire que la ligne k prend la valeur de la ligne k - 1 sauf si la ligne k est la 1??re du tableau
                        - on fait en sorte d'attribuer la bonne valeur used et la bonne couleur
            - si on parcourt la 1ere ligne:
                - on parcourt les cases de la ligne
                - on redonne ?? la case la valeur used ?? 0
                - et donne ?? la case la couleur gris ou gris claire selon si l'index est impair ou pair
        - si le flag est false: (la ligne courante est incompl??te):
            - on ne fait rien
        -  on remet la valeur initial du flag ?? true
    - quand on arrive ici on a finit d'it??rer sur toutes les lignes et on a mis ?? jour ses valeurs: (en fonction des lignes compl??tes)
    - on va donc d??verser le contenu du tableau des lignes dans le tableau original de toutes les positions
    (en prenant soin d'appliquer la m??thode .flat() pour que les sous tableaux ne fassent plus qu'un tableau)
    - on redessine la grille avec nos nouvelles valeurs
    - puis on r??cup??re une pi??ce al??atoirement
    - enfin on relance un interval pour que la nouvelle pi??ce se d??place
*/
 