import * as THREE from 'three';
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import mask from './img/mask.jpg'
import t1 from './img/t1.png'

export default class sketch{
    constructor(){

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	    this.renderer.setSize( window.innerWidth, window.innerHeight );
	    document.getElementById('container').appendChild( this.renderer.domElement );


        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 3000 );
	    this.camera.position.z = 1000;
        this.scene = new THREE.Scene();

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.point = new THREE.Vector2();

        this.textures = [
            new THREE.TextureLoader().load(t1),
            //new THREE.TextureLoader().load(t1),
        ]
        //this.textures =  new THREE.TextureLoader().load(mask);
        this.time = 0;
        this.move = 0;
        //const controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.addMesh();
        
        this.mouseEffects();
        this.render();
    }

    mouseEffects(){
        
        this.test = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2000,2000), 
            new THREE.MeshBasicMaterial()
        )

        window.addEventListener('mousewheel',(e) => {
            console.log(e.wheelDeltaY);
            this.move +=e.wheelDeltaY/1000;
        })
        
        window.addEventListener('mousemove',(event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera( this.mouse, this.camera);

            let intersects = this.raycaster.intersectObjects( [this.test] );

            this.point.x = intersects[0].point.x 
            this.point.y = intersects[0].point.y

        }, false); 

    }









    addMesh(){
        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms:{
                Progress: {type: "f", value: 0},
                t1: {type: "t", value: this.textures[0]},
                //mask: {type: "t", value: this.mask},
                //t2: {type: "t", value: [1]}
                mouse : {type: "v2", value: null},
                move : {type: "f", value: 0},
                time : {type: "f", value: 0},
            },
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        })
        let number = 512 * 512;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new THREE.BufferAttribute(new Float32Array(number*3),3);
        this.coordinates = new THREE.BufferAttribute(new Float32Array(number*3),3);
        this.speeds = new THREE.BufferAttribute(new Float32Array(number),1);
        this.offset = new THREE.BufferAttribute(new Float32Array(number),1);
        this.direction = new THREE.BufferAttribute(new Float32Array(number),1);
        this.press = new THREE.BufferAttribute(new Float32Array(number),1);

        // function random
        function rand(a,b){
            return a + (b-a)*Math.random();
        }

        let index = 0;
        for (let i = 0; i < 512; i++) {
            let posx = i - 256;
           for (let j = 0; j < 512; j++) {
                this.positions.setXYZ(index,posx*2,(j-256)*2,0)
                this.coordinates.setXYZ(index,i,j,0)
                this.offset.setX(index,rand(-1000,1000))
                this.speeds.setX(index,rand( 0.4, 1))
                this.direction.setX(index,Math.random()>0.5?1:1)
                this.press.setX(index,rand(0.4,1))
                index++;
               
           }
            
        }
        this.geometry.setAttribute("position", this.positions)
        this.geometry.setAttribute("aCoordinates", this.coordinates)
        this.geometry.setAttribute("aOffset", this.offset)
        this.geometry.setAttribute("aSpeed", this.speeds)
        this.geometry.setAttribute("aDirection", this.direction)
        this.geometry.setAttribute("aPress", this.press)
        this.mesh = new THREE.Points( this.geometry, this.material );
	    this.scene.add( this.mesh );
    }

    render(){
        this.time++;
        //this.mesh.rotation.x += 0.01;
	    //this.mesh.rotation.y += 0.02;
        //console.log(this.time);
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.move.value = this.move;
        this.material.uniforms.mouse.value = this.point;
        this.renderer.render( this.scene, this.camera );
        window.requestAnimationFrame(this.render.bind(this));
    }
    
}
new sketch();

 

