document.addEventListener('DOMContentLoaded', () => {
    // State variables
    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let shouldResetScreen = false;
    
    // DOM Elements
    const elements = {
        currentDisplay: document.getElementById('current'),
        historyDisplay: document.getElementById('history'),
        themeBtn: document.getElementById('theme-btn'),
        icon: document.querySelector('.theme-toggle .icon'),
        buttons: document.querySelectorAll('.btn')
    };

    // Event Listeners for Buttons
    elements.buttons.forEach(button => {
        button.addEventListener('click', () => {
            handleButtonClick(button);
            // Visual feedback
            button.classList.add('pressed');
            setTimeout(() => button.classList.remove('pressed'), 150);
        });
    });

    // Event Listener for Keyboard
    window.addEventListener('keydown', handleKeyboardInput);

    // Event Listener for Theme Toggle
    elements.themeBtn.addEventListener('click', toggleTheme);

    // Core Logic Functions
    function handleButtonClick(button) {
        if (button.classList.contains('btn-number')) {
            appendNumber(button.dataset.value);
        } else if (button.dataset.action === 'operator') {
            chooseOperator(button.dataset.value);
        } else if (button.dataset.action === 'clear') {
            clear();
        } else if (button.dataset.action === 'delete') {
            deleteNumber();
        } else if (button.dataset.action === 'calculate') {
            evaluate();
        }
        updateDisplay();
    }

    function handleKeyboardInput(e) {
        if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
        if (e.key === '.') appendNumber('.');
        if (e.key === '=' || e.key === 'Enter') {
            e.preventDefault();
            evaluate();
            triggerButtonAnimation('.btn-equals');
        }
        if (e.key === 'Backspace') {
            deleteNumber();
            triggerButtonAnimation('[data-action="delete"]');
        }
        if (e.key === 'Escape') {
            clear();
            triggerButtonAnimation('[data-action="clear"]');
        }
        if (['+', '-', '*', '/', '%'].includes(e.key)) {
            chooseOperator(e.key);
            triggerButtonAnimation(`[data-value="${e.key}"]`);
        }
        updateDisplay();
    }

    function triggerButtonAnimation(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.classList.add('pressed');
            setTimeout(() => button.classList.remove('pressed'), 150);
        }
    }

    function appendNumber(number) {
        if (currentInput === '0' && number === '0') return;
        if (number === '.' && currentInput.includes('.')) return;
        
        if (shouldResetScreen || currentInput === '0') {
            if (number === '.') {
                currentInput = '0.';
            } else {
                currentInput = number;
            }
            shouldResetScreen = false;
        } else {
            currentInput += number;
        }
    }

    function chooseOperator(op) {
        if (currentInput === '' && op === '-') {
            currentInput = '-';
            updateDisplay();
            return;
        }
        if (currentInput === '' && previousInput === '') return;
        
        if (previousInput !== '' && currentInput !== '') {
            evaluate();
        }
        operator = op;
        previousInput = currentInput;
        currentInput = '';
    }

    function evaluate() {
        if (operator === null || currentInput === '' || previousInput === '') return;
        
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Cannot divide by zero");
                    clear();
                    return;
                }
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            default:
                return;
        }
        
        // Round to handle floating point issues
        currentInput = Math.round(result * 10000000000) / 10000000000;
        currentInput = currentInput.toString();
        operator = null;
        previousInput = '';
        shouldResetScreen = true;
    }

    function clear() {
        currentInput = '0';
        previousInput = '';
        operator = null;
        shouldResetScreen = false;
    }

    function deleteNumber() {
        if (shouldResetScreen) {
            clear();
            return;
        }
        currentInput = currentInput.toString().slice(0, -1);
        if (currentInput === '' || currentInput === '-') {
            currentInput = '0';
        }
    }

    function formatNumber(numStr) {
        if (numStr === '-') return '-';
        if (numStr === '0.') return '0.';
        
        const floatNumber = parseFloat(numStr);
        if (isNaN(floatNumber)) return '';
        
        // Format with commas and keeping decimals
        const numberParts = numStr.toString().split('.');
        numberParts[0] = numberParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return numberParts.join('.');
    }

    function getOperatorSymbol(op) {
        if (op === '*') return '×';
        if (op === '/') return '÷';
        if (op === '-') return '−';
        return op;
    }

    function updateDisplay() {
        elements.currentDisplay.textContent = formatNumber(currentInput);
        
        if (operator != null) {
            elements.historyDisplay.textContent = `${formatNumber(previousInput)} ${getOperatorSymbol(operator)}`;
        } else {
            elements.historyDisplay.textContent = '';
        }
        
        // Dynamic font size adjustment based on length
        if (currentInput.length > 12) {
            elements.currentDisplay.style.fontSize = '1.8rem';
        } else if (currentInput.length > 8) {
            elements.currentDisplay.style.fontSize = '2.2rem';
        } else {
            elements.currentDisplay.style.fontSize = '3rem';
        }
    }

    // Theme Toggle Functionality
    function toggleTheme() {
        const root = document.documentElement;
        if (root.getAttribute('data-theme') === 'dark') {
            root.removeAttribute('data-theme');
            elements.icon.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            root.setAttribute('data-theme', 'dark');
            elements.icon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.icon.textContent = '🌙';
    }
});
