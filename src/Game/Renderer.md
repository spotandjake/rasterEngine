# Renderer
This document describes the rendering techniques and conventions used within the renderer.

# Convert from 2D Space to 3D Space
The choice on how to align 3d cords with 2d cords is somewhat arbitrary, most 2d renderers set the origin at the top left corner of the screen with the x and y coordinates pointing right and down. For the 3d coordinate system we are going to go with a Left handed Coordinate System.
### Notes
3D conversion to 2D Space
Y+ translates to y down
X+ translates to x up
z+ translates to towards the screen

# Sources
The renderer was built using the following resources as references:
* https://kitsunegames.com/post/development/2016/07/11/canvas3d-3d-rendering-in-javascript/