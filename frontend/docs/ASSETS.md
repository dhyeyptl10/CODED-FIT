# Realistic character and garment delivery contract

To move from the current procedural character to a realistic fitting room, commission or license an original adult human model and garment collection. A rendered image of a person is not a usable 3D avatar. Do not copy GTA/Rockstar models or clothing without rights.

Deliver an embedded `.glb` under 30 MB for the existing import UI. Use metres, Y-up, feet on the ground and neutral forward orientation. The importer normalizes the model height to the current preview.

Recommended production asset set:

| Asset | Required content |
|---|---|
| Human | Anatomical body, face, hands, feet, hair, multiple skin materials, one consistent skeleton |
| Garments | Separate T-shirt, shirt, hoodie and trousers with real seams, openings, thickness and fabric folds |
| Materials | Base color, normal, roughness and occlusion textures with licensed provenance |
| Fit variants | Size/shape morphs for chest, waist, hips, shoulders and length; prevent skin intersections |
| Animation | Idle, fitting pose and turn animation using the same skeleton |
| Mobile | Reduced geometry/textures and low-detail variants validated on actual phones |

Current import contract: mesh names containing `garment`, `cloth`, `shirt`, `hoodie` or `pants` receive the selected garment color. Morph target names `chest` and `waist` receive normalized slider values. Imported models replace the procedural figure; automatic retargeting, garment swaps, advanced poses, model persistence, skin-tone replacement and full simulation for arbitrary imported GLBs are **not** implemented.

For the production upgrade, load avatar and garment GLBs separately with a shared rig; drive body morphs and matching clothing morphs from one measurement profile; add animation mixing and collision-aware precomputed drapes. Use an actual body reconstruction/photo try-on service only with user consent and defined deletion policies. A single photo cannot establish reliable physical measurements or guarantee fit.
