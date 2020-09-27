(() => {
    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let curruntScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간, playAnimation() 함수 실행시 신이 변경될때 음수로 숫자가 튀는것을 필터

    const sceneInfo = [
        {
            // section 0
            type: 'sticky',
            heightNum: 5, 
            // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            // 스크롤(애니메이션의) 높이(구간) 셋팅은 다른 함수에서
            // 디바이스별 크기가 다른 스크린에 높이값에 유동적으로 대응하기 위해서
            objs: {
                container : document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),

                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: [],
            },
            values: {
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],

                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],

                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],

                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],

                videoImageCount: 300,
                imageSequence: [0, 299],
                canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
                // 이미지 갯수, 순서값
            }
        },
        {
            // section 1
            type: 'normal', // type 이 normal 인 경우 setLayout() 초기 설정시 높이값을 따로 줄필요없게
            // heightNum: 5, // normal 에서는 불필요
            scrollHeight: 0,
            objs: {
                container : document.querySelector('#scroll-section-1'),
            }
        },
        {
            // section 2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
                            
                canvas: document.querySelector('#video-canvas-1'),
                context: document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages: [],
            },
            values: {
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
                messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
                messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
                messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
                messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
                messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
                messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
                messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
                messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
                messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
                messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
                pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
                
                videoImageCount: 960,
                imageSequence: [0, 959],
                canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
                canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
            }
        },
        {
            // section 3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
            },
            values: {

            },

        },
    ];
    // 1. 애니메이션(섹션)에 대한 정보를 배열에 담기


    function setCanvasImages() {
        let imgElem;
        for (let i = 0; i< sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./../video/001/IMG_${6726 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem)
        }

        
        let imgElem2;
        for (let i = 0; i< sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image();
            imgElem2.src = `./../video/002/IMG_${7027 + i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem2)
        }
    }
    setCanvasImages()
    // 6. 캔버스 이미지


    function setLayout() {
        for (let i = 0; i < sceneInfo.length; i++) {
            if ( sceneInfo[i].type === 'sticky' ) {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if ( sceneInfo[i].type === 'normal' ) {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        // 각 섹션의 높이 설정
        
        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if ( totalScrollHeight >= yOffset ) {
                curruntScene = i;
                break;
            }
        }

        document.body.setAttribute('id', `show-scene-${curruntScene}`)
        // 중간 위치에서 새로고침 했을때

        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        // canvas 1920/1080 사이즈를 css transform scale 활용해서 높이기준 100%로 맞추기

    }
    // 2. 각 스크롤 섹션의 높이 세팅 및 초기화 함수

    function calcValues (values, currentYOffset) {
        let rv;
        const scrollHeight = sceneInfo[curruntScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if ( values.length === 3 ) {
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight
            const partScrollHeihgt = partScrollEnd - partScrollStart;
            if ( currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd ) {
                rv = ( currentYOffset - partScrollStart ) / partScrollHeihgt * ( values[1] - values[0] ) + values[0];   
            } else if ( currentYOffset < partScrollStart ) {
                rv = values[0];
            } else if ( currentYOffset > partScrollStart ) {
                rv = values[1];
            }
            // start ~ end 사이에 애니메이션 실행
        } else {
            rv = scrollRatio * ( values[1] - values[0] ) + values[0];   
        }

        return rv;
    }
    // 5. 나눠진 구간의 스크롤 비율을 구하는 함수

    function playAnimation() {
        const objs = sceneInfo[curruntScene].objs;
        const values = sceneInfo[curruntScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[curruntScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch (curruntScene) {
            case 0:
                // console.log('0 play');

                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset)
                // 이미지 삽입

                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }

                break;
            case 2:
                // console.log('2 play');

                let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

                if (scrollRatio <= 0.5) {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                } else {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }

                if (scrollRatio <= 0.32) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.67) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }
    
                if (scrollRatio <= 0.93) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }
                
                break;
                
            case 3:
                // console.log('3 play')
                break;
        }
    }
    // 4. 해당 구간을 나누고(이전에 구한curruntScene 를 활용하여) 개별적인 애니메이션을 실행해보자!

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i = 0; i < curruntScene; i++) {
            prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[curruntScene].scrollHeight) {
            enterNewScene = true;
            curruntScene++;
            document.body.setAttribute('id', `show-scene-${curruntScene}`)
        } 
        // 스크롤 내려갈때
        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
            if (curruntScene === 0) return; // 브라우저 바운스 효과로 마이너스가 되는것을 방지
            curruntScene--;
            document.body.setAttribute('id', `show-scene-${curruntScene}`)
        }
        // 스크롤 올라갈때

        if (enterNewScene) return;

        playAnimation();
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
        // 스크롤시 매번 실행되는 함수
    })
    // 3. 어떤 섹션이 스크롤 되고 있는지 , curruntScene 를 구하자!

    // window.addEventListener('DOMContentLoaded', setLayout)
    window.addEventListener('load', () => {
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    })
    window.addEventListener('resize', setLayout)
    

})();