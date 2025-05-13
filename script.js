// DOM Elements
const dnaInput = document.getElementById('dnaInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const mrnaResult = document.getElementById('mrnaResult');
const proteinResult = document.getElementById('proteinResult');
const tooltipContainer = document.querySelector('.tooltip-container');

// Codon to Amino Acid mapping
const codonTable = {
    'AUA': 'Ile', 'AUC': 'Ile', 'AUU': 'Ile', 'AUG': 'Met',
    'ACA': 'Thr', 'ACC': 'Thr', 'ACG': 'Thr', 'ACU': 'Thr',
    'AAC': 'Asn', 'AAU': 'Asn', 'AAA': 'Lys', 'AAG': 'Lys',
    'AGC': 'Ser', 'AGU': 'Ser', 'AGA': 'Arg', 'AGG': 'Arg',
    'CUA': 'Leu', 'CUC': 'Leu', 'CUG': 'Leu', 'CUU': 'Leu',
    'CCA': 'Pro', 'CCC': 'Pro', 'CCG': 'Pro', 'CCU': 'Pro',
    'CAC': 'His', 'CAU': 'His', 'CAA': 'Gln', 'CAG': 'Gln',
    'CGA': 'Arg', 'CGC': 'Arg', 'CGG': 'Arg', 'CGU': 'Arg',
    'GUA': 'Val', 'GUC': 'Val', 'GUG': 'Val', 'GUU': 'Val',
    'GCA': 'Ala', 'GCC': 'Ala', 'GCG': 'Ala', 'GCU': 'Ala',
    'GAC': 'Asp', 'GAU': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu',
    'GGA': 'Gly', 'GGC': 'Gly', 'GGG': 'Gly', 'GGU': 'Gly',
    'UCA': 'Ser', 'UCC': 'Ser', 'UCG': 'Ser', 'UCU': 'Ser',
    'UUC': 'Phe', 'UUU': 'Phe', 'UUA': 'Leu', 'UUG': 'Leu',
    'UAC': 'Tyr', 'UAU': 'Tyr', 'UAA': 'Stop', 'UAG': 'Stop',
    'UGC': 'Cys', 'UGU': 'Cys', 'UGA': 'Stop', 'UGG': 'Trp'
};

// Tooltip content
const tooltips = {
    'dnaInput': 'Enter a DNA sequence using only A, T, C, and G bases',
    'transcription': 'DNA → RNA: A→U, T→A, C→G, G→C',
    'translation': 'RNA → Protein: Every 3 bases (codon) codes for 1 amino acid'
};

// Event Listeners
startBtn.addEventListener('click', startSimulation);
resetBtn.addEventListener('click', resetSimulation);
tabBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

// Add tooltip listeners
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
});

// Functions
function validateDNA(sequence) {
    return /^[ATCG]+$/i.test(sequence);
}

function transcribe(dna) {
    return dna.toUpperCase()
              .replace(/T/g, 'U')
              .split('')
              .join('');
}

function translate(mrna) {
    const codons = mrna.match(/.{1,3}/g) || [];
    let protein = [];
    
    for (let codon of codons) {
        const aminoAcid = codonTable[codon];
        if (aminoAcid === 'Stop') break;
        protein.push(aminoAcid);
    }
    
    return protein.join(' - ');
}

async function startSimulation() {
    const dna = dnaInput.value.trim();
    
    if (!validateDNA(dna)) {
        alert('Please enter a valid DNA sequence (only A, T, C, G allowed)');
        return;
    }

    // Transcription Animation
    const mrna = transcribe(dna);
    await animateTranscription(dna, mrna);
    mrnaResult.textContent = mrna;

    // Switch to translation tab
    switchTab('translation');

    // Translation Animation
    const protein = translate(mrna);
    await animateTranslation(mrna, protein);
    proteinResult.textContent = protein;
}

function resetSimulation() {
    dnaInput.value = '';
    mrnaResult.textContent = '';
    proteinResult.textContent = '';
    switchTab('transcription');
}

function switchTab(tabName) {
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
}

async function animateTranscription(dna, mrna) {
    const dnaStrand = document.getElementById('dna-strand');
    const rnaPolymerase = document.getElementById('rna-polymerase');
    const mrnaStrand = document.getElementById('mrna-strand');

    // Initialize positions and content
    dnaStrand.textContent = dna.split('').join(' ');
    rnaPolymerase.style.display = 'block';
    rnaPolymerase.style.left = '10%';
    rnaPolymerase.style.top = '45%';
    mrnaStrand.textContent = '';
    
    // Animate RNA polymerase and build mRNA
    let currentMRNA = [];
    const stepDelay = 300; // Reduced delay for smoother animation
    
    for (let i = 0; i < mrna.length; i++) {
        currentMRNA.push(mrna[i]);
        mrnaStrand.textContent = currentMRNA.join(' ');
        
        rnaPolymerase.style.transition = 'left 0.3s linear';
        rnaPolymerase.style.left = `${10 + (i + 1) * 60 / mrna.length}%`;
        
        await new Promise(resolve => setTimeout(resolve, stepDelay));
    }

    // Final mRNA display
    mrnaStrand.textContent = mrna.split('').join(' ');
    mrnaResult.textContent = mrna;
}

async function animateTranslation(mrna, protein) {
    const mrnaTemplate = document.getElementById('mrna-template');
    const ribosome = document.getElementById('ribosome');
    const proteinChain = document.getElementById('protein-chain');

    // Initialize positions and content
    mrnaTemplate.textContent = mrna.split('').join(' ');
    ribosome.style.display = 'block';
    ribosome.style.left = '10%';
    ribosome.style.top = '45%';
    proteinChain.textContent = '';
    
    // Split protein into amino acids and animate
    const aminoAcids = protein.split(' - ');
    let currentProtein = [];
    const stepDelay = 600; // Adjusted delay for codon reading
    
    for (let i = 0; i < aminoAcids.length; i++) {
        // Update protein chain
        currentProtein.push(aminoAcids[i]);
        proteinChain.textContent = currentProtein.join(' - ');
        
        // Highlight current codon with smooth transition
        const codonStart = i * 3;
        const beforeCodon = mrna.substring(0, codonStart).split('').join(' ');
        const currentCodon = mrna.substring(codonStart, codonStart + 3).split('').join(' ');
        const afterCodon = mrna.substring(codonStart + 3).split('').join(' ');
        
        mrnaTemplate.innerHTML = `
            <span style="color: #666">${beforeCodon}</span>
            <span style="background-color: #fff3cd; color: #000; transition: all 0.3s">${currentCodon}</span>
            <span style="color: #666">${afterCodon}</span>
        `;
        
        ribosome.style.transition = 'left 0.3s linear';
        ribosome.style.left = `${10 + (i + 1) * 60 / aminoAcids.length}%`;
        
        await new Promise(resolve => setTimeout(resolve, stepDelay));
    }

    // Final displays
    proteinChain.textContent = protein;
    proteinResult.textContent = protein;
}

function showTooltip(event) {
    const tooltip = tooltips[event.target.id];
    if (!tooltip) return;

    tooltipContainer.textContent = tooltip;
    tooltipContainer.style.display = 'block';
    tooltipContainer.style.left = event.pageX + 10 + 'px';
    tooltipContainer.style.top = event.pageY + 10 + 'px';
}

function hideTooltip() {
    tooltipContainer.style.display = 'none';
}

// Add tooltip data attributes
dnaInput.dataset.tooltip = 'dna-input';
document.querySelector('[data-tab="transcription"]').dataset.tooltip = 'transcription';
document.querySelector('[data-tab="translation"]').dataset.tooltip = 'translation';
