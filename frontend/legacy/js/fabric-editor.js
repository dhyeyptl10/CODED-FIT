/**
 * CODED FIT — Interactive Clothing Customization Canvas Controller
 * 
 * Production-ready Fabric.js controller supporting:
 * - Real-time garment rendering (Front & Back)
 * - Multi-layer image drag, scale, rotate, duplicate, layering
 * - Print area boundary validation and clamping
 * - Independent Front/Back state persistence
 * - Dynamic color switching without affecting design layers
 * - Undo / Redo history management
 * - High-res composite PNG export
 */

class FabricEditor {
  constructor(canvasId, options = {}) {
    this.canvasId = canvasId;
    this.canvas = null;
    this.state = new CustomizationState('tee-classic');
    this.garment = getGarmentById(this.state.productId);
    this.fabric = this.garment.fabrics?.[0] || '';

    // Undo / Redo stacks per face
    this.history = {
      front: { undo: [], redo: [] },
      back:  { undo: [], redo: [] }
    };
    this.isHistoryProcessing = false;
    this.maxHistory = 25;

    // Callbacks for UI updates
    this.onSelectionChange = options.onSelectionChange || (() => {});
    this.onBoundaryCheck = options.onBoundaryCheck || (() => {});
    this.onHistoryChange = options.onHistoryChange || (() => {});

    this.initCanvas();
    this.bindEvents();
    this.recordHistory();
  }

  /** Initialize Fabric.js Canvas */
  initCanvas() {
    const printArea = this.garment.printAreas[this.state.face];
    const canvasEl = document.getElementById(this.canvasId);
    if (!canvasEl) {
      console.error(`Canvas element #${this.canvasId} not found`);
      return;
    }

    // Set pixel dimensions to match print area
    canvasEl.width = printArea.w;
    canvasEl.height = printArea.h;

    this.canvas = new fabric.Canvas(this.canvasId, {
      width: printArea.w,
      height: printArea.h,
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      selection: true,
      uniformScaling: false,
    });

    // Configure Fabric.js control points styling for ultra-clean luxury UI
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = '#e10600';
    fabric.Object.prototype.cornerStrokeColor = '#ffffff';
    fabric.Object.prototype.borderColor = '#e10600';
    fabric.Object.prototype.cornerSize = 10;
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderDashArray = [4, 4];
    fabric.Object.prototype.padding = 6;
  }

  /** Attach Fabric events */
  bindEvents() {
    if (!this.canvas) return;

    // Selection events
    this.canvas.on('selection:created', (e) => this.handleSelection(e));
    this.canvas.on('selection:updated', (e) => this.handleSelection(e));
    this.canvas.on('selection:cleared', () => this.handleSelection(null));

    // Transform & movement events for boundary validation & clamping
    this.canvas.on('object:moving', (e) => this.handleObjectMoving(e.target));
    this.canvas.on('object:scaling', (e) => this.handleObjectTransform(e.target));
    this.canvas.on('object:rotating', (e) => this.handleObjectTransform(e.target));

    // History recording triggers
    this.canvas.on('object:modified', () => this.recordHistory());
    this.canvas.on('object:added', (e) => {
      if (!this.isHistoryProcessing && !e.target._isInternal) {
        this.recordHistory();
      }
    });
    this.canvas.on('object:removed', (e) => {
      if (!this.isHistoryProcessing && !e.target._isInternal) {
        this.recordHistory();
      }
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        this.deleteActiveObject();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          this.redo();
        } else {
          this.undo();
        }
        e.preventDefault();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        this.redo();
        e.preventDefault();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        this.duplicateActiveObject();
        e.preventDefault();
      }
    });
  }

  /** Object selection handler */
  handleSelection(e) {
    const activeObject = this.canvas.getActiveObject();
    this.onSelectionChange(activeObject);
  }

  /**
   * Clamp object to prevent it from moving completely outside the printable region.
   * Also trigger visual boundary validation warning if extending outside.
   */
  handleObjectMoving(obj) {
    if (!obj) return;
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;
    const bound = obj.getBoundingRect(true, true);

    // Keep at least 20px of the object visible inside the canvas
    const minVisible = 24;

    if (bound.left + bound.width < minVisible) {
      obj.left = obj.left + (minVisible - (bound.left + bound.width));
    }
    if (bound.left > canvasW - minVisible) {
      obj.left = obj.left - (bound.left - (canvasW - minVisible));
    }
    if (bound.top + bound.height < minVisible) {
      obj.top = obj.top + (minVisible - (bound.top + bound.height));
    }
    if (bound.top > canvasH - minVisible) {
      obj.top = obj.top - (bound.top - (canvasH - minVisible));
    }

    this.checkBoundaryExceeded();
  }

  handleObjectTransform(obj) {
    this.checkBoundaryExceeded();
  }

  /**
   * Validate if any artwork extends beyond the printable boundaries
   */
  checkBoundaryExceeded() {
    const objects = this.canvas.getObjects().filter(o => !o._isInternal);
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;
    let isExceeded = false;

    for (const obj of objects) {
      const bound = obj.getBoundingRect(true, true);
      if (
        bound.left < 0 ||
        bound.top < 0 ||
        bound.left + bound.width > canvasW ||
        bound.top + bound.height > canvasH
      ) {
        isExceeded = true;
        break;
      }
    }

    this.onBoundaryCheck(isExceeded);
  }

  /**
   * Add image from file input or URL
   */
  addImage(fileOrUrl) {
    if (typeof fileOrUrl === 'string') {
      this._loadFabricImage(fileOrUrl);
    } else if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this._loadFabricImage(e.target.result);
      };
      reader.readAsDataURL(fileOrUrl);
    }
  }

  _loadFabricImage(dataUrl) {
    fabric.Image.fromURL(dataUrl, (img) => {
      if (!img) return;

      const canvasW = this.canvas.width;
      const canvasH = this.canvas.height;

      // Smart scaling: fit within 75% of printable area initially
      const maxTargetW = canvasW * 0.75;
      const maxTargetH = canvasH * 0.75;
      const scale = Math.min(maxTargetW / img.width, maxTargetH / img.height, 1);

      img.set({
        left: canvasW / 2,
        top: canvasH / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        cornerColor: '#e10600',
      });

      this.canvas.add(img);
      this.canvas.setActiveObject(img);
      this.canvas.renderAll();
      this.checkBoundaryExceeded();
      this.recordHistory();
    }, { crossOrigin: 'anonymous' });
  }

  /** Duplicate selected object */
  duplicateActiveObject() {
    const active = this.canvas.getActiveObject();
    if (!active) return;

    active.clone((cloned) => {
      this.canvas.discardActiveObject();
      cloned.set({
        left: active.left + 15,
        top: active.top + 15,
        evented: true,
      });

      if (cloned.type === 'activeSelection') {
        cloned.canvas = this.canvas;
        cloned.forEachObject((obj) => {
          this.canvas.add(obj);
        });
        cloned.setCoords();
      } else {
        this.canvas.add(cloned);
      }

      this.canvas.setActiveObject(cloned);
      this.canvas.renderAll();
      this.recordHistory();
    });
  }

  /** Delete selected object */
  deleteActiveObject() {
    const active = this.canvas.getActiveObjects();
    if (!active || active.length === 0) return;

    this.canvas.discardActiveObject();
    active.forEach(obj => {
      this.canvas.remove(obj);
    });
    this.canvas.renderAll();
    this.checkBoundaryExceeded();
    this.recordHistory();
  }

  /** Layering: Bring forward */
  bringForward() {
    const active = this.canvas.getActiveObject();
    if (active) {
      this.canvas.bringForward(active);
      this.canvas.renderAll();
      this.recordHistory();
    }
  }

  /** Layering: Send backward */
  sendBackward() {
    const active = this.canvas.getActiveObject();
    if (active) {
      this.canvas.sendBackwards(active);
      this.canvas.renderAll();
      this.recordHistory();
    }
  }

  /** Deselect all */
  deselectAll() {
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  /** Reset current face design */
  resetDesign() {
    this.canvas.clear();
    this.canvas.renderAll();
    this.checkBoundaryExceeded();
    this.recordHistory();
  }

  /**
   * Switch between FRONT and BACK views.
   * Serializes current face, updates state, and loads target face.
   */
  switchFace(targetFace) {
    if (targetFace === this.state.face) return;

    // 1. Save current face to state
    const currentJSON = JSON.stringify(this.canvas.toJSON());
    this.state.saveCurrentCanvas(currentJSON);

    // 2. Set new face in state
    this.state.setFace(targetFace);

    // 3. Resize canvas if print area dimensions differ
    const printArea = this.garment.printAreas[targetFace];
    this.canvas.setWidth(printArea.w);
    this.canvas.setHeight(printArea.h);

    // 4. Load target face JSON if it exists
    const targetState = this.state.currentFaceState();
    this.isHistoryProcessing = true;

    if (targetState.canvasJSON) {
      this.canvas.loadFromJSON(targetState.canvasJSON, () => {
        this.canvas.renderAll();
        this.isHistoryProcessing = false;
        this.checkBoundaryExceeded();
        this.onSelectionChange(null);
        this.updateHistoryButtons();
      });
    } else {
      this.canvas.clear();
      this.canvas.renderAll();
      this.isHistoryProcessing = false;
      this.checkBoundaryExceeded();
      this.onSelectionChange(null);
      this.updateHistoryButtons();
    }
  }

  /**
   * Change garment color.
   * Changing color strictly modifies the garment visual layer
   * and preserves all design layers untouched.
   */
  setColor(colorObj) {
    this.state.setColor(colorObj);
  }

  /**
   * History Management: Record snapshot for active face
   */
  recordHistory() {
    if (this.isHistoryProcessing || !this.canvas) return;

    const face = this.state.face;
    const json = JSON.stringify(this.canvas.toJSON());
    const stack = this.history[face].undo;

    if (stack.length > 0 && stack[stack.length - 1] === json) {
      return;
    }

    stack.push(json);
    if (stack.length > this.maxHistory) {
      stack.shift();
    }

    // Clear redo stack on new action
    this.history[face].redo = [];
    this.updateHistoryButtons();
  }

  /** Undo action */
  undo() {
    const face = this.state.face;
    const undoStack = this.history[face].undo;
    const redoStack = this.history[face].redo;

    if (undoStack.length <= 1) return;

    const current = undoStack.pop();
    redoStack.push(current);

    const prev = undoStack[undoStack.length - 1];
    this.isHistoryProcessing = true;
    this.canvas.loadFromJSON(prev, () => {
      this.canvas.renderAll();
      this.isHistoryProcessing = false;
      this.checkBoundaryExceeded();
      this.updateHistoryButtons();
    });
  }

  /** Redo action */
  redo() {
    const face = this.state.face;
    const undoStack = this.history[face].undo;
    const redoStack = this.history[face].redo;

    if (redoStack.length === 0) return;

    const next = redoStack.pop();
    undoStack.push(next);

    this.isHistoryProcessing = true;
    this.canvas.loadFromJSON(next, () => {
      this.canvas.renderAll();
      this.isHistoryProcessing = false;
      this.checkBoundaryExceeded();
      this.updateHistoryButtons();
    });
  }

  updateHistoryButtons() {
    const face = this.state.face;
    const canUndo = this.history[face].undo.length > 1;
    const canRedo = this.history[face].redo.length > 0;
    this.onHistoryChange({ canUndo, canRedo });
  }

  /**
   * Export final design composite (Garment mockup + Canvas design) as PNG
   */
  async exportCompositePNG() {
    const exportWidth = 800;
    const exportHeight = 960;
    const printArea = this.garment.printAreas[this.state.face];
    const viewBox = this.garment.svgViewBox;

    // Create export offscreen canvas
    const offCanvas = document.createElement('canvas');
    offCanvas.width = exportWidth;
    offCanvas.height = exportHeight;
    const ctx = offCanvas.getContext('2d');

    // Fill background with soft atelier grey
    ctx.fillStyle = '#f8f8fa';
    ctx.fillRect(0, 0, exportWidth, exportHeight);

    // 1. Draw Garment Mockup SVG
    const svgEl = document.getElementById(
      this.state.face === 'front' ? 'garment-svg-front' : 'garment-svg-back'
    );
    if (svgEl) {
      const svgClone = svgEl.cloneNode(true);
      // Ensure fill matches current color
      svgClone.querySelectorAll('.garment-body-fill').forEach(el => {
        el.setAttribute('fill', this.state.color.hex);
      });

      const svgString = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, exportWidth, exportHeight);
          URL.revokeObjectURL(svgUrl);
          resolve();
        };
        img.src = svgUrl;
      });
    }

    // 2. Draw Fabric.js Canvas contents accurately over the print area
    const scaleX = exportWidth / viewBox.w;
    const scaleY = exportHeight / viewBox.h;
    const destX = printArea.x * scaleX;
    const destY = printArea.y * scaleY;
    const destW = printArea.w * scaleX;
    const destH = printArea.h * scaleY;

    // Deselect before rendering export to avoid selection boxes on final image
    this.canvas.discardActiveObject();
    this.canvas.renderAll();

    const canvasDataUrl = this.canvas.toDataURL({ format: 'png', multiplier: 2 });
    await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, destX, destY, destW, destH);
        resolve();
      };
      img.src = canvasDataUrl;
    });

    // 3. Add brand watermark in bottom-right
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.textAlign = 'right';
    ctx.fillText('CODED FIT [BLR-ATELIER] · CUSTOM SPEC', exportWidth - 28, exportHeight - 24);

    // Trigger download
    const link = document.createElement('a');
    link.download = `coded-fit-${this.state.productId}-${this.state.color.id}-${this.state.face}.png`;
    link.href = offCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


/** Add editable text to the active garment print area */
  addText(text = 'CODED FIT') {
    if (!this.canvas || typeof fabric === 'undefined') return;
    const obj = new fabric.IText(text, {
      left: this.canvas.getWidth() / 2,
      top: this.canvas.getHeight() / 2,
      originX: 'center',
      originY: 'center',
      fill: this.state.color.hex === '#f7f7f5' ? '#111111' : '#ffffff',
      fontFamily: 'Inter',
      fontSize: Math.max(18, Math.round(this.canvas.getWidth() * 0.10)),
      fontWeight: '700',
      padding: 6,
      cornerColor: '#d71920',
      transparentCorners: false
    });
    this.canvas.add(obj);
    this.canvas.setActiveObject(obj);
    obj.enterEditing();
    obj.selectAll();
    this.canvas.renderAll();
    this.recordHistory();
    this.onSelectionChange(obj);
  }
}