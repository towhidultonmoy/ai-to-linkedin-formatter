/**
 * LinkedIn Formatter
 * 
 * A utility script to convert standard Markdown syntax into Unicode characters
 * that simulate styled text (Bold, Italic, Monospace, etc.) on platforms 
 * like LinkedIn that do not support native Markdown.
 * 
 * @author [Your Name/Antigravity]
 * @version 1.1.0
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const copyBtn = document.getElementById('copy-btn');

    /**
     * Unicode Character Maps
     * 
     * Mappings for various text styles using Mathematical Alphanumeric Symbols.
     * Some ranges are continuous (like Bold Serif), while others (like Italic)
     * are discontinuous and require explicit mapping strings.
     */
    const maps = {
        // **text** -> Bold Serif (e.g., 𝐀)
        boldSerif: {
            start: 0x1D400,
            map: "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"
        },
        // *text* -> Italic Serif (e.g., 𝐴) - Hand-picked for continuity
        italicSerif: {
            map: "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧0123456789"
        },
        // __text__ -> Bold Sans-Serif (e.g., 𝗔)
        boldSans: {
            start: 0x1D5D4,
            map: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵"
        },
        // _text_ -> Italic Sans-Serif (e.g., 𝘈)
        italicSans: {
            start: 0x1D608,
            map: "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻0123456789"
        },
        // `text` -> Monospace (e.g., 𝙼)
        monospace: {
            start: 0x1D670,
            map: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿"
        },
        // ~text~ -> Script (e.g., 𝒮)
        script: {
            map: "𝒜ℬ𝒞𝒟𝐸ℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏0123456789"
        }
    };

    const normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    /**
     * Converts a single character to the target style.
     * @param {string} char - The character to convert.
     * @param {string} type - The key of the style map to use.
     * @returns {string} The converted character or the original if not found.
     */
    function convertChar(char, type) {
        const index = normalChars.indexOf(char);
        if (index === -1) return char;

        if (maps[type].map) {
            // Use Array.from to correctly handle surrogate pairs (high Unicode code points)
            const symbols = Array.from(maps[type].map);
            return symbols[index] || char;
        }

        return char;
    }

    /**
     * Converts a string of text to the target style.
     * @param {string} text - The input text.
     * @param {string} type - The style type.
     * @returns {string} The formatted string.
     */
    function convertString(text, type) {
        return text.split('').map(c => convertChar(c, type)).join('');
    }

    /**
     * Main formatting function that applies all regex replacements.
     * Order of execution matters to avoid conflicting matches.
     * @param {string} text - Raw input text with Markdown.
     * @returns {string} Formatted Unicode text.
     */
    function formatText(text) {
        // 1. Monospace: `text`
        text = text.replace(/`([^`]+)`/g, (match, p1) => convertString(p1, 'monospace'));

        // 2. Bold Serif: **text**
        text = text.replace(/\*\*([^*]+)\*\*/g, (match, p1) => convertString(p1, 'boldSerif'));

        // 3. Bold Sans: __text__
        text = text.replace(/__([^_]+)__/g, (match, p1) => convertString(p1, 'boldSans'));

        // 4. Italic Serif: *text*
        text = text.replace(/\*([^*]+)\*/g, (match, p1) => convertString(p1, 'italicSerif'));

        // 5. Italic Sans: _text_
        text = text.replace(/_([^_]+)_/g, (match, p1) => convertString(p1, 'italicSans'));

        // 6. Script: ~text~
        text = text.replace(/~([^~]+)~/g, (match, p1) => convertString(p1, 'script'));

        // 7. Header 1: # Text (Bold Serif Uppercase) -> Simulates a main heading
        text = text.replace(/(^|\n)#\s+(.*)/g, (match, prefix, content) => {
            return prefix + convertString(content.toUpperCase(), 'boldSerif');
        });

        // 8. Header 2: ## Text (Bold Sans) -> Simulates a sub-heading
        text = text.replace(/(^|\n)##\s+(.*)/g, (match, prefix, content) => {
            return prefix + convertString(content, 'boldSans');
        });

        return text;
    }

    // --- Event Listeners ---

    // Real-time formatting on input
    inputText.addEventListener('input', () => {
        const raw = inputText.value;
        const formatted = formatText(raw);
        outputText.value = formatted;
    });

    // Copy to clipboard with visual feedback
    copyBtn.addEventListener('click', () => {
        outputText.select();
        outputText.setSelectionRange(0, 99999); // Mobile compatibility

        navigator.clipboard.writeText(outputText.value).then(() => {
            const originalText = copyBtn.innerHTML;

            // Show success state
            copyBtn.innerHTML = '<span class="btn-icon">✅</span> Copied!';
            copyBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            // Revert after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text. Please try manually.');
        });
    });

    // Trigger initial format (in case of browser auto-fill)
    if (inputText.value) {
        inputText.dispatchEvent(new Event('input'));
    }
});
