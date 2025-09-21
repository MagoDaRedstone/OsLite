console.clear();

// ===================== FUNÇÃO PARA PEGAR O PLAYER =====================
function getMoviePlayer() {
    const videoElement = document.querySelector("video.html5-main-video");
    if (videoElement) return videoElement.closest(".html5-video-player") || videoElement.parentElement;

    const byId = document.getElementById("movie_player") || document.getElementById("ytd-player");
    if (byId) return byId;

    const bySelector = document.querySelector("#movie_player")
                     || document.querySelector("#ytd-player")
                     || document.querySelector("ytd-player")
                     || document.querySelector(".html5-video-player");
    if (bySelector) return bySelector;

    const byClass = document.getElementsByClassName("html5-video-player");
    if (byClass && byClass.length > 0) return byClass[0];

    const videos = document.querySelectorAll("video");
    for (const v of videos) {
        if ((v.src && (v.src.includes("youtube.com") || v.src.includes("ytimg.com")))) {
            return v.closest(".html5-video-player") || v.parentElement || v;
        }
        const sources = v.querySelectorAll("source");
        for (const s of sources) {
            if (s.src.includes("youtube.com") || s.src.includes("ytimg.com")) {
                return v.closest(".html5-video-player") || v.parentElement || v;
            }
        }
    }

    const iframes = document.querySelectorAll("iframe");
    for (const f of iframes) {
        if (f.src && f.src.includes("youtube.com/embed")) return f;
    }

    return null;
}

// ===================== FUNÇÃO PARA ESPERAR O PLAYER =====================
function waitForMoviePlayer(timeout = 5000, interval = 100) {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        const check = () => {
            const player = getMoviePlayer();
            if (player) {
                resolve(player);
            } else if (Date.now() - start > timeout) {
                reject("Timeout: Movie player não encontrado.");
            } else {
                setTimeout(check, interval);
            }
        };

        check();
    });
}

// ===================== FUNÇÃO PARA MENSAGENS =====================
function showMessage(message, duration = 3000) {
    let existingMessage = document.getElementById("custom-message");
    if (existingMessage) existingMessage.remove();

    const messageDiv = document.createElement("div");
    messageDiv.id = "custom-message";
    messageDiv.textContent = message;
    Object.assign(messageDiv.style, {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        backgroundColor: "rgba(0,0,0,0.8)",
        color: "#fff",
        borderRadius: "5px",
        zIndex: "100000001",
        textAlign: "center",
        fontSize: "16px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.5)"
    });
    document.body.appendChild(messageDiv);

    setTimeout(() => messageDiv.remove(), duration);
}

// ===================== ESPERA PELO PLAYER E INICIA O SISTEMA =====================
waitForMoviePlayer(10000, 200) // espera até 10s, checando a cada 200ms
    .then(moviePlayer => {
        console.log("Movie player encontrado:", moviePlayer);

        // ===================== BOTÃO TOGGLE DO SO =====================
        const button = document.createElement("button");
        button.textContent = "Toggle Sistema";
        Object.assign(button.style, {
            position: "absolute",
            zIndex: "99999999",
            top: "2%",
            left: "15%"
        });
        document.body.appendChild(button);

        let soContainer = null;
        let currentAppCanvas = null;
        let gameLoopDoom = null;
        let gameLoopMine = null;

        button.addEventListener("click", () => {
            if (soContainer) {
                // fechar SO
                if (currentAppCanvas) { currentAppCanvas.remove(); currentAppCanvas = null; }
                gameLoopDoom = null; gameLoopMine = null;
                soContainer.remove(); soContainer = null;

                // delay de 500ms para mostrar o video player
                setTimeout(() => {
                    moviePlayer.style.setProperty("display", "block", "important");
                    moviePlayer.style.visibility = "visible";
                    moviePlayer.style.display = "block";
                }, 500);
            } else {
                // abrir SO

                // delay de 500ms para ocultar o video player
                setTimeout(() => {
                    moviePlayer.style.setProperty("display", "none", "important");
                    moviePlayer.style.visibility = "hidden";
                    moviePlayer.style.display = "none";
                }, 500);

                soContainer = document.createElement("div");
                Object.assign(soContainer.style, {
                    position: "absolute",
                    top: "6%",
                    left: "0",
                    width: "100%",
                    height: "79%",
                    background: "#444",
                    color: "#fff",
                    zIndex: "100000000",
                    fontFamily: "monospace"
                });
                document.body.appendChild(soContainer);

                startScreen(soContainer);
            }
        });

        // ===================== FUNÇÕES DO SO =====================
        function startScreen(container) {
            container.innerHTML = `
                <h3 style="text-align:center;">Bem-vindo ao Sistema</h3>
                <button id="startSystem">Start Sistema</button>
                <button id="installSystem">Instal/Desinstal</button>
            `;

            container.querySelector("#startSystem").onclick = () => {
                if (localStorage.getItem("mySOInstalled") !== "true") {
                    showMessage("O sistema não está instalado! Por favor, use o menu de instalação.");
                    return;
                }

                loadingScreen(container, () => {
                    const savedUser = localStorage.getItem("soUser");
                    const savedPass = localStorage.getItem("soPass");

                    if (savedUser && savedPass) {
                        loginScreen(container); // já existe usuário, vai direto pro login
                    } else {
                        registrationScreen(container); // não existe, vai pro registro
                    }
                });
            };

            container.querySelector("#installSystem").onclick = () => installScreen(container);
        }

        function loadingScreen(container, callback) {
            container.innerHTML = `<h3>Iniciando...</h3><div id="progressBar" style="width:80%;height:20px;border:1px solid #fff;margin:20px auto;"><div id="progress" style="width:0%;height:100%;background:#0f0;"></div></div>`;
            const progress = container.querySelector("#progress");
            let pct = 0;
            const interval = setInterval(() => {
                pct += 2; progress.style.width = pct + "%";
                if (pct >= 100) { clearInterval(interval); callback(); }
            }, 50);
        }

        function installScreen(container) {
            container.innerHTML = `
                <h3>Instal/Desinstal Sistema</h3>
                <button id="installBtn">Install</button>
                <button id="desinstallBtn">Desinstall</button>
                <div id="progressBar" style="width:80%;height:20px;border:1px solid #fff;margin:20px auto;"><div id="progress" style="width:0%;height:100%;background:#0f0;"></div></div>
                <button id="backBtn">Voltar</button>
            `;
            const progress = container.querySelector("#progress");
            container.querySelector("#backBtn").onclick = () => startScreen(container);
            container.querySelector("#installBtn").onclick = () => {
                let pct = 0;
                const interval = setInterval(() => { pct+=5; progress.style.width = pct+"%"; if(pct>=100){ clearInterval(interval); localStorage.setItem("mySOInstalled","true"); showMessage("Sistema instalado!"); } },50);
            };
            container.querySelector("#desinstallBtn").onclick = () => {
                let pct = 0;
                const interval = setInterval(() => { pct+=5; progress.style.width = pct+"%"; if(pct>=100){ clearInterval(interval); localStorage.removeItem("mySOInstalled"); showMessage("Sistema desinstalado!"); } },50);
            };
        }

        function registrationScreen(container) {
            container.innerHTML = `
                <h3>Registro</h3>
                <input type="text" placeholder="Usuário" id="userInput"><br><br>
                <input type="password" placeholder="Senha" id="passInput"><br><br>
                <button id="registerBtn">Registrar</button>
            `;

            container.querySelector("#registerBtn").onclick = () => {
                const user = container.querySelector("#userInput").value.trim();
                const pass = container.querySelector("#passInput").value.trim();

                if (!user || !pass) {
                    showMessage("Por favor, preencha usuário e senha.");
                    return;
                }

                localStorage.setItem("soUser", user);
                localStorage.setItem("soPass", pass);
                showMessage("Usuário registrado com sucesso!");
                loginScreen(container); // vai para o login
            };
        }

        function loginScreen(container) {
            container.innerHTML = `
                <h3>Login</h3>
                <input type="text" placeholder="Usuário" id="loginUser"><br><br>
                <input type="password" placeholder="Senha" id="loginPass"><br><br>
                <button id="loginBtn">Login</button>
            `;

            container.querySelector("#loginBtn").onclick = () => {
                const user = container.querySelector("#loginUser").value.trim();
                const pass = container.querySelector("#loginPass").value.trim();

                const savedUser = localStorage.getItem("soUser");
                const savedPass = localStorage.getItem("soPass");

                if (user === savedUser && pass === savedPass) {
                    showMessage("Login bem-sucedido!");
                    desktopScreen(container);
                } else {
                    showMessage("Usuário ou senha incorretos!");
                }
            };
        }

        function desktopScreen(container) {
            container.innerHTML = `
                <div id="desktop" style="width:100%;height:101%;position:relative;background:#008;background-size:cover;color:#fff;">
                    <div id="taskbar" style="position:absolute;bottom:0;width:98.6%;height:30px;background:#333;display:flex;align-items:center;justify-content:space-between;padding:0 10px;">
                        <span id="startMenuBtn" style="cursor:pointer;">Iniciar</span>
                        <span id="clock"></span>
                    </div>
                    <div id="startMenu" style="position:absolute;bottom:30px;left:0;width:200px;background:#222;border:1px solid #555;display:none;">
                        <div style="padding:5px;cursor:pointer;" id="calcApp">Calculadora</div>
                        <div style="padding:5px;cursor:pointer;" id="notepadApp">Bloco de Notas</div>
                        <div style="padding:5px;cursor:pointer;" id="calendarApp">Calendário</div>
                        <div style="padding:5px;cursor:pointer;" id="doomApp">Doom 3D</div>
                        <div style="padding:5px;cursor:pointer;" id="mineApp">Minecraft 3D</div>
                    </div>
                    <div id="appWindow" style="position:absolute;top:10%;left:10%;width:80%;height:70%;background:#555;display:none;padding:10px;"></div>
                </div>
            `;

            const startBtn = container.querySelector("#startMenuBtn");
            const startMenu = container.querySelector("#startMenu");
            startBtn.onclick = () => { startMenu.style.display = startMenu.style.display==="none"?"block":"none"; if(currentAppCanvas){currentAppCanvas.remove(); currentAppCanvas=null; gameLoopDoom=null; gameLoopMine=null;} };
            const clock = container.querySelector("#clock");
            setInterval(()=>{ clock.textContent = new Date().toLocaleTimeString(); },1000);

            const appWindow = container.querySelector("#appWindow");
            function openApp(appContent){ appWindow.style.display="block"; appWindow.innerHTML=appContent; if(currentAppCanvas){currentAppCanvas.remove();} gameLoopDoom=null; gameLoopMine=null; }

            container.querySelector("#calcApp").onclick = () => { openApp(`<h3>Calculadora</h3><input id="calcInput" style="width:100%"><br><button onclick="alert(eval(document.getElementById('calcInput').value))">=</button>`); };
            container.querySelector("#notepadApp").onclick = () => { openApp(`<h3>Bloco de Notas</h3><textarea style="width:100%;height:150px"></textarea>`); };
            container.querySelector("#calendarApp").onclick = () => { openApp(`<h3>Calendário</h3><p>${new Date().toDateString()}</p>`); };

            // ===================== DOOM 3D APP =====================
            container.querySelector("#doomApp").onclick = () => {
                openApp(`<h3>Doom 3D</h3><canvas id="doomCanvas" width="${appWindow.clientWidth}" height="${appWindow.clientHeight}" style="background:#aaa;width:100%;height:100%"></canvas>`);
                const dm = appWindow.querySelector("#doomCanvas");
                currentAppCanvas = dm;
                const ctx = dm.getContext('2d');

                const map = [
                    [1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1, 1],
                    [1, 0, 1, 0, 1, 1],
                    [1, 0, 1, 0, 1, 1],
                    [1, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1]
                ];
                const player = { x: 2, y: 2, angle: 0, speed: 0.1, turnSpeed: 0.05 };
                const keys = {};

                function drawDoom() {
                    if (!gameLoopDoom) return;
                    ctx.clearRect(0, 0, dm.width, dm.height);
                    for (let x = 0; x < dm.width; x++) {
                        const rayAngle = player.angle - Math.PI / 6 + (x / dm.width) * (Math.PI / 3);
                        let distance = 0, hit = false, rayX = player.x, rayY = player.y;
                        while (!hit && distance < 10) {
                            distance += 0.1;
                            rayX = player.x + Math.cos(rayAngle) * distance;
                            rayY = player.y + Math.sin(rayAngle) * distance;
                            const mapX = Math.floor(rayX), mapY = Math.floor(rayY);
                            if (map[mapY] && map[mapY][mapX] === 1) hit = true;
                        }
                        const wallHeight = dm.height / (distance * Math.cos(rayAngle - player.angle));
                        ctx.fillStyle = 'gray';
                        ctx.fillRect(x, dm.height / 2 - wallHeight / 2, 1, wallHeight);
                    }
                    requestAnimationFrame(drawDoom);
                }

                function moveDoom() {
                    if (!gameLoopDoom) return;
                    if (keys['w']) { player.x += Math.cos(player.angle) * player.speed; player.y += Math.sin(player.angle) * player.speed; }
                    if (keys['s']) { player.x -= Math.cos(player.angle) * player.speed; player.y -= Math.sin(player.angle) * player.speed; }
                    if (keys['a']) { player.angle -= player.turnSpeed; }
                    if (keys['d']) { player.angle += player.turnSpeed; }
                }

                gameLoopDoom = true;
                window.addEventListener('keydown', (e) => { if(gameLoopDoom) keys[e.key.toLowerCase()] = true; });
                window.addEventListener('keyup', (e) => { if(gameLoopDoom) keys[e.key.toLowerCase()] = false; });

                drawDoom();
                setInterval(moveDoom, 16);
            };

            // ===================== MINECRAFT 3D APP =====================
            container.querySelector("#mineApp").onclick = () => {
                openApp(`<canvas id="mineCanvas" style="width:100%;height:100%;"></canvas>`);
                const canvas = appWindow.querySelector("#mineCanvas");
                currentAppCanvas = canvas;
                const gl = canvas.getContext("webgl");
                if (!gl) { console.error("WebGL não suportado"); return; }

                canvas.width = appWindow.clientWidth;
                canvas.height = appWindow.clientHeight;

                // ==== utils de matriz/vetor ====
                function perspective(fovy, aspect, near, far) {
                    const f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
                    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, (2 * far * near) * nf, 0]);
                }
                function normalize(v){ const l = Math.hypot(v[0],v[1],v[2]) || 1; return [v[0]/l, v[1]/l, v[2]/l]; }
                function cross(a, b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
                function dot(a, b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }
                function lookAt(eye, center, up) {
                    const f = normalize([center[0]-eye[0], center[1]-eye[1], center[2]-eye[2]]);
                    const s = normalize(cross(f, up));
                    const u = cross(s, f);
                    return new Float32Array([s[0], u[0], -f[0], 0, s[1], u[1], -f[1], 0, s[2], u[2], -f[2], 0, -dot(s, eye), -dot(u, eye), dot(f, eye), 1]);
                }
                function translation(x,y,z){ return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]); }

                // ==== classes ====
                class Camera {
                    constructor() {
                        this.position = [0,2,5]; this.up=[0,1,0]; this.theta=-Math.PI/2; this.phi=0; this.speed=0.18; this.sensitivity=0.002;
                        this._front=[0,0,-1]; this._updateVectors();
                    }
                    _updateVectors() {
                        this._front=[Math.cos(this.phi)*Math.cos(this.theta), Math.sin(this.phi), Math.cos(this.phi)*Math.sin(this.theta)];
                        const r = cross(this._front,this.up); const len=Math.hypot(r[0],r[1],r[2])||1; this._right=[r[0]/len,r[1]/len,r[2]/len];
                    }
                    rotate(deltaYaw,deltaPitch){ this.theta+=deltaYaw*this.sensitivity; this.phi-=deltaPitch*this.sensitivity; const lim=Math.PI/2-0.001; if(this.phi>lim)this.phi=lim; if(this.phi<-lim)this.phi=-lim; this._updateVectors(); }
                    move(keys){ if(keys['w']){this.position[0]+=this._front[0]*this.speed; this.position[1]+=this._front[1]*this.speed; this.position[2]+=this._front[2]*this.speed;}
                                if(keys['s']){this.position[0]-=this._front[0]*this.speed; this.position[1]-=this._front[1]*this.speed; this.position[2]-=this._front[2]*this.speed;}
                                if(keys['a']){this.position[0]-=this._right[0]*this.speed; this.position[1]-=this._right[1]*this.speed; this.position[2]-=this._right[2]*this.speed;}
                                if(keys['d']){this.position[0]+=this._right[0]*this.speed; this.position[1]+=this._right[1]*this.speed; this.position[2]+=this._right[2]*this.speed;}
                                if(keys['q'])this.position[1]+=this.speed;
                                if(keys['e'])this.position[1]-=this.speed;}
                    get viewMatrix(){ const center=[this.position[0]+this._front[0], this.position[1]+this._front[1], this.position[2]+this._front[2]]; return lookAt(this.position,center,this.up);}
                    get projectionMatrix(){ return perspective(Math.PI/4,canvas.width/canvas.height,0.1,100);}
                }

                class Cube { constructor(x,y,z,color){ this.x=x; this.y=y; this.z=z; this.color=color; } }
                class World { constructor(size=5){ this.cubes=[]; for(let x=0;x<size;x++){ for(let z=0;z<size;z++){ const h=Math.max(0,Math.floor(Math.sin(x*1.5)+Math.cos(z*1.2)+Math.random()*2)); for(let y=0;y<=h;y++){ const color=y===0?[0.6,0.3,0]:[0,0.8,0]; this.cubes.push(new Cube(x-2,y,z-2,color)); } } } } }
                class InputController {
                    constructor(camera){ this.camera=camera; this.keys={}; canvas.onclick=()=>{ if(!document.pointerLockElement) canvas.requestPointerLock(); };
                    document.addEventListener('mousemove',e=>{ if(document.pointerLockElement===canvas){ this.camera.rotate(e.movementX,e.movementY); }});
                    document.addEventListener('contextmenu',e=>e.preventDefault()); }
                    update(){ this.camera.move(this.keys); }
                }

                class Renderer {
                    constructor(gl,camera,world){
                        this.gl=gl; this.camera=camera; this.world=world;
                        const vs=`attribute vec3 aPosition; attribute vec3 aColor; uniform mat4 uModel; uniform mat4 uView; uniform mat4 uProj; varying vec3 vColor; void main(){ gl_Position=uProj*uView*uModel*vec4(aPosition,1.0); vColor=aColor; }`;
                        const fs=`precision mediump float; varying vec3 vColor; void main(){ gl_FragColor=vec4(vColor,1.0); }`;
                        const vsObj=gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(vsObj,vs); gl.compileShader(vsObj);
                        const fsObj=gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(fsObj,fs); gl.compileShader(fsObj);
                        this.program=gl.createProgram(); gl.attachShader(this.program,vsObj); gl.attachShader(this.program,fsObj); gl.linkProgram(this.program); gl.useProgram(this.program);
                        this.aPosition=gl.getAttribLocation(this.program,"aPosition"); this.aColor=gl.getAttribLocation(this.program,"aColor");
                        this.uModel=gl.getUniformLocation(this.program,"uModel"); this.uView=gl.getUniformLocation(this.program,"uView"); this.uProj=gl.getUniformLocation(this.program,"uProj");
                        gl.enableVertexAttribArray(this.aPosition); gl.enableVertexAttribArray(this.aColor);
                        this.vertexBuffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-0.5,-0.5,-0.5,0.5,-0.5,-0.5,0.5,0.5,-0.5,-0.5,0.5,-0.5,-0.5,-0.5,0.5,0.5,-0.5,0.5,0.5,0.5,0.5,-0.5,0.5,0.5]),gl.STATIC_DRAW);
                        this.indexBuffer=gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,0,1,5,0,5,4,3,2,6,3,6,7,1,2,6,1,6,5,0,3,7,0,7,4]),gl.STATIC_DRAW);
                        this.colorBuffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer); gl.vertexAttribPointer(this.aPosition,3,gl.FLOAT,false,0,0);
                        this.resizeHandler=()=>{ canvas.width=appWindow.clientWidth; canvas.height=appWindow.clientHeight; gl.viewport(0,0,canvas.width,canvas.height); };
                        window.addEventListener('resize',this.resizeHandler);
                    }
                    draw(){
                        const gl=this.gl;
                        gl.viewport(0,0,canvas.width,canvas.height);
                        gl.clearColor(0.5,0.8,1.0,1.0); gl.enable(gl.DEPTH_TEST); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
                        gl.uniformMatrix4fv(this.uView,false,this.camera.viewMatrix);
                        gl.uniformMatrix4fv(this.uProj,false,this.camera.projectionMatrix);
                        for(const c of this.world.cubes){
                            const model=translation(c.x,c.y,c.z);
                            gl.uniformMatrix4fv(this.uModel,false,model);
                            const colors=new Float32Array([...c.color,...c.color,...c.color,...c.color,...c.color,...c.color,...c.color,...c.color]);
                            gl.bindBuffer(gl.ARRAY_BUFFER,this.colorBuffer);
                            gl.bufferData(gl.ARRAY_BUFFER,colors,gl.DYNAMIC_DRAW);
                            gl.vertexAttribPointer(this.aColor,3,gl.FLOAT,false,0,0);
                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer);
                            gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_SHORT,0);
                        }
                    }
                }

                const camera=new Camera();
                const world=new World(5);
                const input=new InputController(camera);
                const renderer=new Renderer(gl,camera,world);

                gameLoopMine=true;
                window.addEventListener('keydown',e=>{ if(gameLoopMine) input.keys[e.key.toLowerCase()]=true; });
                window.addEventListener('keyup',e=>{ if(gameLoopMine) input.keys[e.key.toLowerCase()]=false; });

                function loop(){ if(!gameLoopMine) return; input.update(); renderer.draw(); requestAnimationFrame(loop); }
                loop();
            };

        }
    })
    .catch(err => console.error(err));
