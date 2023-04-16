import "./style.css";
import * as THREE from "three";
import { PointLight } from "three";
import { AnimationObjectGroup } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Para iniciar são necessários 3 objetos:
 * - cena
 * - camera
 * - renderizador
 *
 * Container que possui todos os objetos, câmera e luzes
 */
const cena = new THREE.Scene();

/**
 * Para observar a cena, é preciso de uma câmera
 * A câmera de perspectiva é a que se assemelha à visão humana
 *
 * Parâmetros:
 * Campo de visão: ângulo de visão da câmera
 * Proporção da tela: o tamanho da janela do navegador do usuário
 * 3 e 4 -> Plano de corte (frustum): que objetos estão visíveis a partir da distância menor (parâmetro 3) e maior (parâmetro 4)
 */
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

/**
 * Configura o rendererizador da cena
 * O renderizador precisa saber onde na tela ca cena será renderizada, em qual elemento.
 */
const renderizador = new THREE.WebGL1Renderer({
    canvas: document.querySelector("#bg"),
});

// Configura a proporção de pixels
renderizador.setPixelRatio(window.devicePixelRatio);
// Configura o tamanho do renderizador para o tamanho da tela
renderizador.setSize(window.innerWidth, window.innerHeight);

// Configura a posição inicial da câmera
camera.position.z = 30;
camera.position.x = -3;

// Renderiza a cena no navegador
renderizador.render(cena, camera);

/**
 * Objetos de cena
 *
 * Para criar objetos são necessários 3 informações
 * 1. Geometria: pontos {x, y, z} que compõe a forma
 * 2. Material: o "papel de embrulho" de um objeto (wrapper)
 * 3. Malha: a junção da geometria e do material
 */

const geometria = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
// const material = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     wireframe: true,
// });
const formaToro = new THREE.Mesh(geometria, material);

// Adiciona o objeto à cena
cena.add(formaToro);

/**
 * Luzes
 *
 * Adicionamos luzes para que as formas sejam visíveis na tela escura
 */

// Cria um ponto de luz, algo como uma lampada
const pontoDeLuz = new THREE.PointLight(0xffffff);
pontoDeLuz.position.set(5, 5, 5);

// Cria a luz ambiente, para iluminar de forma mais uniforme os objetos
const luzAmbiente = new THREE.AmbientLight(0xffffff);
cena.add(pontoDeLuz, luzAmbiente);

// Cria auxiliares de desenvolvimento que mostram a posição da luz e da câmera
// const ajudanteDePontoDeLuz = new THREE.PointLightHelper(pontoDeLuz);
const ajudanteDeGrid = new THREE.GridHelper(200, 50);
// cena.add(ajudanteDePontoDeLuz, ajudanteDeGrid);
cena.add(ajudanteDeGrid);

// Função para criação de estrelas
function adicionarEstrela() {
    const geometria = new THREE.SphereGeometry(
        0.1 + Math.random() * 0.5,
        24,
        24
    );
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const formaEstrela = new THREE.Mesh(geometria, material);

    // Randomiza os valorez de {x, y, z} para a variável de posição
    const posicao = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(100));

    formaEstrela.position.set(...posicao);
    cena.add(formaEstrela);
}

// Cria 200 entrelas
Array(200).fill().forEach(adicionarEstrela);

// Cria uma textura, carregando uma imagem
const texturaDeEspaco = new THREE.TextureLoader().load("espaco.jpeg");
// Adiciona a textura ao background da cena
cena.background = texturaDeEspaco;

// Cria controles para movimentar a forma
// const controles = new OrbitControls(camera, renderizador.domElement);

/**
 * Função recursiva (que chama a si mesmo), que cria um looping infinito
 * e chama o método de renderização automaticamente
 */
function animar() {
    // Informamos o navegador que queremos criar uma aniamação
    requestAnimationFrame(animar);

    /**
     * Altera os valores {x, y, z} referêntes a rotação da forma
     * essa altearação será executada a cada frame, ou seja,
     * para cada vez que essa função for executada no looping
     */
    formaToro.rotation.x += 0.01;
    formaToro.rotation.y += 0.005;
    formaToro.rotation.z += 0.01;

    // Atualizamos a posição dos controles
    // controles.update();

    // Renderiza a animação na tela
    renderizador.render(cena, camera);
}

// Cria o "game loop"
animar();

// Função de callback para mover a câmera sempre que o usuário fizer scroll
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;

    formaToro.rotation.x += 0.05;
    formaToro.rotation.y += 0.075;
    formaToro.rotation.z += 0.05;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}

// Adiciona um ouvinte para o evento de scroll
document.addEventListener("scroll", moveCamera);

// Defione uma função para atualizar o tamanho da cena em resposta a eventos de redimensionamento da janela
function atualizarTamanhoCena() {
    const largura = window.innerWidth;
    const altura = window.innerHeight;
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
    renderizador.setSize(largura, altura);
}

// // chame a função uma vez para definir o tamanho inicial da cena
atualizarTamanhoCena();

// adicione um ouvinte de evento para atualizar o tamanho da cena quando a janela é redimensionada
window.addEventListener("resize", atualizarTamanhoCena);
