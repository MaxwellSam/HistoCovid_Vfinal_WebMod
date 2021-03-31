/*
File : readCSV.js
Author: Sam MAXWELL
Project: Barchart
Date : 23/02/2020
*/

'use strict';

/**
 * Data processing functions : *******************************************************
 * */

const COVID = 'https://www.data.gouv.fr/fr/datasets/r/57d44bd6-c9fd-424f-9a72-7834454f9e3c';

function ParseCSV(text, sep) {
    //  parse (texte -> arr d'objets) les donnees si elles sont en format csv
    const rows = text.replaceAll('"', '').split('\n');
    const headers = rows[0].split(sep);
    let dataset = [];
    for (let i = 1; i < rows.length - 1; i++) { //  -1 car le dernier element du csv est un objet avec une str vide
        const words = rows[i].split(sep);
        let obj = {};
        for (let j = 0; j < words.length; j++) {
            let w = words[j];
            obj[headers[j]] = (isNaN(w)) ? w : parseFloat(w);
        }
        dataset.push(obj);
    }
    return dataset;
}

function CleanData (dataset, num_region){
    // take the data from one specific region 
    let cleanRegion = [];
    for (let stat of dataset){
        const numReg = stat.numReg;
        if (numReg === num_region){
            cleanRegion.push(stat); 
        }
    }
    return cleanRegion;
}

function ConvertData (dataset){
    
    // convert data to an object with x => month and y => mean of variable for the month
    let t = {x:[],y:[]};
    let compt = 0;
    t.x.push(dataset[0].jour.slice(2,7)); // YYYY-MM
    t.y.push(0);
    for(let stat of dataset){
        const prev_x = t.x[t.x.length -1];
        if (stat.jour.slice(2,7)===prev_x){
            t.y[t.x.length - 1] += parseInt(stat.P);
            compt +=1;
        } else {
            t.y[t.y.length - 1] = Math.round(t.y[t.y.length - 1]/compt);
            compt = 0; 
            t.x.push(stat.jour.slice(2,7));
            t.y.push(parseInt(stat.P));
        }    
    }
    t.y[t.y.length - 1] = Math.round(t.y[t.y.length - 1]/compt);
    return t;
}

/**
 * Fetch function : *****************************************************************
 * */

async function FetchData(){
    const response = await fetch(COVID);
    const raw = await response.text();
    const covid = ParseCSV (raw, ';');
    const dataset = ConvertData(covid); 
    BarChart(dataset, layout);
}




