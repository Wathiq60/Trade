// app.js
let lastCalculatedPercentage = 0;
let lastCalculatedExitPrice = 0;

// Create formatters for USD and AED
const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const aedFormatter = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function toggleInputType(type) {
    const percentageButton = document.getElementById('percentageButton');
    const exitPriceButton = document.getElementById('exitPriceButton');
    const percentageIncreaseInput = document.getElementById('percentageIncrease');
    const percentageIncreaseLabel = document.getElementById('percentageIncreaseLabel');
    const exitPriceInput = document.getElementById('exitPrice');
    const exitPriceLabel = document.getElementById('exitPriceLabel');

    if (type === 'percentage') {
        percentageButton.classList.add('active');
        exitPriceButton.classList.remove('active');
        percentageIncreaseInput.style.display = 'block';
        percentageIncreaseLabel.style.display = 'none';
        exitPriceInput.style.display = 'none';
        exitPriceLabel.style.display = 'block';
        
        percentageIncreaseInput.value = (lastCalculatedPercentage * 100).toFixed(2);
    } else {
        percentageButton.classList.remove('active');
        exitPriceButton.classList.add('active');
        percentageIncreaseInput.style.display = 'none';
        percentageIncreaseLabel.style.display = 'block';
        exitPriceInput.style.display = 'block';
        exitPriceLabel.style.display = 'none';
        
        exitPriceInput.value = lastCalculatedExitPrice.toFixed(2);
    }
    updateCalculations();
}

function updateCalculations() {
    const entryPrice = parseFloat(document.getElementById('entryPrice').value) || 0;
    const numShares = parseFloat(document.getElementById('numShares').value) || 1;
    const toggleInput = document.querySelector('.toggle-button.active').id;
    const usdToAed = 3.6639;

    let exitPrice = 0;
    let percentageIncrease = 0;

    if (toggleInput === 'percentageButton') {
        percentageIncrease = parseFloat(document.getElementById('percentageIncrease').value) / 100 || 0;
        exitPrice = entryPrice * (1 + percentageIncrease);
        document.getElementById('exitPriceLabel').textContent = exitPrice.toFixed(2);
        
        lastCalculatedPercentage = percentageIncrease;
        lastCalculatedExitPrice = exitPrice;
    } else {
        exitPrice = parseFloat(document.getElementById('exitPrice').value) || 0;
        if (entryPrice > 0) {
            percentageIncrease = (exitPrice / entryPrice - 1);
            document.getElementById('percentageIncreaseLabel').textContent = (percentageIncrease * 100).toFixed(2) + '%';
        } else {
            percentageIncrease = 0;
            document.getElementById('percentageIncreaseLabel').textContent = 'N/A';
        }
        
        lastCalculatedPercentage = percentageIncrease;
        lastCalculatedExitPrice = exitPrice;
    }

    const entryValueUsd = entryPrice * numShares;
    const exitValueUsd = exitPrice * numShares;
    const entryFeeUsd = Math.max(1, entryValueUsd * 0.0025);
    const exitFeeUsd = Math.max(1, exitValueUsd * 0.0025);
    const profitUsd = exitValueUsd - entryValueUsd - entryFeeUsd - exitFeeUsd;
    const profitAed = profitUsd * usdToAed;
    const roi = entryValueUsd > 0 ? (profitUsd / entryValueUsd) * 100 : 0;

    // Format and display the results using currency formatters
    document.getElementById('entryValueUsd').textContent = usdFormatter.format(entryValueUsd);
    
    const profitElement = document.getElementById('profitAed');
    const roiElement = document.getElementById('roi');
    
    profitElement.textContent = aedFormatter.format(profitAed);
    roiElement.textContent = roi.toFixed(2) + '%';
    
    if (profitUsd >= 0) {
        profitElement.className = 'value profit';
        roiElement.className = 'value profit';
    } else {
        profitElement.className = 'value loss';
        roiElement.className = 'value loss';
    }
}

// Initialize the calculations on page load
document.addEventListener('DOMContentLoaded', () => {
    toggleInputType('exitPrice');
    updateCalculations();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

