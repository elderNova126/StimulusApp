#!/bin/bash
# Bash Menu Script Example

PS3='Please enter your choice: '
options=("El contador script" "Twister script" "FBI script" "Global Project Loader" "Quit")
select opt in "${options[@]}"[0]
do
    case $opt in
        "El contador script")
            echo "############################################"
            echo "El contador script"
            node ./Contador/run.js
            ;;
        "Twister script")
            echo "############################################"
            echo "Twister script"
            node ./Twister/Twister.js
            ;;
        "FBI script")
            echo "############################################"
            echo "FBI script"
            # node ./Contador/run.js
            exit
            ;;
            "Global Project Loader")
            echo "############################################"
            echo "FBI script"
             node ./GlobalProjectLoader/Loader.js
            exit
            ;;
        "Quit")
            echo "############################################"
            echo "Close script"
            exit
            ;;
        *) echo "invalid option";;
    esac
done