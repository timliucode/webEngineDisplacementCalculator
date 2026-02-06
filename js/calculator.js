/**
 * Engine Displacement Calculator
 * Calculates engine displacement and related metrics for motorcycle modifications
 */

// Constants
const CALCULATION_MODE = {
    DISPLACEMENT: 0,
    BORE: 1,
    STROKE: 2
};

const UNIT_TYPE = {
    ABSOLUTE: 0,  // Absolute value (mm)
    RELATIVE: 1   // Relative change (條/increments)
};

const VOLUME_CONVERSION_FACTOR = 0.0007854; // π/4 / 1000 for converting mm³ to cc
const MILLISECONDS_PER_MINUTE = 60000;
const DEFAULT_RPM = 10000;

// DOM Element Accessors
const elements = {
    // Input fields
    cylinders: () => document.getElementById('cylinders'),
    diameter: () => document.getElementById('diameter'),
    stroke: () => document.getElementById('stroke'),
    newDiameter: () => document.getElementById('NewDiameter'),
    newStroke: () => document.getElementById('NewStroke'),
    combustionChamber: () => document.getElementById('combustionChamber'),
    rpm: () => document.getElementById('rpm'),
    newDisplacement: () => document.getElementById('newResult'),
    
    // Select dropdowns
    selectNewBore: () => document.getElementById('selectNewBore'),
    selectNewStroke: () => document.getElementById('selectNewStroke'),
    
    // Output fields
    result: () => document.getElementById('result'),
    compressionRatio: () => document.getElementById('compressionRatio'),
    newBoreMm: () => document.getElementById('newboremm'),
    newStrokeMm: () => document.getElementById('newstrokemm'),
    difference: () => document.getElementById('difference'),
    differencePercent: () => document.getElementById('differencePercent'),
    differenceResult: () => document.getElementById('differenceResult'),
    pistonSpeed: () => document.getElementById('mps'),
    newPistonSpeed: () => document.getElementById('newmps'),
    
    // Unit labels
    newBoreUnit: () => document.getElementById('newBoreUnit'),
    newStrokeUnit: () => document.getElementById('newStrokeUnit')
};

/**
 * Get numeric value from input element, returns 0 if invalid
 * @param {HTMLElement} element - Input element
 * @returns {number} Parsed value or 0
 */
function getNumericValue(element) {
    return parseFloat(element.value) || 0;
}

/**
 * Calculate engine displacement in cc
 * @param {number} cylinders - Number of cylinders
 * @param {number} bore - Bore diameter in mm
 * @param {number} stroke - Stroke length in mm
 * @returns {number} Displacement in cc
 */
function calculateDisplacement(cylinders, bore, stroke) {
    const boreSquare = bore * bore;
    return boreSquare * stroke * VOLUME_CONVERSION_FACTOR * cylinders;
}

/**
 * Calculate piston speed in meters per second
 * @param {number} stroke - Stroke length in mm
 * @param {number} rpm - Engine RPM
 * @returns {number} Piston speed in m/s
 */
function calculatePistonSpeed(stroke, rpm) {
    return (2 * stroke * rpm) / MILLISECONDS_PER_MINUTE;
}

/**
 * Calculate compression ratio
 * @param {number} displacement - Single cylinder displacement in cc
 * @param {number} combustionChamber - Combustion chamber volume in cc
 * @returns {number} Compression ratio
 */
function calculateCompressionRatio(displacement, combustionChamber) {
    if (combustionChamber <= 0) return 0;
    return (displacement + combustionChamber) / combustionChamber;
}

/**
 * Apply bore modification based on unit type
 * @param {number} originalBore - Original bore in mm
 * @param {number} modification - Modification value
 * @param {number} unitType - UNIT_TYPE.ABSOLUTE or UNIT_TYPE.RELATIVE
 * @returns {number} Modified bore in mm
 */
function applyBoreModification(originalBore, modification, unitType) {
    if (modification === 0) return originalBore;
    
    if (unitType === UNIT_TYPE.ABSOLUTE) {
        return modification;
    } else if (unitType === UNIT_TYPE.RELATIVE) {
        return originalBore + (modification * 0.01);
    }
    return originalBore;
}

/**
 * Apply stroke modification based on unit type
 * @param {number} originalStroke - Original stroke in mm
 * @param {number} modification - Modification value
 * @param {number} unitType - UNIT_TYPE.ABSOLUTE or UNIT_TYPE.RELATIVE
 * @returns {number} Modified stroke in mm
 */
function applyStrokeModification(originalStroke, modification, unitType) {
    if (modification === 0) return originalStroke;
    
    if (unitType === UNIT_TYPE.RELATIVE) {
        return originalStroke + (modification * 0.01);
    } else if (unitType === UNIT_TYPE.ABSOLUTE) {
        return modification;
    }
    return originalStroke;
}

/**
 * Calculate required bore for target displacement
 * @param {number} targetDisplacement - Target displacement in cc
 * @param {number} cylinders - Number of cylinders
 * @param {number} stroke - Stroke length in mm
 * @returns {number} Required bore in mm
 */
function calculateRequiredBore(targetDisplacement, cylinders, stroke) {
    return Math.sqrt((4 * targetDisplacement / cylinders) / (Math.PI * (stroke / 10))) * 10;
}

/**
 * Calculate required stroke for target displacement
 * @param {number} targetDisplacement - Target displacement in cc
 * @param {number} cylinders - Number of cylinders
 * @param {number} bore - Bore diameter in mm
 * @returns {number} Required stroke in mm
 */
function calculateRequiredStroke(targetDisplacement, cylinders, bore) {
    return (4 * targetDisplacement / cylinders) / (Math.PI * Math.pow(bore / 10, 2)) * 10;
}

/**
 * Update display values with calculated results
 * @param {Object} results - Calculation results
 */
function updateDisplay(results) {
    elements.result().innerText = `${results.originalDisplacement.toFixed(2)} cc`;
    elements.newDisplacement().value = results.modifiedDisplacement.toFixed(2);
    elements.difference().innerText = `${results.ratio.toFixed(2)} 倍`;
    elements.differencePercent().innerText = `${results.percentChange.toFixed(2)} %`;
    elements.differenceResult().innerText = `${results.absoluteChange.toFixed(2)} cc`;
    elements.newBoreMm().innerText = `${results.modifiedBore.toFixed(2)} mm`;
    elements.newStrokeMm().innerText = `${results.modifiedStroke.toFixed(2)} mm`;
    elements.pistonSpeed().innerText = `${results.originalPistonSpeed.toFixed(2)} m/s`;
    elements.newPistonSpeed().innerText = `${results.modifiedPistonSpeed.toFixed(2)} m/s`;
    
    if (results.compressionRatio > 0) {
        elements.compressionRatio().innerText = `${results.compressionRatio.toFixed(2)} : 1`;
    } else {
        elements.compressionRatio().innerText = 'N/A';
    }
}

/**
 * Main calculation function
 * @param {number} mode - Calculation mode (CALCULATION_MODE enum)
 */
function calculate(mode = CALCULATION_MODE.DISPLACEMENT) {
    // Get input values
    const cylinders = getNumericValue(elements.cylinders());
    const originalBore = getNumericValue(elements.diameter());
    const originalStroke = getNumericValue(elements.stroke());
    const combustionChamber = getNumericValue(elements.combustionChamber());
    const rpm = getNumericValue(elements.rpm()) || DEFAULT_RPM;
    
    const newBoreUnitType = parseInt(elements.selectNewBore().value);
    const newBoreValue = getNumericValue(elements.newDiameter());
    
    const newStrokeUnitType = parseInt(elements.selectNewStroke().value);
    const newStrokeValue = getNumericValue(elements.newStroke());
    
    const targetDisplacement = getNumericValue(elements.newDisplacement());
    
    // Calculate original displacement and piston speed
    const originalDisplacement = calculateDisplacement(cylinders, originalBore, originalStroke);
    const originalPistonSpeed = calculatePistonSpeed(originalStroke, rpm);
    
    // Apply modifications
    let modifiedBore = applyBoreModification(originalBore, newBoreValue, newBoreUnitType);
    let modifiedStroke = applyStrokeModification(originalStroke, newStrokeValue, newStrokeUnitType);
    
    // Handle specific calculation modes
    if (mode === CALCULATION_MODE.BORE) {
        // Recalculate stroke for bore calculation
        modifiedStroke = applyStrokeModification(originalStroke, newStrokeValue, newStrokeUnitType);
        
        const requiredBore = calculateRequiredBore(targetDisplacement, cylinders, modifiedStroke);
        
        if (newBoreUnitType === UNIT_TYPE.ABSOLUTE) {
            elements.newDiameter().value = requiredBore.toFixed(2);
        } else if (newBoreUnitType === UNIT_TYPE.RELATIVE) {
            const boreChange = requiredBore - originalBore;
            elements.newDiameter().value = boreChange.toFixed(2);
        }
        
        modifiedBore = requiredBore;
        
    } else if (mode === CALCULATION_MODE.STROKE) {
        // Recalculate bore for stroke calculation
        modifiedBore = applyBoreModification(originalBore, newBoreValue, newBoreUnitType);
        
        const requiredStroke = calculateRequiredStroke(targetDisplacement, cylinders, modifiedBore);
        
        if (newStrokeUnitType === UNIT_TYPE.RELATIVE) {
            const strokeChange = requiredStroke - originalStroke;
            elements.newStroke().value = strokeChange.toFixed(2);
        } else if (newStrokeUnitType === UNIT_TYPE.ABSOLUTE) {
            elements.newStroke().value = requiredStroke.toFixed(2);
        }
        
        modifiedStroke = requiredStroke;
    }
    
    // Calculate modified values
    const modifiedDisplacement = calculateDisplacement(cylinders, modifiedBore, modifiedStroke);
    const modifiedPistonSpeed = calculatePistonSpeed(modifiedStroke, rpm);
    const compressionRatio = calculateCompressionRatio(modifiedDisplacement, combustionChamber);
    
    // Calculate differences
    const ratio = modifiedDisplacement / originalDisplacement || 0;
    const percentChange = ((modifiedDisplacement - originalDisplacement) / originalDisplacement * 100) || 0;
    const absoluteChange = modifiedDisplacement - originalDisplacement;
    
    // Update display
    updateDisplay({
        originalDisplacement,
        modifiedDisplacement,
        originalPistonSpeed,
        modifiedPistonSpeed,
        modifiedBore,
        modifiedStroke,
        compressionRatio,
        ratio,
        percentChange,
        absoluteChange
    });
}

/**
 * Update bore unit label when selector changes
 */
function updateBoreUnitLabel() {
    const unitType = parseInt(elements.selectNewBore().value);
    elements.newBoreUnit().innerText = unitType === UNIT_TYPE.ABSOLUTE ? 'mm' : '條';
    calculate();
}

/**
 * Update stroke unit label when selector changes
 */
function updateStrokeUnitLabel() {
    const unitType = parseInt(elements.selectNewStroke().value);
    elements.newStrokeUnit().innerText = unitType === UNIT_TYPE.RELATIVE ? '條' : 'mm';
    calculate();
}

/**
 * Set vehicle specifications from preset
 * @param {number} cylinders - Number of cylinders
 * @param {number} bore - Bore diameter in mm
 * @param {number} stroke - Stroke length in mm
 */
function setVehiclePreset(cylinders, bore, stroke) {
    elements.cylinders().value = cylinders;
    elements.diameter().value = bore;
    elements.stroke().value = stroke;
    calculate();
}

/**
 * Clear all input fields and reset to defaults
 */
function clearAllInputs() {
    elements.cylinders().value = '';
    elements.diameter().value = '';
    elements.stroke().value = '';
    elements.newDiameter().value = '';
    elements.newStroke().value = '';
    elements.rpm().value = DEFAULT_RPM.toString();
    elements.combustionChamber().value = '';
    calculate();
}

// Keep backward compatibility with HTML inline event handlers
function newBoreUnit() {
    updateBoreUnitLabel();
}

function newStrokeUnit() {
    updateStrokeUnitLabel();
}

function setCarSpecs(cylinders, bore, stroke) {
    setVehiclePreset(cylinders, bore, stroke);
}

function clearInputs() {
    clearAllInputs();
}
