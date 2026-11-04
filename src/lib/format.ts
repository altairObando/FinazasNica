/**
 * Converts a hex or RGB color string into its equivalent transparent version based on the provided opacity.
 * If the input color already contains transparency (RGBA or 8-digit HEX), it returns the original color.
 * 
 * @param {string} color - The input color string (HEX, RGB, or RGBA formats).
 * @param {number} [opacity=0.2] - The desired opacity level as a float between 0.0 and 1.0.
 * @returns {string} The transparent color string.
 * 
 * @example
 * toTransparentColor('#FF0000', 0.5);   // Returns '#FF000080' (50% opacity)
 * toTransparentColor('rgb(0, 0, 255)', 0.1); // Returns 'rgba(0, 0, 255, 0.1)'
 * toTransparentColor('#F00');          // Returns '#FF000033' (Default 20% opacity)
 */
export const toTransparentColor = (color: string, opacity = 0.2): string => {
    let clearColor = String(color).trim().toLowerCase();    
    // Ensure opacity stays within valid bounds (0.0 to 1.0)
    const validOpacity = Math.max(0, Math.min(1, opacity));    
    if (clearColor.startsWith('rgba')) return clearColor;
    if (clearColor.startsWith('rgb(')) return clearColor.replace('rgb(', 'rgba(').replace(')', `, ${validOpacity})`);    
    if (clearColor.startsWith('#')) {
        const hexBody = clearColor.slice(1);        
        if (hexBody.length === 8) return clearColor.toUpperCase();         
        let fullHex = hexBody;
        if (hexBody.length === 3) {
            fullHex = hexBody.split('').map(char => char + char).join('');
        }        
        const clearRgb = fullHex.padEnd(6, '0');        
        // Convert the 0.0-1.0 float opacity into a 2-digit HEX string (00 to FF)
        const hexAlpha = Math.round(validOpacity * 255)
            .toString(16)
            .padStart(2, '0');            
        return `#${clearRgb}${hexAlpha}`.toUpperCase();
    }    
    return clearColor;
}