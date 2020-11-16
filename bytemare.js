/* global registerPaint */

if (typeof registerPaint !== "undefined") {
  registerPaint("bytemare", class {
    static get inputProperties () {
      return [
        "--bytemare-tile-size",
        "--bytemare-gap",
        "--bytemare-color",
        "--bytemare-probability"
      ];
    }

    paint (ctx, geom, properties) {
      const radians = (Math.PI / 180) * 45;
      const tileSize = parseInt(properties.get("--bytemare-tile-size")) || 16;
      const gap = parseInt(properties.get("--bytemare-gap")) || 1;
      const color = properties.get("--bytemare-color").toString().trim() || "#735cdd";
      const darker = this.darkenColor(color, 20);
      const darkest = this.darkenColor(color, 40);
      const probability = parseFloat(properties.get("--bytemare-probability")) || 0.375;
      const geomTileHeight = geom.height / tileSize;
      const geomTileWidth = geom.width / tileSize;
      const outerRadius = geom.width > geom.height ? geom.width * 1.5 : geom.height * 1.5;

      for (let y = -4; y < geomTileHeight; y++) {
        const yOffset = y * tileSize;

        for (let x = -4; x < geomTileWidth; x++) {
          const xOffset = x * tileSize;

          if (Math.random() > probability) {
            // 1. Draw shape on the right side of the tower cap
            ctx.fillStyle = darker;                                                                     // Change fill to darker color
            ctx.beginPath();                                                                            // Start new path
            ctx.lineTo(xOffset + tileSize, yOffset + gap);                                              // Move to upper right
            ctx.lineTo((Math.cos(radians) * outerRadius), (Math.sin(radians) * outerRadius)); // Draw line off canvas
            ctx.lineTo(xOffset + tileSize, yOffset + tileSize);                                         // Draw to lower right
            ctx.lineTo(xOffset + gap, yOffset + tileSize);                                              // Draw line to lower left
            ctx.fill();                                                                                 // Fill shape

            // 2. Draw shape on the right side of the tower cap
            ctx.fillStyle = darkest;                                                                    // Change fill to darkest color
            ctx.beginPath();                                                                            // Start new path
            ctx.moveTo(xOffset + tileSize, yOffset + tileSize);                                         // Move to lower right
            ctx.lineTo(xOffset + gap, yOffset + tileSize);                                              // Draw line to lower left
            ctx.lineTo((Math.cos(radians) * outerRadius), (Math.sin(radians) * outerRadius)); // Draw line off canvas toward the lower left
            ctx.lineTo(xOffset + tileSize, yOffset + tileSize);                                         // Draw line back to lower right
            ctx.fill();                                                                                 // Fill shape

            // 3. Draw the tower cap
            ctx.fillStyle = color;                                                                      // Change fill to the base color
            ctx.beginPath();                                                                            // Start new path
            ctx.rect(xOffset + gap, yOffset + gap, tileSize - gap, tileSize - gap);                     // Draw a rectangle
            ctx.fill();                                                                                 // Fill shape
          }
        }
      }
    }

    isValidHexColor(hex) {
      return /^#?(?:[0-9a-f]{3}){1,2}$/i.test(hex);
    }

    hexToRgb(hex) {
      if (/^#/i.test(hex)) {
        hex = hex.replace("#", "");
      }

      if (hex.length === 3) {
        const rHex = hex.substring(0, 1);
        const gHex = hex.substring(1, 2);
        const bHex = hex.substring(2, 3);

        hex = `${rHex}${rHex}${gHex}${gHex}${bHex}${bHex}`;
      }

      const rDec = parseInt(hex.substring(0, 2), 16);
      const gDec = parseInt(hex.substring(2, 4), 16);
      const bDec = parseInt(hex.substring(4, 6), 16);

      return `rgb(${rDec},${gDec},${bDec})`;
    }

    darkenColor (colorString, amt) {
      let rgbString = this.isValidHexColor(colorString) ? this.hexToRgb(colorString) : colorString;
      rgbString = rgbString.replace(/rgba?\(/g, "").replace(/\)/g, "").replace(/\s/g, "");
      let rgbParts = rgbString.split(",");

      for (let i = 0; i < rgbParts.length; i++) {
        rgbParts[i] = rgbParts[i] - amt;

        if (rgbParts[i] < 0) {
          rgbParts[i] = 0;
        }
      }

      return `rgb(${rgbParts[0]}, ${rgbParts[1]}, ${rgbParts[2]})`;
    }
  });
}
