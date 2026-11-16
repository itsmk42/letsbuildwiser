# Scene assets

## Car model — attribution required

`car.glb` is adapted from **"Car Concept"** — © 2024 Darmstadt Graphics Group GmbH, model and textures by Eric Chadwick —
from the Khronos glTF Sample Assets (https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept),
licensed under Creative Commons Attribution 4.0 International (https://creativecommons.org/licenses/by/4.0/).

Changes made: Khronos and 3D Commerce logo textures removed (licence plate and tyre sidewalls made plain); geometry simplified
and compressed (9.8 MB → 0.9 MB); body repainted graphite blue and glass made opaque-tinted at load time.

## Sky and textures

The other files are derived from CC0 (public-domain) assets published by Poly Haven — https://polyhaven.com.
No attribution is required for these; this note is kept so the sources can be traced.

| File | Source asset | What was done |
|---|---|---|
| `sky.jpg` | HDRI `kloofendal_48d_partly_cloudy_puresky` (tone-mapped JPG) | Resized from 8192×4096 to 4096×2048 |
| `roof_navy.jpg`, `roof_nor.jpg` | Texture `roof_tiles_14` (1k diffuse, normal) | Diffuse converted to greyscale and re-coloured navy |
| `grass_diff.jpg`, `grass_nor.jpg` | Texture `leafy_grass` (1k diffuse, normal) | Diffuse shifted towards green |
| `paving_diff.jpg`, `paving_nor.jpg` | Texture `concrete_pavement_02` (1k diffuse, normal) | Diffuse desaturated and lightened |
| `asphalt_nor.jpg` | Texture `asphalt_02` (1k normal) | Re-encoded |

The sun's position in `sky.jpg` is recorded as `SKY_SUN` in `house-scene.js`; update it if the sky is replaced.
