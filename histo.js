/*
Author: Sam MAXWELL
Project: Barchart
Date : 23/02/2020
*/

/**
 * Functions Barchart : *******************************************************
 * */

function BarChart (dataset, layout){
    // SVG setting : 
    var mySVG = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    mySVG.style.width = `${layout.width}px`; 
    mySVG.style.height = `${layout.height}px`;
    mySVG.id = 'image1';

    var container = document.getElementById("graphic");
    container.appendChild(mySVG);

    // Prepare useful objects :
    const layout2 = CalcLayout2(layout); // new layout
    console.log(layout2); 
    const dim = CalcDimenssions(dataset, layout2); // dimenssions 
    const data = PrepareDataset(dataset, dim); // data prepared
    console.log(dim);
	// Draw bar-chart :  
    DrawBars(data, layout2, dim, mySVG); 
    DrawAxisLines(dim.x_min, dim.x_max, dim.y_min, dim.y_max, 'grey', mySVG);
    AddGrad(layout2, dim, 'grey', mySVG);

}

/**
 * Processing Function : ******************************************************  
 */

function PrepareDataset (dataset, dim){
    const list_Grp = Object.values(dataset)[0];
    const list_val_R = Object.values(dataset)[1];
    const list_val_G = []; 
    for (let val_R of list_val_R){
        val_G = ConvertValRtoG (val_R, dim);
        list_val_G.push(val_G);
    }
    return {
        Grp : list_Grp,
        VR : list_val_R,
        VG : list_val_G
    }
}

function ConvertValRtoG (val_R, dim) {
    // Convert a value in real life to the value on the graphic : 
    const val_G = (dim.h_max_graph*val_R)/dim.h_max_real; // valueTheor = (h_max_graph * valueReal) / h_max_real
    return val_G;
}

function CalcDimenssions (dataset, layout){
    // values of internal square dimenssions (which will containe bars)
    const width_int = layout.width - layout.margin[3] - layout.margin[1];
    const height_int = layout.height - layout.margin[0] - layout.margin[2];
    // calculating the bar's widht (≠ to rect's width depending on mode vertical/horizontal)
    const nbrOfvalues = Object.values(dataset)[0].length;
    const sumBarMargin = Sum(layout.barmargin);
    const h_max_real = Math.max(...Object.values(dataset)[1]);
    var w_bars = 0;
    var h_max_graph = 0;
    console.log('ok');
        // calculate w_bars and h_max_graph according to the mode : 
    if (layout.mode === "vertical"){
        console.log('ok');
        w_bars += (width_int - (sumBarMargin*nbrOfvalues))/nbrOfvalues;
        h_max_graph += layout.height - layout.margin[0] - layout.margin[2]; 
    }
    if (layout.mode === 'horizontal'){
        w_bars += (height_int - (sumBarMargin*nbrOfvalues))/nbrOfvalues;
        h_max_graph += layout.width - layout.margin[1] - layout.margin[3];
    }
    // calculate x/y min and max (for axis)
    const xmin = layout.margin[3]; // x1 (ctd left)
    const xmax = layout.width-layout.margin[1]; // x2 (ctd right)
    const ymin = layout.margin[0]; // y1 (ctd up)
    const ymax = layout.height - layout.margin[2]; // y2 (ctd dawn)

    return {
        w_int : width_int,
        h_int : height_int,
        w_bars : w_bars,
        h_max_real : h_max_real,
        h_max_graph : h_max_graph,
        x_min : xmin, 
        x_max : xmax, 
        y_min : ymin, 
        y_max : ymax
    }
}

function CalcLayout2 (layout){
    // calc a new layout with the new margin
    return {
        mode : layout.mode,
        width : layout.width,
        height : layout.height,
        margin : [layout.margin[0], layout.margin[1]+10, layout.margin[2]+30, layout.margin[3]+30],  // N, E, S, W
        barmargin : layout.barmargin
    }
}

/**
 * Drawing Functions : *********************************************************
 */

function AddGrad (layout, dim, color, mySVG){

    if (layout.mode === 'vertical'){
        let k = dim.h_max_real;
        for (let i = layout.margin[0]; i <= layout.margin[0]+dim.h_int; i += dim.h_int*0.10){
            DrawGrad(dim.x_min-3, dim.x_min+3, i, i, color, mySVG);
            AddTxt(Math.round(k), dim.x_min-7, i+5, 'text-anchor: end; alignment-baseline: middle',mySVG);
            k -= dim.h_max_real*0.10;
        }
    }
    if (layout.mode === 'horizontal'){
        let k = 0;
        for (let i = layout.margin[3]; i <= layout.margin[3]+dim.w_int; i += dim.w_int*0.10){
            DrawGrad(i, i, dim.y_max-3, dim.y_max+3, color, mySVG);
            AddTxt(Math.round(k), i, dim.y_max+20, 'text-anchor: middle; alignment-baseline: middle', mySVG);
            k += dim.h_max_real*0.10; 
        }
    }
} 

function DrawGrad (x1, x2, y1, y2, color, mySVG){
    var grad = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        grad.setAttribute('x1', `${x1}`);
        grad.setAttribute('y1', `${y1}`);
        grad.setAttribute('x2', `${x2}`);
        grad.setAttribute('y2', `${y2}`);
        grad.setAttribute('stroke', color);
        grad.setAttribute('stroke-width',2);
        mySVG.appendChild(grad);
}

function DrawBars (data, layout, dim, mySVG){
    if (layout.mode === 'vertical'){

        var x_coord = layout.margin[3];
        const real_zero = layout.height - layout.margin[2]; // theorical y = 0, considering margins 
        
        for (let i=0; i<data.VR.length; i++){
            let  y_coord = real_zero-data.VG[i]; // y possition for the bar on the graph
            x_coord += layout.barmargin[0]+layout.barmargin[1];
            DrawRect(x_coord, y_coord, dim.w_bars, data.VG[i], 'aquamarine', mySVG);
            AddTxt(data.Grp[i], x_coord+(dim.w_bars/2), layout.height+20-layout.margin[2], 'text-anchor: middle; alignment-baseline: middle', mySVG);
            x_coord += dim.w_bars+layout.barmargin[2]+layout.barmargin[3];
        }
    }
    if (layout.mode === 'horizontal'){
        var y_coord = layout.margin[0];
        const x_coord = layout.margin[3];

        for (let i=0; i<data.VR.length; i++){
            y_coord += layout.barmargin[0]+layout.barmargin[1];
            DrawRect(x_coord, y_coord, data.VG[i], dim.w_bars, 'aquamarine', mySVG);
            AddTxt(data.Grp[i], x_coord-7, y_coord+(dim.w_bars/2), 'text-anchor: end; alignment-baseline: middle', mySVG)
            y_coord+= dim.w_bars+layout.barmargin[2]+layout.barmargin[3];
        }
    }
}

function DrawAxisLines (x1, x2, y1, y2, color, mySVG){
    // draw the y Axis line : 
    var yAxis_line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis_line.setAttribute('x1', `${x1}`);
    yAxis_line.setAttribute('y1', `${y1}`);
    yAxis_line.setAttribute('x2', `${x1}`);
    yAxis_line.setAttribute('y2', `${y2}`);
    yAxis_line.setAttribute('stroke', color);
    yAxis_line.setAttribute('stroke-width',2);
    mySVG.appendChild(yAxis_line);

    // draw the x Axis line : 
    var xAxis_line = document.createElementNS("http://www.w3.org/2000/svg", "line");    
    xAxis_line.setAttribute('x1', `${x1}`);
    xAxis_line.setAttribute('y1', `${y2}`);
    xAxis_line.setAttribute('x2', `${x2}`);
    xAxis_line.setAttribute('y2', `${y2}`);
    xAxis_line.setAttribute('stroke', color);
    xAxis_line.setAttribute('stroke-width',2);
    mySVG.appendChild(xAxis_line);
}

/**
 * Functions tools : ***********************************************************
 * */                 

function Sum (array){
    let sum = 0
    for (let num of array){
        sum += num;
    }
    return sum;
}

function DrawRect (x, y, w, h, color, mySVG) {
    // draw a rect : 
    var myRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    myRect.setAttribute('x', `${x}`);
    myRect.setAttribute('y', `${y}`);
    myRect.setAttribute('width', `${w}`);
    myRect.setAttribute('height', `${h}`);
    myRect.setAttribute('Fill', color)
    console.log('myRect', myRect);

    mySVG.appendChild(myRect)
}

function AddTxt (txt, x, y, style, mySVG){
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    text.setAttribute('x', `${x}`); 
    text.setAttribute('y', `${y}`);
    text.setAttribute('style', style);
    text.setAttribute('front-family', 'sans-serif');
    text.setAttribute('front-size', '12');

    var textNode = document.createTextNode(txt);
    text.appendChild(textNode);
    document.getElementById('image1').appendChild(text);
}