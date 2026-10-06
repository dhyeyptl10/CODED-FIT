# Bespoke Studio

Routes: /studio and /bespoke open the print designer. /bespoke?mode=tailoring preserves body-fit controls.

Features: six procedural 3D garment previews, front/back text and artwork, raster upload, placement/scale/rotation, eight layers, undo/redo, local drafts, account designs, preview download, size/fit/fabric choices and customized cart/order data.

Pricing: base garment + fabric surcharge + INR 199 per printed side. The backend independently validates and prices print layers. Images are downsampled on the client, validated as inline PNG/JPEG/WebP, and preserved in order design data.

Catalog: run `npm --prefix backend run seed:studio` to add the 18 sample studio blanks without overwriting existing products. Illustrations can be recreated with `node create-studio-assets.cjs`. Catalog prices/stock are development defaults; confirm production inventory and fulfillment before selling.

Preview meshes are illustrative, not garment scans or print-production templates. Print placement, manufacturing specifications and physical output need production review. Live Razorpay checkout requires configured payment credentials. Mobile app TypeScript is checked; physical-device validation remains separate.

Validation (2026-09-22): production Next build and mobile tsc passed; six backend tests include order design persistence and server-authoritative print charges. Browser verified front/back layers, hoodie/color switching, draft restore, logo upload/render and cart design details. No horizontal overflow at 320px on home, shop, studio and tailoring; studio also checked at 390, 768 and 1440px.

## Follow-up (2026-09-28)

Added cart Edit design / Update bag flow. Updates replace the original line and recalculate totals, preserving other items. Deleted-line edits report the issue instead of silently duplicating. Added defensive saved-design validation, quantity adjustment on garment changes, print-side editor consistency and mobile cart wrapping. Browser verified add/edit/update without duplicate items and 390px drawer layout. Temporary test garment removed; pre-existing bag preserved.
