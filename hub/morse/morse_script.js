// Objeto de mapeo de letras a código Morse
const MORSE_CODE = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    ' ': '/',
};

// Lista de palabras aleatorias
const WORDS = [
    "HOLA", "CODIGO", "MORSE", "PRUEBA", "PUNTO", "RAYA", "MUNDO",
    "FLASH", "AYUDA", "ROBOT", "WEB"
];

let currentWord = "";

// Función para generar una nueva palabra y mostrarla
function generateNewWord() {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    currentWord = WORDS[randomIndex];
    document.getElementById('word-to-translate').textContent = currentWord;
    document.getElementById('morse-input').value = ""; // Limpiar el input
    document.getElementById('result-message').textContent = ""; // Limpiar el mensaje
}

// Función para convertir una palabra de texto a código Morse
function textToMorse(text) {
    // Convierte a mayúsculas y reemplaza múltiples espacios con uno solo para asegurar el separador '/'
    const upperText = text.toUpperCase().trim().replace(/\s+/g, ' ');
    
    let morse = "";
    for (let i = 0; i < upperText.length; i++) {
        const char = upperText[i];
        if (MORSE_CODE[char]) {
            morse += MORSE_CODE[char];
        } else {
            // Si no está en el mapa, simplemente lo ignora o podrías manejarlo de otra forma
            continue; 
        }

        // Añadir el separador de espacio entre letras, a menos que sea el final
        if (i < upperText.length - 1) {
            morse += " ";
        }
    }
    // Asegurarse de que el separador de palabra '/' esté rodeado de espacios
    return morse.trim().replace(/\s\/\s/g, '/');
}

// Función principal para comprobar la respuesta del usuario
function checkAnswer() {
    const userInput = document.getElementById('morse-input').value.toUpperCase().trim();
    const correctAnswer = textToMorse(currentWord).trim();
    const resultDiv = document.getElementById('result-message');

    // Normalizar la entrada del usuario: reemplazar barras múltiples por una sola,
    // y asegurar que haya un solo espacio entre cada secuencia de puntos/rayas
    const normalizedInput = userInput
        .replace(/\s+/g, ' ') // Quitar espacios múltiples
        .replace(/\s\/\s/g, '/') // Normalizar el separador de palabra
        .replace(/\/\s/g, '/') // Eliminar espacio después de /
        .replace(/\s\//g, '/'); // Eliminar espacio antes de /

    if (normalizedInput === correctAnswer) {
        resultDiv.innerHTML = `¡**CORRECTO**! 🎉 El código Morse para **${currentWord}** es **${correctAnswer}**.`;
        resultDiv.style.color = 'green';
    } else {
        resultDiv.innerHTML = `**INCORRECTO**. 😥
        <br> Tu respuesta: ${normalizedInput}
        <br> Respuesta correcta: ${correctAnswer}`;
        resultDiv.style.color = 'red';
    }
}

// Función para generar la tabla de referencia (solo se llama una vez al cargar)
function generateMorseTable() {
    const container = document.getElementById('morse-table-container');
    let tableHTML = '<table><thead><tr><th>Carácter</th><th>Morse</th><th>Carácter</th><th>Morse</th></tr></thead><tbody>';
    
    const keys = Object.keys(MORSE_CODE).filter(key => key !== ' '); // Excluir el espacio
    const half = Math.ceil(keys.length / 2);

    for (let i = 0; i < half; i++) {
        const char1 = keys[i];
        const morse1 = MORSE_CODE[char1];
        
        const char2 = keys[i + half];
        const morse2 = MORSE_CODE[char2] || ''; // Puede ser undefined si hay un número impar de elementos

        tableHTML += `<tr>
            <td>${char1}</td><td>${morse1}</td>
            <td>${char2}</td><td>${morse2}</td>
        </tr>`;
    }

    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

// Inicializar el juego al cargar la página
window.onload = function() {
    generateMorseTable();
    generateNewWord();
};
