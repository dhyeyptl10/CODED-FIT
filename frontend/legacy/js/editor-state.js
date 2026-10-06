/**
 * CODED FIT — Design Editor: Customization State Manager
 *
 * Tracks all customization choices in a clean structure that is
 * compatible with MongoDB persistence (via /api/customization endpoint).
 *
 * Front and back designs are stored independently as Fabric.js canvas JSON.
 * Call toJSON() to get a MongoDB-ready payload.
 */

class CustomizationState {
  /**
   * @param {string} productId - ID from editor-products.js GARMENTS array
   */
  constructor(productId = 'tee-classic') {
    const garment = getGarmentById(productId);

    this.productId = productId;
    this.color     = garment.colors[0]; // Default: first color
    this.size      = 'M';
    this.face      = 'front';           // Currently visible side

    // Each face stores the serialized Fabric.js canvas JSON
    this.front = { canvasJSON: null };
    this.back  = { canvasJSON: null };
  }

  /** Switch visible face ('front' | 'back') */
  setFace(face) {
    this.face = face;
  }

  /** Get state object for the current face */
  currentFaceState() {
    return this[this.face];
  }

  /** Serialize the current Fabric.js canvas and save it to this face */
  saveCurrentCanvas(jsonString) {
    this[this.face].canvasJSON = jsonString;
  }

  /** Update garment color */
  setColor(colorObj) {
    this.color = colorObj;
  }

  /** Update garment size */
  setSize(size) {
    this.size = size;
  }

  /**
   * Export a MongoDB-compatible JSON representation.
   * Guide/non-printable objects are excluded automatically.
   *
   * Example output structure:
   * {
   *   productId: 'tee-classic',
   *   color: 'black',
   *   size: 'M',
   *   front: { objects: [...fabric objects...] },
   *   back:  { objects: [...fabric objects...] }
   * }
   */
  toJSON() {
    const parseObjects = (canvasJSON) => {
      if (!canvasJSON) return [];
      try {
        const parsed = JSON.parse(canvasJSON);
        return (parsed.objects || []).filter(o => o.customType !== 'guide');
      } catch {
        return [];
      }
    };

    return {
      productId: this.productId,
      color:     this.color.id,
      size:      this.size,
      front:     { objects: parseObjects(this.front.canvasJSON) },
      back:      { objects: parseObjects(this.back.canvasJSON)  },
    };
  }
}
