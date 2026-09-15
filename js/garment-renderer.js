/**
 * CODED FIT — Garment Renderer
 * Renders actual garment silhouettes instead of a generic editor box.
 */
function renderGarmentStage(garment, face='front') {
  const stage = document.getElementById('stage-wrap');
  if (!stage) return;
  const vb = garment.svgViewBox;
  const silhouette = garment.silhouette[face] || garment.silhouette.front;
  const color = garment.colors[0]?.hex || '#17181b';
  const print = garment.printAreas[face] || garment.printAreas.front;

  stage.innerHTML = `
    <div class="garment-product-stage" data-garment="${garment.id}">
      <svg id="garment-svg-front" class="garment-svg-view" viewBox="0 0 ${vb.w} ${vb.h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="garment-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity=".18"/>
          </filter>
          <linearGradient id="fabric-shade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0" stop-color="#000" stop-opacity=".22"/>
            <stop offset=".16" stop-color="#000" stop-opacity=".04"/>
            <stop offset=".50" stop-color="#fff" stop-opacity=".08"/>
            <stop offset=".84" stop-color="#000" stop-opacity=".05"/>
            <stop offset="1" stop-color="#000" stop-opacity=".22"/>
          </linearGradient>
        </defs>
        <g filter="url(#garment-shadow)">${silhouette.replaceAll('class="garment-body-fill"',`class="garment-body-fill" fill="${color}"`).replaceAll('class="garment-detail"','class="garment-detail" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="2"')}</g>
        <g opacity=".22">${silhouette.replaceAll('class="garment-body-fill"', 'class="garment-shade" fill="url(#fabric-shade)"').replaceAll('class="garment-detail"','style="display:none"')}</g>
      </svg>
      <svg id="garment-svg-back" class="garment-svg-view" viewBox="0 0 ${vb.w} ${vb.h}" xmlns="http://www.w3.org/2000/svg" style="display:none;">
        <defs>
          <filter id="garment-shadow-back" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity=".18"/></filter>
          <linearGradient id="fabric-shade-back" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
        </defs>
        <g filter="url(#garment-shadow-back)">${garment.silhouette.back.replaceAll('class="garment-body-fill"',`class="garment-body-fill" fill="${color}"`).replaceAll('class="garment-detail"','class="garment-detail" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="2"')}</g>
      </svg>
      <div class="garment-print-zone" id="print-zone-guide" style="left:${print.x}px;top:${print.y}px;width:${print.w}px;height:${print.h}px">
        <span>PRINT AREA</span>
      </div>
      <div class="fabric-canvas-container" id="fabric-layer" style="left:${print.x}px;top:${print.y}px;width:${print.w}px;height:${print.h}px">
        <canvas id="design-canvas"></canvas>
      </div>
    </div>
  `;
  // Canvas and guide scale with SVG using CSS transform-free percentage positioning.
  const wrap = stage.querySelector('.garment-product-stage');
  wrap.style.setProperty('--garment-w', vb.w);
  wrap.style.setProperty('--garment-h', vb.h);
  wrap.style.aspectRatio = `${vb.w}/${vb.h}`;
  const guide = stage.querySelector('#print-zone-guide');
  const canvasLayer = stage.querySelector('#fabric-layer');
  const update = () => {
    const rect = wrap.getBoundingClientRect();
    const sx = rect.width / vb.w, sy = rect.height / vb.h;
    guide.style.left = `${print.x*sx}px`; guide.style.top = `${print.y*sy}px`;
    guide.style.width = `${print.w*sx}px`; guide.style.height = `${print.h*sy}px`;
    canvasLayer.style.left = `${print.x*sx}px`; canvasLayer.style.top = `${print.y*sy}px`;
    canvasLayer.style.width = `${print.w*sx}px`; canvasLayer.style.height = `${print.h*sy}px`;
  };
  requestAnimationFrame(update);
  window.addEventListener('resize', update, {passive:true});
}