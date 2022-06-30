const sceneElements = {
    sceneGraph: null,
    camera: null,
    renderer: null,
};


// Menu das instruções
/* document.onload = () => {
    document.getElementById("Tag3DScene").style.display="none"
};

document.getElementById("start").onclick = () => {
    document.getElementById("instructions").style.display = "none";
}; */



/*
* Função para criar o boxes
*/
function buildWall(posX,posY,posZ, comp, altura, largura, texture="", color=""){
    const geometry = new THREE.BoxGeometry( comp, altura, largura );
    if (texture!=""){
        const loader = new THREE.TextureLoader();
        const material = new THREE.MeshPhongMaterial( {map: loader.load(texture)} );
        const cube = new THREE.Mesh( geometry, material );
        cube.castShadow=true;
        cube.receiveShadow=true;
        cube.position.x=posX;
        cube.position.y=posY+altura/2;
        cube.position.z=posZ;
        return cube;
    }
    else{
        const material = new THREE.MeshPhongMaterial( {color: color} );
        const cube = new THREE.Mesh( geometry, material );
        cube.castShadow=true;
        cube.receiveShadow=true;
        cube.position.x=posX;
        cube.position.y=posY+altura/2;
        cube.position.z=posZ;
        return cube;
    }
    
}


/*
* Função para criar o plano
*/
function createPlane(comp=1, larg=1, color="", texture=""){
    const planeGeometry = new THREE.PlaneBufferGeometry(comp, larg, 8, 8);
    if (texture==""){
        const planeMaterial = new THREE.MeshPhongMaterial(
            { color: color, 
              side: THREE.DoubleSide 
            }
        );
        const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
        planeObject.receiveShadow = true;
        return planeObject;
    }
    else{
        const loader = new THREE.TextureLoader();
        const planeMaterial = new THREE.MeshPhongMaterial( 
            {
                map: loader.load(texture),
                side: THREE.DoubleSide
            } 
        );
        const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
        planeObject.receiveShadow = true;
        return planeObject;
    }
}

/*
* Função para criar esferas
*/

function createSphere(raio=1, widthSegments=1, heightSegments=1, color="", texture="", name=""){
    const geometry = new THREE.SphereGeometry( raio, widthSegments, heightSegments );
    if (texture!=""){
        const loader = new THREE.TextureLoader();
        const material = new THREE.MeshBasicMaterial( { 
            map: loader.load(texture),
        } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.name=name;
        return sphere;
    }
    const material = new THREE.MeshBasicMaterial( { 
        color: color,
    } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.name=name;
    return sphere;
}

function createBox(width, height , depth, color, texture){
    if (texture!=""){
        const loader = new THREE.TextureLoader();
        const material = new THREE.MeshPhongMaterial( {map: loader.load(texture)} );
        const cube = new THREE.Mesh( new THREE.BoxGeometry( width, height, depth ), material );
        cube.castShadow=true;
        cube.receiveShadow=true;
        return cube;
    }
    const geometry = new THREE.BoxGeometry( width, height, depth );
    const material = new THREE.MeshPhongMaterial( {color: color} );
    const cube = new THREE.Mesh( geometry, material );
    return cube;
}

function createIlumination(posX, posY, posZ, scene, nameC, nameS){
    const cube = buildWall(posX=posX,posY=posY,posZ=posZ-5, comp=0.5, altura=0.5,largura=10,texture="",color="#aaa9ad")
    cube.rotation.x=Math.PI/2;

    const sphere = createSphere(raio=1.25,widthSegments=32,heightSegments=16, color="0x8e8e8e",texture="")

    sphere.position.x=posX;
    sphere.position.y=posY+10/2;
    sphere.position.z=posZ;
    sphere.name=nameC;
    
    cube.castShadow = true;
    cube.receiveShadow = true;
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    const spotLight = new THREE.SpotLight( 0xfcd669 );
    spotLight.position.set( posX, posY+10/2, posZ );
    
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    spotLight.intensity=0;
    spotLight.castShadow = true;
    spotLight.name=nameS;
    scene.add(spotLight)

    const group = new THREE.Group();
    group.add(sphere);
    group.add(cube);
    scene.add(group)
}

function createRoad(posX, posY, posZ, scene){
    const road = createPlane(comp=10,larg=200,color=0x000000)

    road.rotation.x=Math.PI/2;
    road.position.x=posX;
    road.position.y=posY+0.01;
    road.position.z=posZ;
    road.receiveShadow = true;

    for (var i=-95; i < 100; i+=10){
        const roadCenter = createPlane(comp=1,larg=5,color=0xffffff)
        roadCenter.rotation.x=Math.PI/2;
        roadCenter.position.x=posX;
        roadCenter.position.y=posY+0.02;
        roadCenter.position.z=i;
        roadCenter.receiveShadow = true;
        scene.add(roadCenter)
    }
    scene.add(road)
}


function createSun(posX, posY, posZ){
    const sun = createSphere(raio=5,widthSegments=64,heightSegments=32, color="",texture="assets/sun.jpg")
    sun.position.x=posX;
    sun.position.y=posY;
    sun.position.z=posZ;
    sun.name="sun";
    return sun;
}


function createMoon(posX, posY, posZ){
    const moon = createSphere(raio=2.5,widthSegments=64,heightSegments=32, color="",texture="assets/moon.jpg")
    moon.position.x=posX;
    moon.position.y=posY;
    moon.position.z=posZ;
    moon.name = "moon";
    return moon;
}

function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();
    sceneElements.renderer.setSize(width, height);
}

function loadplane(comp, larg, color) {
    const mainPlane = createPlane(comp=comp, larg=larg, color=color, texture="")    
    mainPlane.rotateX( - Math.PI / 2);
    return mainPlane
}

function renderTorus(raio, espessura, radialSegments=30, tubularSegments=200,color){
    const geometry = new THREE.TorusGeometry( raio, espessura, radialSegments, tubularSegments );
    const material = new THREE.MeshPhongMaterial( { color: color } );
    const torus = new THREE.Mesh( geometry, material );
    return torus;
}


                    // 1                7                     3         8         
function createTree(cylinderRadius, cylinderHeight, baseConeRadius, coneHeight, posX, posY, posZ) {
    var treeType = Math.floor(Math.random() * 5);
    
    switch(treeType) {
        case 0:
            cylinderRadius=0.5;
            cylinderHeight=1.5;
            baseConeRadius=1.25;
            coneHeight=2;
            break;
        case 1:
            cylinderRadius=0.7;
            cylinderHeight=2;
            baseConeRadius=2;
            coneHeight=5
            break;
        case 2:
            cylinderRadius=2;
            cylinderHeight=6;
            baseConeRadius=5;
            coneHeight=14;
            break;
        case 3:
            cylinderRadius=1;
            cylinderHeight=3;
            baseConeRadius=2.5;
            coneHeight=7
            break;
        case 4:
            cylinderRadius=0.4;
            cylinderHeight=2.3;
            baseConeRadius=1.5;
            coneHeight=8
            break;
    }

    const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32);

    const redMaterial = new THREE.MeshPhongMaterial({ 
        color: "#804000",
    });
    const cylinder = new THREE.Mesh(cylinderGeometry, redMaterial);
    // Move base of the cylinder to y = 0
    cylinder.position.y = cylinderHeight / 2.0;
    
    // Cone
    const coneGeometry = new THREE.ConeGeometry(baseConeRadius, coneHeight, 32);
    const greenMaterial = new THREE.MeshPhongMaterial({ 
        color:"#00ff00",

    });
    const cone = new THREE.Mesh(coneGeometry, greenMaterial);

    cone.castShadow = true;
    cone.receiveShadow = true;
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;


    // Move base of the cone to the top of the cylinder
    cone.position.y = cylinderHeight + coneHeight / 2.0;
    
    // Tree
    var tree = new THREE.Group();
    tree.add(cylinder);
    tree.add(cone);
    
    tree.position.x=posX;
    tree.position.y=posY;
    tree.position.z=posZ+8;

    return tree;
}

function house(posX, posY, posZ){
    const house = new THREE.Group();
    
    // Fazer as paredes
    const loader = new THREE.TextureLoader();

    // BoxGeometry(largura : Float, comprimento : Float, profundidade (y) : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)
    let houseWidth=6;
    let houseHeigh=6;
    let houseDepth=4;


    const cube = buildWall(posX=posX,posY=posY,posZ=posZ, comp=houseWidth, altura=houseDepth,largura=houseHeigh,texture="assets/house.jpg",color="")
    house.add(cube)
    //house.add(houseLine)

    cube.position.x=posX;
    cube.position.y=posY;
    cube.position.z=posZ;
    cube.castShadow = true;
    cube.receiveShadow = true;


    // Teto

    const roofGeometry = new THREE.ConeGeometry( 5, 4, 4 );
    const roofMaterial = new THREE.MeshPhongMaterial( {
        map: loader.load('assets/roof.jpg')
    } );
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);

    

    roof.position.x=posX;
    roof.position.y=posY+houseDepth;
    roof.position.z=posZ;
    roof.rotation.y=-Math.PI/4;

    roof.castShadow = true;
    roof.receiveShadow = true;
    
    house.add(roof)

    // Porta
    let doorWidth = 2;
    let doorHeigh = 1;

    const door = createPlane(comp=doorHeigh,larg=doorWidth, color="", texture="assets/door.jpg");
    
    door.position.x=posX+houseHeigh/2+0.01;
    door.position.y=posY-doorWidth/2;
    door.position.z=posZ;
    door.rotation.y=Math.PI/2;
    
    house.add(door);

    // Janela esquerda

    let windowHeigh = 1;
    let windowWidth = 1;
    
    const window = createPlane(comp=windowHeigh,larg=windowWidth, color="", texture="assets/window.jpeg");
    
    window.position.x=posX+houseHeigh/2+0.01;
    window.position.y=posY+windowHeigh;
    window.position.z=posZ+houseHeigh/4;
    window.rotation.y=Math.PI/2;
    
    house.add(window)


    // Janela direita

    const window2 = createPlane(comp=windowHeigh,larg=windowWidth, color="", texture="assets/window.jpeg");
    
    window2.position.x=posX+houseHeigh/2+0.01;
    window2.position.y=posY+windowHeigh;
    window2.position.z=posZ-houseHeigh/4;
    window2.rotation.y=Math.PI/2;
    
    house.add(window2);

    


    // Fazer a garagem
    let garagemWidth=6;
    let garagemHeigh=4;
    let garagemDepth=10;

    const garagemCube = buildWall(posX=posX,posY=posY,posZ=posZ+garagemHeigh, comp=garagemWidth, altura=garagemHeigh,largura=garagemDepth,texture="assets/house.jpg",color="")
    
    garagemCube.position.x=posX;
    garagemCube.position.y=posY;
    garagemCube.position.z=posZ+garagemHeigh;

    
    house.add(garagemCube)

    // Portão da Garagem
    let portaoHeigh = 5;
    let portaoWidth = 3;

    const portao = createPlane(comp=portaoHeigh, largura=portaoWidth, color="", texture="assets/gate.jpg")
    
    portao.position.x=posX+houseHeigh/2+0.01;
    portao.position.y=posY-0.5;
    portao.position.z=posZ+portaoWidth+3;
    portao.rotation.y=Math.PI/2;
    
    house.add(portao)


    // Piscina 
    const swim = createPlane(comp=30,larg=10,color="", texture='assets/pool.jpeg')
    swim.position.x = posX -20
    swim.rotation.x=Math.PI/2;
    swim.position.z=posZ+3;
    swim.position.y=0.01;
    house.add(swim)
    return house;
}


function createCar() {
    const car = new THREE.Group();
    
    const backWheel = createWheels();
    backWheel.position.y = 0.5;
    backWheel.position.x = -1.5;
    car.add(backWheel);
    
    const frontWheel = createWheels();
    frontWheel.position.y = 0.5;  
    frontWheel.position.x = 1.5;
    car.add(frontWheel);
  
    const main = new THREE.Mesh(
      new THREE.BoxBufferGeometry(5, 1.25, 2.5),
      new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );
    main.position.y = 1;
    car.add(main);
  
    const cabin = new THREE.Mesh(
      new THREE.BoxBufferGeometry(2.75, 1, 2),
      new THREE.MeshPhongMaterial({ color: 0xffffff })
    );
    cabin.position.x = -0.5;
    cabin.position.y = 2.125;
    car.add(cabin);
    main.castShadow = true;
    main.receiveShadow = true;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    return car;
}

function createWheels() {
    const geometry = new THREE.BoxBufferGeometry(1, 1, 2.75);
    const material = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(geometry, material);
    wheel.castShadow = true;
    wheel.receiveShadow = true;

    return wheel;
}


function onDocumentKeyDown(event){
    switch (event.keyCode) {
        case 83: //s
            keyS = true;
            break;
        case 87: //w
            keyW = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 68: //d
            keyD = true;
            break;
        case 76:
            if (keyL == false){
                keyL = true;
            }
            else{
                keyL = false;
            }
            break;
    }
}

function onDocumentKeyUp(event){
    switch (event.keyCode) {
        case 83: //s
            keyS = false;
            break;
        case 87: //w
            keyW = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 68: //d
            keyD = false;
            break;
    }
}

function createCylinder(radiusTop, radiusBottom, height, color){
    const geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, 32 );
    const material = new THREE.MeshPhongMaterial( {color: color} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.castShadow=true;
    return cylinder;
}

var lightIntensity=1;

function computeFrame(time) {
    const lightSun = sceneElements.sceneGraph.getObjectByName("pivotLight");
    const moon = sceneElements.sceneGraph.getObjectByName("moonPivot");
    const sun = sceneElements.sceneGraph.getObjectByName("sun");
    const light = sceneElements.sceneGraph.getObjectByName("light");
    const pavilhaoLight = sceneElements.sceneGraph.getObjectByName("pavilhaoLight");
    const portao = sceneElements.sceneGraph.getObjectByName("portao");
    
    lightSun.rotation.z-=options.velx;

    moon.rotation.z+= options.vely;
    const worldPosition = new THREE.Vector3();
    const pos = sun.getWorldPosition( worldPosition );
    
    const car1 = sceneElements.sceneGraph.getObjectByName("car1");
    const car2 = sceneElements.sceneGraph.getObjectByName("car2");

    if (keyW && car1.position.z > -95) {
        car1.translateX(options.dispZ);
    }
    if (keyS && car1.position.z < 95) {
        car1.translateX(-options.dispZ);
    }

    if (keyW && car2.position.z < 95) {
        car2.translateX(options.dispZ);
    }
    if (keyS && car2.position.z > -95) {
        car2.translateX(-options.dispZ);
    }
    // queremos acender a luz
    if (keyL){
        pavilhaoLight.intensity=0.5;
        for (let i= 0; i<objects.length; i++){
            objects[i].material.color.setHex(0xfcd669);
            luz[i].intensity=options.lightIntensity;    
        }
        for (let i=0; i<pointLightNames.length; i++){
            let tmp = sceneElements.sceneGraph.getObjectByName(pointLightNames[i]);
            tmp.intensity=options.spotlightIntensity;
        }
    }
    // queremos a luz apagada
    else{
        pavilhaoLight.intensity=0;
        for (let i= 0; i<objects.length; i++){
            objects[i].material.color.setHex(0xD3D3D3);
            luz[i].intensity=0;
        }
        for (let i=0; i<pointLightNames.length; i++){
            let tmp = sceneElements.sceneGraph.getObjectByName(pointLightNames[i]);
            tmp.intensity=0;
        }
    }
    
    
    if (pos.y<0 && pos.y>-20){
        sceneElements.renderer.setClearColor('rgb(21, 40, 82)', 1)
        light.intensity=0;
        if (portao.position.z>-80){
            portao.translateX(options.dispZ);
        }
    }
    else if (pos.y<-20){
        console.log("AQUI")
        sceneElements.renderer.setClearColor('rgb(8, 24, 58)', 1)
        keyL = true;
        if (portao.position.z>-80){
            portao.translateX(options.dispZ);
        }

    }
    else if (pos.y>0 && pos.y<20){
        sceneElements.renderer.setClearColor('rgb(253, 94, 83)', 1)
        light.intensity=options.lightIntensity*0.25;
        keyL = false;
    }
    else if(pos.y>=20 && pos.y<40){
        sceneElements.renderer.setClearColor('rgb(252, 156, 84)', 1)
        light.intensity=options.lightIntensity*0.50;
        if (portao.position.z<-65){
            portao.translateX(-options.dispZ);
        }
    }
    else if(pos.y>=40 && pos.y<60){
        sceneElements.renderer.setClearColor('rgb(255, 227, 115)', 1)
        light.intensity=options.lightIntensity*0.75;
        if (portao.position.z<-65){
            portao.translateX(-options.dispZ);
        }

    }
    else{
        sceneElements.renderer.setClearColor('rgb(137, 177, 204)', 1)
        light.intensity=options.lightIntensity;
        if (portao.position.z<-65){
            portao.translateX(-options.dispZ);
        }
    }
    
    helper.render(sceneElements);
    requestAnimationFrame(computeFrame);
}

function createCircle(raio, altura, segmentos,color){
    const geometry = new THREE.ConeGeometry( raio, altura, segmentos );
    const material = new THREE.MeshPhongMaterial( {color: color} );
    const cone = new THREE.Mesh( geometry, material );
    return cone;
}


helper.initEmptyScene(sceneElements);


/* INICIALIZAR AS VARIÁVEIS */
var keyS = false, keyW = false, keyA=false, keyD=false, keyL = false;
var spotLights = [], objects= [], luz= [];
var delta, dispZ = 0.7;

const mainPlane = loadplane(200,200,'rgb(86,125,70)');
sceneElements.sceneGraph.add(mainPlane);

createRoad(27,0,0, sceneElements.sceneGraph);

const sun = createSun(-100,50,-50);
sceneElements.sceneGraph.add(sun);

const moon = createMoon(100,30,50);
sceneElements.sceneGraph.add(moon);

const wall = buildWall(posX=-22,posY=0,posZ=95, comp=50, altura=3,largura=1,texture="",color=0xc4b39c);
sceneElements.sceneGraph.add(wall);

const lastWall = buildWall(-47, 0, 5, 181,3,1,texture="", color=0xc4b39c);
lastWall.rotation.y=Math.PI/2; 
sceneElements.sceneGraph.add(lastWall);


const car1 = createCar();
car1.position.x=30;
car1.position.z=0;
car1.rotation.y=Math.PI/2;
car1.name='car1';
sceneElements.sceneGraph.add(car1);

const car2 = createCar();
car2.position.x=25;
car2.position.z=0;
car2.rotation.y=-Math.PI/2;
car2.name='car2';
sceneElements.sceneGraph.add(car2);



for (let i = -80; i<100; i+=20){
    sceneElements.sceneGraph.add(house(0,2,i))
    sceneElements.sceneGraph.add(createTree(1,7,3,8, -40, 0, i-5))
    sceneElements.sceneGraph.add(createTree(1,7,3,8, 20, 0, i-2.5))
    sceneElements.sceneGraph.add(buildWall(posX=-22,posY=0,posZ=i-5, comp=50,altura=3,largura=1,texture="" ,color=0xc4b39c))
    createIlumination(10, 5, i, sceneElements.sceneGraph, 'candeeiro'+i, 'spotLight'+i);
}



requestAnimationFrame(computeFrame);



// HANDLING EVENTS
// Event Listeners
window.addEventListener('resize', resizeWindow);
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

function createPoinLight(pox,posy,posz, name){
    const light = new THREE.PointLight( 0xffffff, 0, 100 );
    light.position.set( pox, posy,  posz);
    light.name=name;
    return light;
}


// PIVOTS
const pivot = new THREE.Object3D();
pivot.add(sceneElements.sceneGraph.getObjectByName("light"));
pivot.add(sceneElements.sceneGraph.getObjectByName("sun"));
sceneElements.sceneGraph.add(pivot)
pivot.name="pivotLight"

const moonPivot = new THREE.Object3D();
moonPivot.add(sceneElements.sceneGraph.getObjectByName("moon"));
sceneElements.sceneGraph.add(moonPivot)
moonPivot.name="moonPivot"


/* GUARDAR O NOME DOS CANDEEIROS E DAS LUZES */
for (let i=-80; i<100; i+=20){
    const tmp = sceneElements.sceneGraph.getObjectByName('candeeiro'+i);
    objects.push(tmp);
}

for (let i=-80; i<100; i+=20){
    const tmp = sceneElements.sceneGraph.getObjectByName('spotLight'+i);
    luz.push(tmp);
}

var gui = new dat.GUI();
var options = {
    velx: 0.005,
    vely: 0.005,
    dispZ: 0.7,
    lightIntensity: 0.5,
    spotlightIntensity: 0.15,
};
var velocity = gui.addFolder('Velocity');
velocity.add(options, 'velx', 0.0005, 0.02).name('Sun').listen();
velocity.add(options, 'vely', 0.0005, 0.02).name('Moon').listen();
velocity.add(options, 'dispZ', 0.2, 1.5).name('Displacement').listen();
velocity.open();

var growth = gui.addFolder('Light');
growth.add(options, 'lightIntensity', 0, 3.2).name('Sun Intensity').listen();
growth.add(options, 'spotlightIntensity', 0, 1).name('Lamp Intensity').listen();
growth.open();



const futsalPlane = createPlane(comp=52,larg=35, color="#D4406C", texture="");
futsalPlane.rotation.x=Math.PI/2;
futsalPlane.position.x=65;
futsalPlane.position.y=0.01;
futsalPlane.position.z=80;

sceneElements.sceneGraph.add(futsalPlane);

// TODO: apagar
const axesHelper = new THREE.AxesHelper( 20 );
axesHelper.position.x=10;
sceneElements.sceneGraph.add( axesHelper );

const post1 = createCylinder(0.5,0.5,5,0x559656);
post1.position.x=10;
post1.position.y=2.5;
const post2 = createCylinder(0.5,0.5,5,0x559656);
post2.position.x=10+10;
post2.position.y=2.5;
const trave = createCylinder(0.5,0.5,10.75,0x559656);
trave.position.y=5;
trave.position.x=15;

trave.rotation.z=Math.PI/2;

sceneElements.sceneGraph.add( post1 );
sceneElements.sceneGraph.add( post2 );
sceneElements.sceneGraph.add( trave );

const group = new THREE.Group();
group.add(post1);
group.add(post2);
group.add(trave);
sceneElements.sceneGraph.add(group)

group.position.x=40;
group.position.z=95;
group.rotation.y=Math.PI/2;

const post12 = createCylinder(0.5,0.5,5,0x559656);
post12.position.x=10;
post12.position.y=2.5;
const post22 = createCylinder(0.5,0.5,5,0x559656);
post22.position.x=10+10;
post22.position.y=2.5;
const trave2 = createCylinder(0.5,0.5,10.75,0x559656);
trave2.position.y=5;
trave2.position.x=15;

trave2.rotation.z=Math.PI/2;


const group1 = new THREE.Group();
group1.add(post12);
group1.add(post22);
group1.add(trave2);

group1.position.x=90;
group1.position.z=95;
group1.rotation.y=Math.PI/2;

sceneElements.sceneGraph.add(group1)




const linha1 = createPlane(comp=50,larg=0.5, color="#ffffff", texture="");
linha1.rotation.x=Math.PI/2;
linha1.position.y=0.02;

linha1.position.x=65;
linha1.position.z=97;

sceneElements.sceneGraph.add(linha1);

const linha2 = createPlane(comp=50,larg=0.5, color="#ffffff", texture="");
linha2.rotation.x=Math.PI/2;
linha2.position.y=0.02;

linha2.position.x=65;
linha2.position.z=63;

sceneElements.sceneGraph.add(linha2);



const linha3 = createPlane(comp=33,larg=0.5, color="#ffffff", texture="");
linha3.rotation.x=Math.PI/2;
linha3.rotation.z=Math.PI/2;

linha3.position.x=40;
linha3.position.y=0.02;
linha3.position.z=80;

sceneElements.sceneGraph.add(linha3);

const linha4 = createPlane(comp=33,larg=0.5, color="#ffffff", texture="");
linha4.rotation.x=Math.PI/2;
linha4.rotation.z=Math.PI/2;

linha4.position.x=90;
linha4.position.y=0.02;
linha4.position.z=80;

sceneElements.sceneGraph.add(linha4);

const linha5 = createPlane(comp=33,larg=0.5, color="#ffffff", texture="");
linha5.rotation.x=Math.PI/2;
linha5.rotation.z=Math.PI/2;

linha5.position.x=65;
linha5.position.y=0.02;
linha5.position.z=80;

sceneElements.sceneGraph.add(linha5);



const circle = createCircle(5,0.1, 60, 0xffffff);
circle.position.x=65;
circle.position.y=0.2;
circle.position.z=80;
circle.rotation.z=Math.PI;
sceneElements.sceneGraph.add(circle);




const tennisPlane = createPlane(comp=52,larg=35, color="#DFFF4F", texture="");
tennisPlane.rotation.x=Math.PI/2;
tennisPlane.position.x=65;
tennisPlane.position.y=0.01;
tennisPlane.position.z=30;

sceneElements.sceneGraph.add(tennisPlane);


const linha6 = createPlane(comp=35,larg=0.5, color="#ffffff", texture="");
linha6.rotation.x=Math.PI/2;
linha6.rotation.z=Math.PI/2;

linha6.position.x=65;
linha6.position.y=0.02;
linha6.position.z=30;

sceneElements.sceneGraph.add(linha6);


const rede = createPlane(comp=35,larg=2, color="#e8e4c9", texture="");

rede.rotation.x=Math.PI/2;
rede.rotation.z=Math.PI/2;
rede.rotation.y=Math.PI/2;


rede.position.x=65;
rede.position.y=1;
rede.position.z=30;

sceneElements.sceneGraph.add(rede);

const linha7 = createPlane(comp=52,larg=0.5, color="#ffffff", texture="");
linha7.rotation.x=Math.PI/2;

linha7.position.x=65;
linha7.position.y=0.02;
linha7.position.z=42.5;

sceneElements.sceneGraph.add(linha7);

const linha8 = createPlane(comp=52,larg=0.5, color="#ffffff", texture="");
linha8.rotation.x=Math.PI/2;

linha8.position.x=65;
linha8.position.y=0.02;
linha8.position.z=47.5;

sceneElements.sceneGraph.add(linha8);



const linha9 = createPlane(comp=52,larg=0.5, color="#ffffff", texture="");
linha9.rotation.x=Math.PI/2;

linha9.position.x=65;
linha9.position.y=0.02;
linha9.position.z=12.5;

sceneElements.sceneGraph.add(linha9);

const linha10 = createPlane(comp=52,larg=0.5, color="#ffffff", texture="");
linha10.rotation.x=Math.PI/2;

linha10.position.x=65;
linha10.position.y=0.02;
linha10.position.z=17.5;

sceneElements.sceneGraph.add(linha10);

const linha11 = createPlane(comp=35.5,larg=0.5, color="#ffffff", texture="");
linha11.rotation.x=Math.PI/2;
linha11.rotation.z=Math.PI/2;


linha11.position.x=91;
linha11.position.y=0.02;
linha11.position.z=30;

sceneElements.sceneGraph.add(linha11);


const linha12 = createPlane(comp=35.5,larg=0.5, color="#ffffff", texture="");
linha12.rotation.x=Math.PI/2;
linha12.rotation.z=Math.PI/2;


linha12.position.x=39;
linha12.position.y=0.02;
linha12.position.z=30;

sceneElements.sceneGraph.add(linha12);

const linha13 = createPlane(comp=25,larg=0.5, color="#ffffff", texture="");
linha13.rotation.x=Math.PI/2;
linha13.rotation.z=Math.PI/2;


linha13.position.x=78;
linha13.position.y=0.02;
linha13.position.z=30;

sceneElements.sceneGraph.add(linha13);


const linha14 = createPlane(comp=25,larg=0.5, color="#ffffff", texture="");
linha14.rotation.x=Math.PI/2;
linha14.rotation.z=Math.PI/2;


linha14.position.x=78-26;
linha14.position.y=0.02;
linha14.position.z=30;

sceneElements.sceneGraph.add(linha14);


const linha15 = createPlane(comp=26,larg=0.5, color="#ffffff", texture="");
linha15.rotation.x=Math.PI/2;

linha15.position.x=65;
linha15.position.y=0.02;
linha15.position.z=30;

sceneElements.sceneGraph.add(linha15);



const basketPlane = createPlane(comp=52,larg=35, color="", texture="assets/campBask.jpg");
basketPlane.rotation.x=Math.PI/2;
basketPlane.position.x=65;
basketPlane.position.y=0.01;
basketPlane.position.z=-20;

sceneElements.sceneGraph.add(basketPlane);


const lp = createCylinder(0.5,0.5,10,0xffffff);
lp.position.x=45.5;
lp.position.y=5;
lp.position.z=-20;

sceneElements.sceneGraph.add(lp);

const lp2 = createCylinder(0.5,0.5,3,0xffffff);
lp2.position.x=47;
lp2.position.y=10;
lp2.position.z=-20;

lp2.rotation.z=Math.PI/2;

sceneElements.sceneGraph.add(lp2);



const rp = createCylinder(0.5,0.5,10,0xffffff);
rp.position.x=84.5;
rp.position.y=5;
rp.position.z=-20;

sceneElements.sceneGraph.add(rp);

const rp2 = createCylinder(0.5,0.5,3,0xffffff);
rp2.position.x=83;
rp2.position.y=10;
rp2.position.z=-20;

rp2.rotation.z=-Math.PI/2;

sceneElements.sceneGraph.add(rp2);


const table1 = createBox(7,5,0.5,color="#ffffff", texture="");
table1.position.x=48.5;
table1.position.y=10;
table1.position.z=-20;
table1.rotation.y=Math.PI/2;
sceneElements.sceneGraph.add(table1);


const table2 = createBox(7,5,0.5,"#ffffff", texture="");
table2.position.x=48.5+33;
table2.position.y=10;
table2.position.z=-20;
table2.rotation.y=Math.PI/2;
sceneElements.sceneGraph.add(table2);


const linha16= createPlane(comp=7,larg=0.3, color="#000000", texture="");
linha16.position.x=48.76;
linha16.position.y=10-2.5+0.15;
linha16.position.z=-20;
linha16.rotation.y=Math.PI/2;
sceneElements.sceneGraph.add(linha16);



const linha17= createPlane(comp=7,larg=0.3, color="#000000", texture="");
linha17.position.x=48.76;
linha17.position.y=10+2.5-0.15;
linha17.position.z=-20;
linha17.rotation.y=Math.PI/2;
sceneElements.sceneGraph.add(linha17);


const linha18= createPlane(comp=5,larg=0.3, color="#000000", texture="");
linha18.position.x=48.76;
linha18.position.y=10;
linha18.position.z=-20+3.5-0.15;
linha18.rotation.y=Math.PI/2;
linha18.rotation.x=Math.PI/2;

sceneElements.sceneGraph.add(linha18);

const linha19= createPlane(comp=5,larg=0.3, color="#000000", texture="");
linha19.position.x=48.76;
linha19.position.y=10;
linha19.position.z=-20-3.5+0.15;
linha19.rotation.y=Math.PI/2;
linha19.rotation.x=Math.PI/2;

sceneElements.sceneGraph.add(linha19);

//                  5/3 7/3

const linha20= createPlane(comp=5/3,larg=0.3, color="#000000", texture="");
linha20.position.x=48.76;
linha20.position.y=9.4;
linha20.position.z=-20+7/6;
linha20.rotation.y=Math.PI/2;
linha20.rotation.x=Math.PI/2;

sceneElements.sceneGraph.add(linha20);

const linha22= createPlane(comp=5/3,larg=0.3, color="#000000", texture="");
linha22.position.x=48.76;
linha22.position.y=9.4;
linha22.position.z=-20-7/6;
linha22.rotation.y=Math.PI/2;
linha22.rotation.x=Math.PI/2;

sceneElements.sceneGraph.add(linha22);


const linha21= createPlane(comp=2.65,larg=0.3, color="#000000", texture="");
linha21.position.x=48.76;
linha21.position.y=9.4-5/6;
linha21.position.z=-20;
linha21.rotation.y=Math.PI/2;

sceneElements.sceneGraph.add(linha21);


const linha23= createPlane(comp=2.65,larg=0.3, color="#000000", texture="");
linha23.position.x=48.76;
linha23.position.y=9.4+5/6;
linha23.position.z=-20;
linha23.rotation.y=Math.PI/2;

sceneElements.sceneGraph.add(linha23);




// Outra tabela 


const linha24= createPlane(comp=7,larg=0.3, color="#000000", texture="");
linha24.position.x=48.76+32.4;
linha24.position.y=10-2.5+0.15;
linha24.position.z=-20;
linha24.rotation.y=Math.PI/2;
sceneElements.sceneGraph.add(linha24);



const linha25= createPlane(comp=7,larg=0.3, color="#000000", texture="");
linha25.position.x=48.76+32.4;
linha25.position.y=10+2.5-0.15;
linha25.position.z=-20;
linha25.rotation.y=Math.PI/2;
sceneElements.sceneGraph.add(linha25);


const linha26= createPlane(comp=5,larg=0.3, color="#000000", texture="");
linha26.position.x=48.76+32.4;
linha26.position.y=10;
linha26.position.z=-20+3.5-0.15;
linha26.rotation.y=Math.PI/2;
linha26.rotation.x=Math.PI/2;

sceneElements.sceneGraph.add(linha26);

const linha27= createPlane(comp=5,larg=0.3, color="#000000", texture="");
linha27.position.x=48.76+32.4;
linha27.position.y=10;
linha27.position.z=-20-3.5+0.15;
linha27.rotation.y=Math.PI/2;
linha27.rotation.x=Math.PI/2;

sceneElements.sceneGraph.add(linha27);


const linha28= createPlane(comp=5/3,larg=0.3, color="#000000", texture="");
linha28.position.x=48.76+32.4;
linha28.position.y=9.4;
linha28.position.z=-20+7/6;
linha28.rotation.y=Math.PI/2;
linha28.rotation.x=Math.PI/2;

sceneElements.sceneGraph.add(linha28);

const linha29= createPlane(comp=5/3,larg=0.3, color="#000000", texture="");
linha29.position.x=48.76+32.4;
linha29.position.y=9.4;
linha29.position.z=-20-7/6;
linha29.rotation.y=Math.PI/2;
linha29.rotation.x=Math.PI/2;

sceneElements.sceneGraph.add(linha29);


const linha30= createPlane(comp=2.65,larg=0.3, color="#000000", texture="");
linha30.position.x=48.76+32.4;
linha30.position.y=9.4-5/6;
linha30.position.z=-20;
linha30.rotation.y=Math.PI/2;

sceneElements.sceneGraph.add(linha30);


const linha31= createPlane(comp=2.65,larg=0.3, color="#000000", texture="");
linha31.position.x=48.76+32.4;
linha31.position.y=9.4+5/6;
linha31.position.z=-20;
linha31.rotation.y=Math.PI/2;

sceneElements.sceneGraph.add(linha31);


const cesto1= renderTorus(1,0.2, radialSegments=30, tubularSegments=200, color="#D05C00");
cesto1.rotation.x=Math.PI  / 2;
cesto1.position.y=8.5;
cesto1.position.x=50;
cesto1.position.z=-20;



sceneElements.sceneGraph.add(cesto1);

const cesto2= renderTorus(1,0.2, radialSegments=30, tubularSegments=200, color="#D05C00");
cesto2.rotation.x=Math.PI  / 2;
cesto2.position.y=8.5;
cesto2.position.x=50+30;
cesto2.position.z=-20;

sceneElements.sceneGraph.add(cesto2);


const separateWall = buildWall(71,0,55,58,10,1,texture="", color="#014325")
sceneElements.sceneGraph.add(separateWall);

const separateWall1 = buildWall(71,0,5,58,10,1,texture="", color="#014325")
sceneElements.sceneGraph.add(separateWall1);

const separateWall2 = buildWall(37,0,15,170,10,1,texture="", color="#014325")
separateWall2.rotation.y=Math.PI/2;
sceneElements.sceneGraph.add(separateWall2);


const separateWall3 = buildWall(37,0,-95,10,10,1,texture="", color="#014325")
separateWall3.rotation.y=Math.PI/2;
sceneElements.sceneGraph.add(separateWall3);


// Postes de luz dos campos

const lamp = createCylinder(0.5,0.5,30, color="#FFF", texture="");
lamp.position.x=40;
lamp.position.y=15;
lamp.position.z=-40;


sceneElements.sceneGraph.add(lamp);

const lampHelper = createCylinder(0.5,0.5,5, color="#FFF", texture="");
lampHelper.position.x=40+2;
lampHelper.position.y=30;
lampHelper.position.z=-40+2;
lampHelper.rotation.x=Math.PI/2;
lampHelper.rotation.z=-Math.PI/4;



sceneElements.sceneGraph.add(lampHelper);

const bigLamp = buildWall(44,30-2,-36,4,4,0.5,texture="", color="#949494");
bigLamp.rotation.y=Math.PI/4;
bigLamp.rotation.x=Math.PI/4;

sceneElements.sceneGraph.add(bigLamp);



const lamp1 = createCylinder(0.5,0.5,30, color="#FFF", texture="");
lamp1.position.x=40;
lamp1.position.y=15;
lamp1.position.z=10;


sceneElements.sceneGraph.add(lamp1);

const lamp1Helper = createCylinder(0.5,0.5,5, color="#FFF", texture="");
lamp1Helper.position.x=40+2;
lamp1Helper.position.y=30;
lamp1Helper.position.z=10+2;
lamp1Helper.rotation.x=Math.PI/2;
lamp1Helper.rotation.z=-Math.PI/4;



sceneElements.sceneGraph.add(lamp1Helper);

const bigLamp1 = buildWall(44,30-2,14,4,4,0.5,texture="", color="#949494");
bigLamp1.rotation.y=Math.PI/4;
bigLamp1.rotation.x=Math.PI/4;

sceneElements.sceneGraph.add(bigLamp1);


const lamp2 = createCylinder(0.5,0.5,30, color="#FFF", texture="");
lamp2.position.y=15;
lamp2.position.x=40;
lamp2.position.z=60;


sceneElements.sceneGraph.add(lamp2);

const lamp2Helper = createCylinder(0.5,0.5,5, color="#FFF", texture="");
lamp2Helper.position.x=40+2;
lamp2Helper.position.y=30;
lamp2Helper.position.z=60+2;
lamp2Helper.rotation.x=Math.PI/2;
lamp2Helper.rotation.z=-Math.PI/4;



sceneElements.sceneGraph.add(lamp2Helper);

const bigLamp2 = buildWall(44,30-2,64,4,4,0.5,texture="", color="#949494");
bigLamp2.rotation.y=Math.PI/4;
bigLamp2.rotation.x=Math.PI/4;

sceneElements.sceneGraph.add(bigLamp2);

var pointLightNames = [];
for (var i=-36; i<=64; i+=50){
    const pontoDeLuz = createPoinLight(44,28,i, "pontoLuz"+i);
    sceneElements.sceneGraph.add(pontoDeLuz);
    pointLightNames.push("pontoLuz"+i)
}


const lamp3 = createCylinder(0.5,0.5,30, color="#FFF", texture="");
lamp3.position.x=90;
lamp3.position.y=15;
lamp3.position.z=-1;


sceneElements.sceneGraph.add(lamp3);

const lamp3Helper = createCylinder(0.5,0.5,5, color="#FFF", texture="");
lamp3Helper.position.x=90-2;
lamp3Helper.position.y=30;
lamp3Helper.position.z=-1-2;
lamp3Helper.rotation.x=Math.PI/2;
lamp3Helper.rotation.z=-Math.PI/4;

sceneElements.sceneGraph.add(lamp3Helper);

const bigLamp3 = buildWall(86,30-2,-5,4,4,0.5,texture="", color="#949494");
bigLamp3.rotation.y=Math.PI/4;
bigLamp3.rotation.x=-Math.PI/4;

sceneElements.sceneGraph.add(bigLamp3);


const lamp4 = createCylinder(0.5,0.5,30, color="#FFF", texture="");
lamp4.position.y=15;
lamp4.position.x=90;
lamp4.position.z=49;


sceneElements.sceneGraph.add(lamp4);

const lamp4Helper = createCylinder(0.5,0.5,5, color="#FFF", texture="");
lamp4Helper.position.x=90-2;
lamp4Helper.position.y=30;
lamp4Helper.position.z=49-2;
lamp4Helper.rotation.x=Math.PI/2;
lamp4Helper.rotation.z=-Math.PI/4;

sceneElements.sceneGraph.add(lamp4Helper);

const bigLamp4 = buildWall(86,30-2,45,4,4,0.5,texture="", color="#949494");
bigLamp4.rotation.y=Math.PI/4;
bigLamp4.rotation.x=-Math.PI/4;

sceneElements.sceneGraph.add(bigLamp4);


const lamp5 = createCylinder(0.5,0.5,30, color="#FFF", texture="");
lamp5.position.y=15;
lamp5.position.x=90;
lamp5.position.z=99;


sceneElements.sceneGraph.add(lamp5);


const lamp5Helper = createCylinder(0.5,0.5,5, color="#FFF", texture="");
lamp5Helper.position.x=90-2;
lamp5Helper.position.y=30;
lamp5Helper.position.z=99-2;
lamp5Helper.rotation.x=Math.PI/2;
lamp5Helper.rotation.z=-Math.PI/4;

sceneElements.sceneGraph.add(lamp5Helper);

const bigLamp5 = buildWall(86,30-2,95,4,4,0.5,texture="", color="#949494");
bigLamp5.rotation.y=Math.PI/4;
bigLamp5.rotation.x=-Math.PI/4;

sceneElements.sceneGraph.add(bigLamp5);


// 95 45 -5
for (var i=-5; i<=95; i+=50){
    const l = createPoinLight(86,28,i, "pontoLuz"+i);
    sceneElements.sceneGraph.add(l);
    pointLightNames.push("pontoLuz"+i);
}


// Polidesportivo

const polidesportivo = createBox(32,10,20, 0xcbbeb5,texture="")
polidesportivo.position.x=70;
polidesportivo.position.y=5;
polidesportivo.position.z=-70;

sceneElements.sceneGraph.add(polidesportivo)

const polidesportivo2 = createBox(32,10,20, 0xb8baba , texture="");
polidesportivo2.position.x=70+10;
polidesportivo2.position.y=15;
polidesportivo2.position.z=-70-10;

sceneElements.sceneGraph.add(polidesportivo2)


const polidesportivoCylinder = createCylinder(1,1,15, 0xD3D3D3);
polidesportivoCylinder.position.x=94;
polidesportivoCylinder.position.y=7.5;
polidesportivoCylinder.position.z=-88;
sceneElements.sceneGraph.add(polidesportivoCylinder);

const polidesportivoCylinder2 = createCylinder(1,1,15, 0xD3D3D3);
polidesportivoCylinder2.position.x=68;
polidesportivoCylinder2.position.y=7.5;
polidesportivoCylinder2.position.z=-88;
sceneElements.sceneGraph.add(polidesportivoCylinder2);

const polidesportivoCylinder3 = createCylinder(1,1,15, 0xD3D3D3);
polidesportivoCylinder3.position.x=94;
polidesportivoCylinder3.position.y=7.5;
polidesportivoCylinder3.position.z=-73;
sceneElements.sceneGraph.add(polidesportivoCylinder3);

const polidesportivoTop = createPlane(32,20,0x373737);
polidesportivoTop.position.x=80;
polidesportivoTop.position.y=20.001;
polidesportivoTop.position.z=-80;
polidesportivoTop.rotation.x=Math.PI/2;

sceneElements.sceneGraph.add(polidesportivoTop);


for (let i=0; i<3; i++){
    const painelSolar = createBox(4,6,0.3, color=0x353C76, texture="assets/solar.jpg");
    
    painelSolar.rotation.x=Math.PI/4;
    painelSolar.position.x=85-i*5;
    painelSolar.position.y=22;
    painelSolar.position.z=-80;
    
    sceneElements.sceneGraph.add(painelSolar);
    const solarCylinder = createCylinder(0.1,0.1,4, color=0xFFFFFF);
    solarCylinder.position.x=85-i*5;
    solarCylinder.position.y=22;
    solarCylinder.position.z=-78;
    sceneElements.sceneGraph.add(solarCylinder);
}

const polidesportivoDoor = createBox(4,6,0.3, color=0x5d2906, texture="");
polidesportivoDoor.position.x=60;
polidesportivoDoor.position.y=3;
polidesportivoDoor.position.z=-80;

sceneElements.sceneGraph.add(polidesportivoDoor);




// Janelas para os polidesportivos

const wi = createBox(13,6,0.3, color=0xFFFFFF, texture="");
wi.position.x=86;
wi.position.y=5;
wi.position.z=-70;
wi.rotation.y=Math.PI/2;
sceneElements.sceneGraph.add(wi);

for (let i=0; i<2; i++){
    const wi2 = createCylinder(3,3,1, color=0xFFFFFF);
    wi2.position.x=96.5;
    wi2.position.y=15;
    wi2.position.z=-74-i*12;
    wi2.rotation.z=-Math.PI/2;
    
    sceneElements.sceneGraph.add(wi2);
}


for (let i=0; i<2; i++){
    const wi3 = createBox(17,6,0.3, color=0xFFFFFF, texture="");
    wi3.position.x=80;
    wi3.position.y=15;
    wi3.position.z=-70-i*20;
    sceneElements.sceneGraph.add(wi3);
}


for (let i =0; i<3;i++){
    const wi_tmp = createCylinder(3,3,1, color=0xFFFFFF);
    wi_tmp.position.x=80-i*10;
    wi_tmp.position.y=5;
    wi_tmp.position.z=-60;
    wi_tmp.rotation.x=-Math.PI/2;

    sceneElements.sceneGraph.add(wi_tmp);
}


for (let i =0; i<2;i++){
    const wi_tmp = createCylinder(3,3,1, color=0xFFFFFF);
    wi_tmp.position.x=80-i*10;
    wi_tmp.position.y=5;
    wi_tmp.position.z=-60-20;
    wi_tmp.rotation.x=-Math.PI/2;

    sceneElements.sceneGraph.add(wi_tmp);
}


for (let i =0; i<2;i++){
    const postePolidesportivoR = createBox(3,11,3, color="", texture="assets/brick.jpg");
    postePolidesportivoR.position.x=37;
    postePolidesportivoR.position.y=5.5;
    postePolidesportivoR.position.z=-91+i*20;
    
    sceneElements.sceneGraph.add(postePolidesportivoR);
    
    const postePolidesportivoL = createBox(4,1,4, color=0xFFFFFF, texture="");
    postePolidesportivoL.position.x=37;
    postePolidesportivoL.position.y=11.5;
    postePolidesportivoL.position.z=-91+i*20;
    postePolidesportivoL.rotation.y=Math.PI;
    sceneElements.sceneGraph.add(postePolidesportivoL);

    const topSphere = createSphere(raio=2,widthSegments=32,heightSegments=16, color=0x8e8e8e,texture="")

    topSphere.position.x=37;
    topSphere.position.y=12+2;
    topSphere.position.z=-91+i*20;
    sceneElements.sceneGraph.add(topSphere);
}


const lightPolidesportivo = createCylinder(0.5,0.5,4, color=0x000000);
lightPolidesportivo.position.x=63;
lightPolidesportivo.position.y=11;
lightPolidesportivo.position.z=-85;
lightPolidesportivo.rotation.z=Math.PI/2;
sceneElements.sceneGraph.add(lightPolidesportivo);


const luzVelha = createPoinLight(61,11,-85,"pavilhaoLight");
sceneElements.sceneGraph.add(luzVelha);


// Portão do polidesportivo

const portao = createBox(19,10,0.3, color=0x5d2906, texture="");
portao.name="portao";
portao.position.x=37;
portao.position.y=5;
portao.position.z=-80;
portao.rotation.y=Math.PI/2;
sceneElements.sceneGraph.add(portao);