/**
 * CODED FIT — Design Editor: Garment Product Catalog
 *
 * Add new garments here to extend the editor to hoodies, jackets, etc.
 * All coordinates are in SVG viewBox units (400×480).
 * The printArea defines the interactive Fabric.js canvas region.
 */

const GARMENTS = [
  {
    id: 'tee-classic',
    name: 'Classic T-Shirt',
    category: 'tee',
    basePrice: 999,
    printPrice: 299, // Charged when user adds a design
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

    colors: [
      { id: 'black', label: 'Black', hex: '#1a1a1a' },
      { id: 'white', label: 'White', hex: '#f4f3f0' },
      { id: 'beige', label: 'Beige', hex: '#c8b89a' },
      { id: 'grey',  label: 'Grey',  hex: '#808080' },
      { id: 'navy',  label: 'Navy',  hex: '#1a2c50' },
    ],

    /**
     * Print areas in SVG viewBox coordinate space (400×480).
     * The Fabric.js canvas will be sized to printArea.w × printArea.h
     * and positioned at (printArea.x, printArea.y) over the SVG.
     */
    printAreas: {
      front: { x: 105, y: 120, w: 190, h: 218 },
      back:  { x: 105, y: 120, w: 190, h: 218 },
    },

    // SVG viewBox dimensions (must match the SVG in editor.html)
    svgViewBox: { w: 400, h: 480 },
  },

  // ── Future garments — uncomment and populate when ready ──────────────
  // {
  //   id: 'hoodie-classic',
  //   name: 'Classic Hoodie',
  //   category: 'hoodie',
  //   basePrice: 1899,
  //   ...
  // },
];

/** Look up a garment by ID, falls back to first garment. */
function getGarmentById(id) {
  return GARMENTS.find(g => g.id === id) || GARMENTS[0];
}
