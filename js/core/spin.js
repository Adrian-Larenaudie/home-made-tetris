import { spin_data } from '../data/data.js';
import { utils } from '../utils/utils.js';
import { grid } from './grid.js';
import { piece } from './piece.js';

export const spin = {

    /* ------------------ PROPRIETES ---------------- */
    current_positions_copy: null,
    counter: 0,
    /* ------------------ PROPRIETES ---------------- */

    /* ------------------- METHODES ----------------- */

    init: () => {
        spin.current_positions_copy = utils.make_deep_copy_of_array(piece.current_positions);
        spin.update_counter();
    },

    update_counter: () => {
        if(spin.counter === spin_data[piece.current_type].length - 1) {
            spin.counter = 0;
        } else {
            spin.counter++;
        }
        spin.update_current_positions_copy();
    },

    update_current_positions_copy: () => {
        for(let index = 0; index < spin.current_positions_copy.length; index++) {
            spin.current_positions_copy[index].x += spin_data[piece.current_type][spin.counter][index].x;
            spin.current_positions_copy[index].y += spin_data[piece.current_type][spin.counter][index].y;
        }
        spin.check_border();
    },

    check_border: () => {
        let flag = false;
        for(let index = 0; index < spin.current_positions_copy.length; index++) {
            if(spin.current_positions_copy[index].x < 0 || spin.current_positions_copy[index].x > 279 || spin.current_positions_copy[index].y > 682) {
                flag = true;
            } 
        };
        flag ? spin.cannot_spin() : spin.check_other_positions();
    },

    check_other_positions: () => {
        let flag = false;
        for (let i = 0; i < spin.current_positions_copy.length; i++) {
            for (let j = 0; j < grid.all_positions.length; j++) {
                if(
                    spin.current_positions_copy[i].x === grid.all_positions[j].x 
                    && spin.current_positions_copy[i].y === grid.all_positions[j].y 
                    && grid.all_positions[j].used === 1
                ) {
                    flag = true;  
                }
            };        
        };
        flag ? spin.cannot_spin() : spin.can_spin();
    },

    can_spin: () => {
        piece.current_positions = utils.make_deep_copy_of_array(spin.current_positions_copy);
        piece.draw();
        grid.draw();
        spin.current_positions_copy = null;
    },

    cannot_spin: () => {
        if(spin.counter - 1 < 0) {
            spin.counter = spin_data[piece.current_type].length - 1;
        } else {
            spin.counter--;
        }
        spin.current_positions_copy = null;
    },

    /* ------------------- METHODES ----------------- */
};

/*
*DOCUMENTATION

Ce module permet de checker si la pi??ce courante peut faire une rotation
-> si c'est le cas effectuer cette rotation 
-> si ce n'est pas le cas ne rien faire

Pour faire cela, je me base sur une copie des positions de la pi??ce courante
Cette copie va ??tre modifi??e avec les valeurs qu'aurait la pi??ce courante si elle faisait la rotation demand??e
Une s??rie de check des valeurs copi??es permettra de d??terminer si cette rotation pourra avoir lieu
Si les check sont pass??s sans encombre alors on fera la rotation sur les valeurs de la pi??ce courante
Sinon on ne fera pas de rotation
Pour qu'une rotation ait lieu il faut que la pi??ce ne sorte pas de la grille et ne se trouve pas sur une position d??j?? occup??e par une autre pi??ce

*DESCRIPTION DES PROPRIETES: (2)

- current_positions_copy: permet de stocker une copie des positions de la pi??ce courante
- counter: le compteur qui permet de savoir sur quelle position nous nous trouvons pour la pi??ce courante
(0 ??tant la position par d??faut, cette valeur fait r??f??rence ?? l'index du tableau spin_data qui se trouve dans le fichier /data/data.js)

*DESCRIPTION DES METHODES: (7)

- init(), m??thode qui initie le processus de rotation de la pi??ce courante:
    - on va faire une copie "profonde" des positions de la pi??ce courante et les stocker dans la propri??t?? current_positions_copy
    - on va mettre ?? jour le compteur en appellant la m??thode update_counter()

- update_counter(), permet de mettre ?? jour la valeur de la propri??t?? counter:
    - on check si la valeur du compteur est ??gal au dernier index du tableau des rotations de la pi??ce courante:
        - si oui on met le compteur ?? 0
        - sinon on incr??mente la compteur
        - on appel la m??thode update_current_positions_copy() pour mettre ?? jour les valeurs de notre copie

- update_current_positions_copy(), permet la mise ?? jour des valeurs de la copie des positions de la pi??ce courante:
    - on va parcourir les positions courantes copi??es:
        - pour chaque position on va ajouter la valeur correspondante pr??sente dans le tableau spin_data
    - ?? ce stade on a une copie des positions courantes mis ?? jour avec les valeurs de la rotation en cours
    - on va checker si il y a une bordure avec la m??thode check_border()

- check_border(), permet de v??rifier si la copie des positions courantes apr??s rotation se trouve en dehors de la grille:
    - on d??clare un flag ?? false par d??faut
    - on parcourt la copie des positions courante qui on subit la rotation:
        - si au moins une des position de la pi??ce est en dehors de la grille on passe la flag ?? true
    - en fin de boucle si le flag est true on jouera la m??thode cannot_spin()
    - sinon ou jouera la m??thode check_other_positions()

- check_other_positions(), si on arrive dans cette m??thode c'est qu'on a valid?? le fais que la pi??ce ne sort pas de la grille,
    maintenant on veut v??rifier si la pi??ce n'est pas supperpos??e sur une pi??ce d??j?? plac??e:
    - on utilise un flag par d??faut ?? false
    - on it??re sur les positions de la copie
        - pour chaque positions de la copie on it??re sur toutes les positions de la grille
            - on check si les positions match et si la valeur used de la position de la grille est ?? 1
                - si c'est le cas alors le flag passe ?? true
    - en fin de boucle si le flag est true on jouera la m??thode cannot_spin()
    - sinon ou jouera la m??thode can_spin()

- can_spin(), si on arrive dans cette m??thode on peut faire la rotation sur la pi??ce courante en se basant sur les valeurs initialement copi??es:
    - on va copier la valeur de la copie dans current_positions de fa??on "profonde"
    - dessiner la grille
    - dessiner la pi??ce
    - et remettre ?? null les valeurs de la copie pour la prochaine rotation
    (la pi??ce a pu effectuer la rotation)

- cannot_spin(), cette m??thode est jou??e quand la pi??ce ne peut pas faire la rotation: 
    - on remet le compteur ?? la valeur qu'il poss??dait avant de tenter de faire la rotation
    - le tableau copi?? des positions de la pi??ce courantes est remis ?? null
    (la pi??ce n'a pas pu faire la rotation pour une des raisons suivantes: 
        -> elle sort de la grille si elle fait la rotation
        -> elle se retrouve sur une pi??ce d??j?? plac??e si elle fait la rotation
    )

*/