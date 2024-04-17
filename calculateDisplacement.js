function calculate(mode = 0) {
    var cylinders = parseFloat(document.getElementById('cylinders').value) || 0;
    var diameter = parseFloat(document.getElementById('diameter').value) || 0;
    var stroke = parseFloat(document.getElementById('stroke').value) || 0;

    var newBoreUnit = document.getElementById('selectNewBore').value;
    var newDiameter = parseFloat(document.getElementById('NewDiameter').value) || 0;

    var newStrokeUnit = document.getElementById('selectNewStroke').value;
    var newStroke = parseFloat(document.getElementById('NewStroke').value) || 0;

    var newResult = parseFloat(document.getElementById('newResult').value) || 0; // 新的排量

    var math = 0.0007854; // 用於體積計算的數學常數

    var rpm = parseFloat(document.getElementById('rpm').value) || 10000; // 轉速

    var boreSquare = diameter * diameter;
    var cap = boreSquare * stroke * math * cylinders;

    var mps = (2 * stroke * rpm) / 60 / 1000;


    // 處理新的缸徑和行程
    if (newBoreUnit == 0) {
        if (newDiameter == 0) {
            diameter = diameter;
        } else if (newDiameter > 0) {
            diameter = newDiameter;
        }
    } else if (newBoreUnit == 1) {
        diameter += newDiameter * 0.01 || 0;
    }

    if (newStrokeUnit == 0) {
        stroke += newStroke * 0.01 || 0;
    } else if (newStrokeUnit == 1) {
        if (newStroke == 0) {
            stroke = stroke;
        } else if (newStroke > 0) {
            stroke = newStroke;
        }
    }

    var newBoreSquare = diameter * diameter;
    var newCap = newBoreSquare * stroke * math * cylinders;

    var difference = (newCap / cap) || 0;
    var differencePercent = ((newCap - cap) / cap * 100) || 0;

    var newmps = (2 * stroke * rpm) / 60 / 1000;

    // 顯示結果
    document.getElementById('result').innerText = cap.toFixed(2) + ' cc';
    document.getElementById('newResult').value = newCap.toFixed(2);
    document.getElementById('difference').innerText = difference.toFixed(2) + ' 倍';
    document.getElementById('differencePercent').innerText = differencePercent.toFixed(2) + ' %';
    document.getElementById('differenceResult').innerText = (newCap - cap).toFixed(2) + ' cc';
    document.getElementById('newboremm').innerText = diameter.toFixed(2) + ' mm';
    document.getElementById('newstrokemm').innerText = stroke.toFixed(2) + ' mm';
    document.getElementById('mps').innerText = mps.toFixed(2) + ' m/s';
    document.getElementById('newmps').innerText = newmps.toFixed(2) + ' m/s';

    if (mode == 1) {
        if (newStrokeUnit == 0) { // 新的行程單位為條
            stroke += newStroke * 0.01;
        } else if (newStrokeUnit == 1) {
            stroke = newStroke;
        }

        if (newBoreUnit == 0) { // 新的缸徑單位為mm
            newDiameter = Math.sqrt((4 * newResult / cylinders) / (Math.PI * (stroke / 10))) * 10;
            document.getElementById('NewDiameter').value = newDiameter.toFixed(2);
        } else if (newBoreUnit == 1) { // 新的缸徑單位為條
            newDiameter = (Math.sqrt((4 * newResult / cylinders) / (Math.PI * (stroke / 10))) * 10) - diameter;
            document.getElementById('NewDiameter').value = newDiameter.toFixed(2);
        }
    } else if (mode == 2) {
        if (newBoreUnit == 0) { // 新的缸徑單位為mm
            diameter += newDiameter * 0.01;
        } else if (newBoreUnit == 1) {
            diameter = newDiameter;
        }

        if (newStrokeUnit == 0) { // 新的行程單位為條
            newStroke = (4 * newResult / cylinders) / (Math.PI * Math.pow(newDiameter / 10, 2)) * 10 - stroke;
            document.getElementById('NewStroke').value = newStroke.toFixed(2);
        } else if (newStrokeUnit == 1) { // 新的行程單位為mm
            newStroke = (4 * newResult / cylinders) / (Math.PI * Math.pow(newDiameter / 10, 2)) * 10;
            document.getElementById('NewStroke').value = newStroke.toFixed(2);
        }
    }
}

function newBoreUnit() {
    var unit = document.getElementById('selectNewBore').value;
    document.getElementById('newBoreUnit').innerText = unit == 0 ? 'mm' : '條';
    calculate();
}

function newStrokeUnit() {
    var unit = document.getElementById('selectNewStroke').value;
    document.getElementById('newStrokeUnit').innerText = unit == 0 ? '條' : 'mm';
    calculate();
}

function setCarSpecs(cylinders, diameter, stroke) {
    document.getElementById('cylinders').value = cylinders;
    document.getElementById('diameter').value = diameter;
    document.getElementById('stroke').value = stroke;
    calculate();
}

function clearInputs() {
    document.getElementById('cylinders').value = '';
    document.getElementById('diameter').value = '';
    document.getElementById('stroke').value = '';
    document.getElementById('NewDiameter').value = '';
    document.getElementById('NewStroke').value = '';
    document.getElementById('rpm').value = '10000';
    calculate();
}
