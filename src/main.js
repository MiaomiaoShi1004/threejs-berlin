import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

export function initScene() {
  console.log("🚀 initScene() has been called")

  const canvas = document.getElementById('webglCanvas')
  const scene = new THREE.Scene()
  const sizes = { width: window.innerWidth, height: window.innerHeight }

  const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 2000)
  camera.position.set(0, 300, 300)
  camera.lookAt(0, 0, 0)
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(window.devicePixelRatio)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1)
  dirLight.position.set(300, 400, 200)
  scene.add(dirLight)

  const ambLight = new THREE.AmbientLight(0x888888)
  scene.add(ambLight)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 0, 0)
  controls.update()

  controls.minPolarAngle = THREE.MathUtils.degToRad(90);
  controls.maxPolarAngle = THREE.MathUtils.degToRad(160);
  controls.minAzimuthAngle = 0;
  controls.maxAzimuthAngle = 0;

  const mtlLoader = new MTLLoader()
  mtlLoader.setPath('/assets/Tile-112-73-1-1/')
  mtlLoader.load(
    'Tile-112-73-1-1.mtl',
    (materials) => {
      console.log('🟢 MTL loaded successfully')
      materials.preload()

      const objLoader = new OBJLoader()
      objLoader.setMaterials(materials)
      objLoader.setPath('/assets/Tile-112-73-1-1/')
      objLoader.load(
        'Tile-112-73-1-1.obj',
        (objGroup) => {
          console.log('🟢 OBJ loaded successfully')
          // Center the tile:
          const bbox = new THREE.Box3().setFromObject(objGroup)
          const center = bbox.getCenter(new THREE.Vector3())
          objGroup.position.sub(center)

          scene.add(objGroup)
          console.log('✅ Berlin tile added to scene')
        },
        (xhr) => {
          console.log('Loading OBJ: ' + ((xhr.loaded / xhr.total) * 100).toFixed(0) + '%')
        },
        (error) => {
          console.error('Error loading OBJ:', error)
        }
      )
    },
    (xhr) => {
      console.log('Loading MTL: ' + ((xhr.loaded / xhr.total) * 100).toFixed(0) + '%')
    },
    (error) => {
      console.error('Error loading MTL:', error)
    }
  )

  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
  })

  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
}