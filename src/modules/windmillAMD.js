//import Accessor from "@arcgis/core/core/Accessor.js";
import * as externalRenderers from "@arcgis/core/views/3d/externalRenderers.js";
import * as glMatrix from "gl-matrix";
const maxWindmills = 1;

// Size of the windmills.
// The raw model has a height of ~10.0 units.
const windmillHeight = 10;
const windmillBladeSize = 4;


define(["esri/core/Accessor"], (Accessor) => {
    MyExternalRenderer: Accessor.createSubclass({
        // Input data
        wind: null,
        stations: null,
        view: null,
      
        // Number of stations to render
        numStations: null,
      
        // Local origin
        localOrigin: null,
        localOriginRender: null,
      
        // Vertex and index buffers
        vboBasePositions: null,
        vboBaseNormals: null,
        iboBase: null,
        vboBladesPositions: null,
        vboBladesNormals: null,
        iboBlades: null,
      
        // Vertex and index data
        windmillBasePositions: null,
        windmillBaseNormals: null,
        windmillBaseIndices: null,
        windmillBladesPositions: null,
        windmillBladesNormals: null,
        windmillBladesIndices: null,
      
        // Shader
        program: null,
      
        // Shader attribute and uniform locations
        programAttribVertexPosition: null,
        programAttribVertexNormal: null,
        programUniformProjectionMatrix: null,
        programUniformModelViewMatrix: null,
        programUniformNormalMatrix: null,
        programUniformAmbientColor: null,
        programUniformLightingDirection: null,
        programUniformDirectionalColor: null,
      
        // Per-instance data
        windmillInstanceWindSpeed: null,
        windmillInstanceRPM: null,
        windmillInstanceWindDirection: null,
        windmillInstanceTowerScale: null,
        windmillInstanceBladeScale: null,
        windmillInstanceBladeOffset: null,
        windmillInstanceInputToRender: null,
      
        // Temporary matrices and vectors,
        // used to avoid allocating objects in each frame.
        tempMatrix4: new Float32Array(16),
        tempMatrix3: new Float32Array(9),
        tempVec3: new Float32Array(3),
      
        /**
         * Constructor
         */
        constructor(view, wind, stations) {
          this.view = view;
          this.wind = wind;
          this.stations = stations;
        },
      
        /**
         * Called once after this external renderer is added to the scene.
         * This is part of the external renderer interface.
         */
        setup(context) {
            console.log("I AM EHRE")
          this.initShaders(context);
          this.initData(context, this.wind, this.stations);
      
          // cleanup
          context.resetWebGLState();
        },
      
        /**
         * Called each time the scene is rendered.
         * This is part of the external renderer interface.
         */
        render(context) {
            console.log("OK")
          const gl = context.gl;
          const time = Date.now() / 1000.0;
      
          // Set some global WebGL state
          // State will be reset between each render() call
          gl.enable(gl.DEPTH_TEST);
          gl.disable(gl.CULL_FACE);
          gl.disable(gl.BLEND);
      
          // Enable our shader
          gl.useProgram(this.program);
          this.setCommonUniforms(context);
      
          // Draw all the bases (one draw call)
          this.bindWindmillBase(context);
          glMatrix.mat4.identity(this.tempMatrix4);
      
          // Apply local origin by translation the view matrix by the local origin, this will
          // put the view origin (0, 0, 0) at the local origin
          glMatrix.mat4.translate(
            this.tempMatrix4,
            this.tempMatrix4,
            this.localOriginRender
          );
          glMatrix.mat4.multiply(
            this.tempMatrix4,
            context.camera.viewMatrix,
            this.tempMatrix4
          );
          gl.uniformMatrix4fv(
            this.programUniformModelViewMatrix,
            false,
            this.tempMatrix4
          );
      
          // Normals are in world coordinates, normal transformation is therefore identity
          glMatrix.mat3.identity(this.tempMatrix3);
          gl.uniformMatrix3fv(
            this.programUniformNormalMatrix,
            false,
            this.tempMatrix3
          );
      
          gl.drawElements(
            gl.TRIANGLES,
            this.windmillBaseIndices.length,
            gl.UNSIGNED_SHORT,
            0
          );
      
          // Draw all the blades (one draw call per set of blades)
          this.bindWindmillBlades(context);
          for (let i = 0; i < this.numStations; ++i) {
            // Current rotation of the blade (varies with time, random offset)
            const bladeRotation = (time / 60) * this.windmillInstanceRPM[i] + i;
      
            // Blade transformation:
            // 1. Scale (according to blade size)
            // 2. Rotate around Y axis (according to wind speed, varies with time)
            // 3. Rotate around Z axis (according to wind direction)
            // 4. Translate along Z axis (to where the blades are attached to the base)
            // 5. Transform to render coordinates
            // 6. Transform to view coordinates
            glMatrix.mat4.identity(this.tempMatrix4);
            glMatrix.mat4.translate(
              this.tempMatrix4,
              this.tempMatrix4,
              this.windmillInstanceBladeOffset[i]
            );
            glMatrix.mat4.rotateZ(
              this.tempMatrix4,
              this.tempMatrix4,
              this.windmillInstanceWindDirection[i]
            );
            glMatrix.mat4.rotateY(this.tempMatrix4, this.tempMatrix4, bladeRotation);
            glMatrix.mat4.scale(
              this.tempMatrix4,
              this.tempMatrix4,
              this.windmillInstanceBladeScale[i]
            );
            glMatrix.mat4.multiply(
              this.tempMatrix4,
              this.windmillInstanceInputToRender[i],
              this.tempMatrix4
            );
            glMatrix.mat3.normalFromMat4(this.tempMatrix3, this.tempMatrix4);
            glMatrix.mat4.multiply(
              this.tempMatrix4,
              context.camera.viewMatrix,
              this.tempMatrix4
            );
            gl.uniformMatrix4fv(
              this.programUniformModelViewMatrix,
              false,
              this.tempMatrix4
            );
            gl.uniformMatrix3fv(
              this.programUniformNormalMatrix,
              false,
              this.tempMatrix3
            );
            gl.drawElements(
              gl.TRIANGLES,
              this.windmillBladesIndices.length,
              gl.UNSIGNED_SHORT,
              0
            );
          }
      
          // Draw continuously
          externalRenderers.requestRender(view);
      
          // cleanup
          context.resetWebGLState();
        },
      
        /**
         * Loads a shader from a <script> html tag
         */
        getShader(gl, id) {
            console.log("Hsdsdf")
          const shaderScript = document.getElementById(id);
          if (!shaderScript) {
            return null;
          }
      
          let str = "";
          let k = shaderScript.firstChild;
          while (k) {
            if (k.nodeType == 3) {
              str += k.textContent;
            }
            k = k.nextSibling;
          }
      
          let shader;
          if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
          } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
          } else {
            return null;
          }
      
          gl.shaderSource(shader, str);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
          }
      
          return shader;
        },
      
        /**
         * Links vertex and fragment shaders into a GLSL program
         */
        linkProgram(gl, fragmentShader, vertexShader) {
            console.log("sdfgfd")
          const shaderProgram = gl.createProgram();
      
          gl.attachShader(shaderProgram, vertexShader);
          gl.attachShader(shaderProgram, fragmentShader);
          gl.linkProgram(shaderProgram);
      
          if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            return null;
          }
      
          return shaderProgram;
        },
      
        /**
         * Initializes all shaders requried by the application
         */
        initShaders(context) {
            console.log("dsfg")
          const gl = context.gl;
      
          const fragmentShader = this.getShader(gl, "shader-fs");
          const vertexShader = this.getShader(gl, "shader-vs");
          this.program = this.linkProgram(gl, fragmentShader, vertexShader);
          if (!this.program) {
            alert("Could not initialise shaders");
          }
      
          gl.useProgram(this.program);
      
          // Program attributes
          this.programAttribVertexPosition = gl.getAttribLocation(
            this.program,
            "aVertexPosition"
          );
          gl.enableVertexAttribArray(this.programAttribVertexPosition);
      
          this.programAttribVertexNormal = gl.getAttribLocation(
            this.program,
            "aVertexNormal"
          );
          gl.enableVertexAttribArray(this.programAttribVertexNormal);
      
          // Program uniforms
          this.programUniformProjectionMatrix = gl.getUniformLocation(
            this.program,
            "uProjectionMatrix"
          );
          this.programUniformModelViewMatrix = gl.getUniformLocation(
            this.program,
            "uModelViewMatrix"
          );
          this.programUniformNormalMatrix = gl.getUniformLocation(
            this.program,
            "uNormalMatrix"
          );
          this.programUniformAmbientColor = gl.getUniformLocation(
            this.program,
            "uAmbientColor"
          );
          this.programUniformLightingDirection = gl.getUniformLocation(
            this.program,
            "uLightingDirection"
          );
          this.programUniformDirectionalColor = gl.getUniformLocation(
            this.program,
            "uDirectionalColor"
          );
        },
      
        /**
         * Creates a vertex buffer from the given data.
         */
        createVertexBuffer(gl, data) {
            console.log("dfdg")
          const buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      
          // We have filled vertex buffers in 64bit precision,
          // convert to a format compatible with WebGL
          const float32Data = new Float32Array(data);
      
          gl.bufferData(gl.ARRAY_BUFFER, float32Data, gl.STATIC_DRAW);
          return buffer;
        },
      
        /**
         * Creates an index buffer from the given data.
         */
        createIndexBuffer(gl, data) {
            console.log("dsfgdgd")
          const buffer = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
          return buffer;
        },
      
        /**
         * Rotations per second of our turbine for a given wind speed (in km/h).
         *
         * This is not an exact physical formula, but rather a rough guess used
         * to show qualitative differences between wind speeds.
         */
        getRPM(windSpeed, bladeLength) {
            console.log("werwerrg")
          const tipSpeedRatio = 6.0;
          return (
            (60 * ((windSpeed * 1000) / 3600) * tipSpeedRatio) /
            (Math.PI * 2 * bladeLength)
          );
        },
      
        /**
         * Initializes all windmill data
         *
         * General overview:
         * - We create a single vertex buffer with all the vertices of all windmill bases.
         *   This way we can render all the bases in a single draw call.
         * - Storing the vertices directly in render coordinates would introduce precision issues.
         *   We store them in the coordinate system of a local origin of our choice instead.
         * - We create a vertex buffer with the vertices of one set of windmill blades.
         *   Since the blades are animated, we render each set of blades with a different,
         *   time-dependent transformation.
         */
        initData(context, wind, stations) {
            console.log("Here")
          const gl = context.gl;
          this.numStations = Math.min(stations.length, maxWindmills);
      
          // Choose a local origin.
          // In our case, we simply use the map center.
          // For global scenes, you'll need multiple local origins.
          //const localOriginSR = mapExtent.center.spatialReference;
          const localOriginSR = view.extent.center.spatialReference;
          //console.log(localOriginSR)
          //this.localOrigin = [mapExtent.center.x, mapExtent.center.y, 0];
          this.localOrigin = [view.extent.center.x, view.extent.center.y, 0];
      
          // Calculate local origin in render coordinates with 32bit precision
          this.localOriginRender = externalRenderers.toRenderCoordinates(
            view,
            this.localOrigin,
            0,
            localOriginSR,
            new Float32Array(3),
            0,
            1
          );
      
          // Extract station data into flat arrays.
          this.windmillInstanceWindSpeed = new Float32Array(this.numStations);
          this.windmillInstanceRPM = new Float32Array(this.numStations);
          this.windmillInstanceWindDirection = new Float32Array(this.numStations);
          this.windmillInstanceTowerScale = new Float32Array(this.numStations);
          this.windmillInstanceBladeScale = new Array(this.numStations);
          this.windmillInstanceBladeOffset = new Array(this.numStations);
          this.windmillInstanceInputToRender = new Array(this.numStations);
      
          for (let i = 0; i < this.numStations; ++i) {
            const station = stations[i];
            //const bladeLength = station.getAttribute("blade_l");
            // TODO seda etakist ei saa, ilmselt mingi custom
            const bladeLength = 29.5;
            //const towerHeight = station.getAttribute("tower_h");
            // TODO see tuleb pärast ETAK-st
            const towerHeight = 60;
            console.log(bladeLength, towerHeight);
      
            // Speed and direction.
            this.windmillInstanceWindSpeed[i] = wind.speed;
            this.windmillInstanceRPM[i] = this.getRPM(wind.speed, bladeLength);
            this.windmillInstanceWindDirection[i] = (wind.direction / 180) * Math.PI;
      
            // Offset and scale
            const towerScale = towerHeight / windmillHeight;
            this.windmillInstanceTowerScale[i] = towerScale;
            const bladeScale = bladeLength / windmillBladeSize;
            this.windmillInstanceBladeScale[i] = [bladeScale, bladeScale, bladeScale];
            this.windmillInstanceBladeOffset[i] = glMatrix.vec3.create();
            glMatrix.vec3.scale(
              this.windmillInstanceBladeOffset[i],
              windmill_blades_offset,
              towerScale
            );
      
            // Transformation from input to render coordinates.
            //const inputSR = station.geometry.spatialReference;
            const inputSR = { wkid: 3301 };
            // TODO kuidas pärida Z külge, mingist muust teenusest at runtime z-koordinaat näiteks
            console.log(station.geometry.coordinates[0]);
            const point = [
              //station.geometry.x,
              548728.11,
              //station.geometry.coordinates[0],
              //station.geometry.coordinates[1],
              6590072.44,
              //station.geometry.y,
              //station.getAttribute("POINT_Z") || station.geometry.z
              40,
            ];
      
            console.log("Tuulik coordinates", point);
            const inputToRender = externalRenderers.renderCoordinateTransformAt(
              view,
              point,
              inputSR,
              new Float64Array(16)
            );
            this.windmillInstanceInputToRender[i] = inputToRender;
          }
      
          // Transform all vertices of the windmill base into the coordinate system of
          // the local origin, and merge them into a single vertex buffer.
          this.windmillBasePositions = new Float64Array(
            this.numStations * windmill_base_positions.length
          );
          this.windmillBaseNormals = new Float64Array(
            this.numStations * windmill_base_normals.length
          );
          this.windmillBaseIndices = new Uint16Array(
            this.numStations * windmill_base_indices.length
          );
      
          for (let i = 0; i < this.numStations; ++i) {
            // Transformation of positions from local to render coordinates
            const positionMatrix = new Float64Array(16);
            glMatrix.mat4.identity(positionMatrix);
            glMatrix.mat4.rotateZ(
              positionMatrix,
              positionMatrix,
              this.windmillInstanceWindDirection[i]
            );
            glMatrix.mat4.multiply(
              positionMatrix,
              this.windmillInstanceInputToRender[i],
              positionMatrix
            );
      
            // Transformation of normals from local to render coordinates
            const normalMatrix = new Float64Array(9);
            glMatrix.mat3.normalFromMat4(normalMatrix, positionMatrix);
      
            // Append vertex and index data
            const numCoordinates = windmill_base_positions.length;
            const numVertices = numCoordinates / 3;
            for (let j = 0; j < numCoordinates; ++j) {
              this.windmillBasePositions[i * numCoordinates + j] =
                windmill_base_positions[j] * this.windmillInstanceTowerScale[i];
              this.windmillBaseNormals[i * numCoordinates + j] =
                windmill_base_normals[j];
            }
      
            // Transform vertices into render coordinates
            glMatrix.vec3.forEach(
              this.windmillBasePositions,
              0,
              i * numCoordinates,
              numVertices,
              glMatrix.vec3.transformMat4,
              positionMatrix
            );
      
            // Subtract local origin coordinates
            glMatrix.vec3.forEach(
              this.windmillBasePositions,
              0,
              i * numCoordinates,
              numVertices,
              glMatrix.vec3.subtract,
              this.localOriginRender
            );
      
            // Transform normals into render coordinates
            glMatrix.vec3.forEach(
              this.windmillBaseNormals,
              0,
              i * numCoordinates,
              numVertices,
              glMatrix.vec3.transformMat3,
              normalMatrix
            );
      
            // Re-normalize normals
            glMatrix.vec3.forEach(
              this.windmillBaseNormals,
              0,
              i * numCoordinates,
              numVertices,
              glMatrix.vec3.normalize
            );
      
            // Append index data
            const numIndices = windmill_base_indices.length;
            for (let j = 0; j < numIndices; ++j) {
              this.windmillBaseIndices[i * numIndices + j] =
                windmill_base_indices[j] + i * numVertices;
            }
          }
      
          // Copy the vertices of the windmill blades
          this.windmillBladesPositions = new Float64Array(windmill_blades_positions);
          this.windmillBladesNormals = new Float64Array(windmill_blades_normals);
          this.windmillBladesIndices = new Uint16Array(windmill_blades_indices);
      
          // Upload our data to WebGL
          this.vboBasePositions = this.createVertexBuffer(
            gl,
            this.windmillBasePositions
          );
          this.vboBaseNormals = this.createVertexBuffer(gl, this.windmillBaseNormals);
          this.vboBladesPositions = this.createVertexBuffer(
            gl,
            this.windmillBladesPositions
          );
          this.vboBladesNormals = this.createVertexBuffer(
            gl,
            this.windmillBladesNormals
          );
          this.iboBase = this.createIndexBuffer(gl, this.windmillBaseIndices);
          this.iboBlades = this.createIndexBuffer(gl, this.windmillBladesIndices);
        },
      
        /**
         * Activates vertex attributes for the drawing of the windmill base.
         */
        bindWindmillBase(context) {
            console.log("fesdfdfgv")
          const gl = context.gl;
      
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vboBasePositions);
          gl.enableVertexAttribArray(this.programAttribVertexPosition);
          gl.vertexAttribPointer(
            this.programAttribVertexPosition,
            3,
            gl.FLOAT,
            false,
            0,
            0
          );
      
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vboBaseNormals);
          gl.enableVertexAttribArray(this.programAttribVertexNormal);
          gl.vertexAttribPointer(
            this.programAttribVertexNormal,
            3,
            gl.FLOAT,
            false,
            0,
            0
          );
      
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iboBase);
        },
      
        /**
         * Activates vertex attributes for the drawing of the windmill blades.
         */
        bindWindmillBlades(context) {
            console.log("fsdffg")
          const gl = context.gl;
      
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vboBladesPositions);
          gl.enableVertexAttribArray(this.programAttribVertexPosition);
          gl.vertexAttribPointer(
            this.programAttribVertexPosition,
            3,
            gl.FLOAT,
            false,
            0,
            0
          );
      
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vboBladesNormals);
          gl.enableVertexAttribArray(this.programAttribVertexNormal);
          gl.vertexAttribPointer(
            this.programAttribVertexNormal,
            3,
            gl.FLOAT,
            false,
            0,
            0
          );
      
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iboBlades);
        },
      
        /**
         * Returns a color vector from a {color, intensity} object.
         */
        getFlatColor(src, output) {
            console.log("sdf")
          output[0] = src.color[0] * src.intensity;
          output[1] = src.color[1] * src.intensity;
          output[2] = src.color[2] * src.intensity;
          return output;
        },
      
        /**
         * Sets common shader uniforms
         */
        setCommonUniforms(context) {
            console.log("reegfdf")
          const gl = context.gl;
          const camera = context.camera;
      
          gl.uniform3fv(
            this.programUniformDirectionalColor,
            this.getFlatColor(context.sunLight.diffuse, this.tempVec3)
          );
          gl.uniform3fv(
            this.programUniformAmbientColor,
            this.getFlatColor(context.sunLight.ambient, this.tempVec3)
          );
          gl.uniform3fv(
            this.programUniformLightingDirection,
            context.sunLight.direction
          );
      
          gl.uniformMatrix4fv(
            this.programUniformProjectionMatrix,
            false,
            context.camera.projectionMatrix
          );
        },
      });



})