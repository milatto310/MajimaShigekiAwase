exports.main = (param) => {
    const game = g.game; // よくアクセスするため変数に保持しておく
    const scene = new g.Scene({
      game,
      assetPaths: ["/assets/images/*","/assets/sounds/*"]
    });

    let time = 30;
    let r = param.random.generate();
    let mr = Math.floor(r * (Math.floor(5) - Math.ceil(1)) + Math.ceil(1));
    let mtex;
    let ml;
    let ma;
    let maAsset;
    let startCD = 3;
    let missTime;
    let missFlag = false;
    let usedTex = [];
    // ニコ生ゲームのランキングモードでは g.game.vars.gameState.score の値がスコアとして扱われる
    game.vars.gameState = { score: 0 };
    scene.onLoad.add(() => {
        
        //背景
        const background = new g.FilledRect({
            scene,
            cssColor:"#d7d3d6",
            x:0,
            y:0,
            width:game.width,
            height:game.height,
        })
        scene.append(background);

        //フォント
        const font = new g.DynamicFont({
            game: game,
            fontFamily: "sans-serif",
            size:60
        });

        //ラベル
        const timeLabel = new g.Label({
            scene: scene,
            font: font,
            text: "TIME:0",
            fontSize: 30,
            textColor: "blue",
            x: game.width/2,
            y: 150,
            anchorX: 0.5,
            anchorY: 0.5,
        });
        scene.append(timeLabel);

        const scoreLabel = new g.Label({
            scene,
            font: font,
            text:"Score:0",
            fontSize:30,
            textColor:"red",
            x: game.width /4 *3,
            y: 150,
            anchorX: 0.5,
            anchorY: 0.5,
        });
        scene.append(scoreLabel);

        const startLabel = new g.Label({
            scene,
            font: font,
            text:"3",
            fontSize:60,
            textColor:"yellow",
            x: game.width / 2,
            y: game.height / 2,
            anchorX: 0.5,
            anchorY: 0.5,
        });

        const setumei = new g.Label({
            scene,
            font: font,
            text:"シルエットと同じ真島を選ぼう！",
            fontSize:60,
            textColor:"white",
            x: game.width / 2,
            y: game.height / 3,
            anchorX: 0.5,
            anchorY: 0.5,
        });

        const sound1Assets = scene.asset.getAudio("/assets/sounds/thinko");
        const sound1 = game.audio.create(sound1Assets);

        const sound2Assets = scene.asset.getAudio("/assets/sounds/mouikkai");
        const sound2 = game.audio.create(sound2Assets);

        const sound3Assets = scene.asset.getAudio("/assets/sounds/konnnitiha");
        const sound3 = game.audio.create(sound3Assets);
        

        const majima1 = new g.Sprite({
            scene,
            src:scene.asset.getImage("/assets/images/majima_0.png"),
            x: game.width / 5,
            y: (game.height /4) * 3,
            anchorX:0.5,
            anchorY:0.5,
            scaleX:0.25,
            scaleY:0.25,
            touchable: true,
            tag:1
        });

        const majima2 = new g.Sprite({
            scene,
            src:scene.asset.getImage("/assets/images/majima_0.png"),
            x: (game.width / 5) * 2,
            y: (game.height /4) * 3,
            anchorX:0.5,
            anchorY:0.5,
            scaleX:0.25,
            scaleY:0.25,
            touchable: true,
            tag:2,
        });

        const majima3 = new g.Sprite({
            scene,
            src:scene.asset.getImage("/assets/images/majima_0.png"),
            x: (game.width / 5) * 3,
            y: (game.height /4) * 3,
            anchorX:0.5,
            anchorY:0.5,
            scaleX:0.25,
            scaleY:0.25,
            touchable: true,
            tag:3,
        });

        const majima4 = new g.Sprite({
            scene,
            src:scene.asset.getImage("/assets/images/majima_0.png"),
            x: (game.width / 5) * 4,
            y: (game.height /4) * 3,
            anchorX:0.5,
            anchorY:0.5,
            scaleX:0.25,
            scaleY:0.25,
            touchable: true,
            tag:4,
        });
        
        const majimaA = new g.Sprite({
            scene,
            src:scene.asset.getImage("/assets/images/majima_1.png"),
            x: game.width / 2,
            y: game.height /2 - 50,
            anchorX:0.5,
            anchorY:0.5,
            scaleX:0.25,
            scaleY:0.25,
            touchable: true,
            tag:0,
        });

        const majimaCover = new g.FilledRect({
            scene,
            cssColor:"#000",
            x:0,
            y:0,
            width:game.width,
            height:game.height,
            compositeOperation: "source-atop",
        });

        const pane = new g.Pane({ scene:scene, width:game.width , height:game.height});

        scene.append(majima1);
        scene.append(majima2);
        scene.append(majima3);
        scene.append(majima4);
        pane.append(majimaA);
        pane.append(majimaCover);
        scene.append(pane);

        const startCover = new g.FilledRect({
            scene,
            cssColor:"#555",
            x:0,
            y:0,
            width:game.width,
            height:game.height,
            opacity:0.5,
        });
        scene.append(startCover);

        scene.append(startLabel);
        scene.append(setumei);
        
        

        

        isClicked(majima1);
        isClicked(majima2);
        isClicked(majima3);
        isClicked(majima4); 

        //真島クリック判定関数

        function isClicked (e){
            
                e.onPointDown.add(function(){
                    if(time > 0 && missFlag == false){
                    ml = e.tag;
                    if(ml === mr){
                        sound1.play();
                        g.game.vars.gameState.score += 1;
                        scoreLabel.text = "Score:" + g.game.vars.gameState.score;
                        scoreLabel.invalidate();
            
                    } else {
                        sound2.play();
                        missTime = Math.ceil(time);
                        missFlag = true;
                        scene.append(startCover);
                        
                    }

                    setGame();
                    }
                });
            
        }

            
            

        function setGame(){
        r = param.random.generate();
        mr = Math.floor(r * (Math.floor(5) - Math.ceil(1)) + Math.ceil(1));
        
        r = param.random.generate();
        ma = Math.floor(r * (Math.floor(14) - Math.ceil(1)) + Math.ceil(1));

        usedTex = [];

        majimaChange(majimaA);
        maAsset = majimaA.src;


        majimaChange(majima1);
        majimaChange(majima2);
        majimaChange(majima3);
        majimaChange(majima4);
        }

        function majimaChange(e){
            //真島の見た目変更
            if(e.tag == mr){
                e.src = maAsset;
    
            }else{
                do{
                r = param.random.generate();
                mtex = Math.floor(r * (Math.floor(14) - Math.ceil(1)) + Math.ceil(1));
                //console.log("mtex" + mtex);
            switch(mtex){
                case 1:
                    e.src = scene.asset.getImage("/assets/images/majima_1.png");
                    console.log("hi");
                    break;
                    
                case 2:
                    e.src = scene.asset.getImage("/assets/images/majima_2.png");
                    break;
                case 3:
                    e.src = scene.asset.getImage("/assets/images/majima_3.png");
                    break;
                case 4:
                    e.src = scene.asset.getImage("/assets/images/majima_4.png");
                    break;
                case 5:
                    e.src = scene.asset.getImage("/assets/images/majima_5.png");
                    break;
                case 6:
                    e.src = scene.asset.getImage("/assets/images/majima_6.png");
                    break;
                case 7:
                    e.src = scene.asset.getImage("/assets/images/majima_7.png");
                    break;
                case 8:
                    e.src = scene.asset.getImage("/assets/images/majima_8.png");
                    break;
                case 9:
                    e.src = scene.asset.getImage("/assets/images/majima_9.png");
                    break;
                case 10:
                    e.src = scene.asset.getImage("/assets/images/majima_10.png");
                    break;
                case 11:
                    e.src = scene.asset.getImage("/assets/images/majima_11.png");
                    break;
                case 12:
                    e.src = scene.asset.getImage("/assets/images/majima_12.png");
                    break;
                case 13:
                    e.src = scene.asset.getImage("/assets/images/majima_13.png"); 
                    break;  
            }
        } while (mtex == ma || usedTex.includes(mtex));

        //console.log(usedTex.includes(mtex));
        usedTex.push(mtex);
        //console.log(usedTex);
        
            
        }
            e.invalidate();
        }
        

        let updateHandler = function () {

            if(Math.ceil(startCD) > 0){
                if(startCD == 3){
                    sound3.play();
                    g.game.vars.gameState.score = 0;
                }
                startCD -= 1 / g.game.fps;
                startLabel.text = Math.ceil(startCD).toString();
                startLabel.invalidate();
            } else if (Math.ceil(startCD) == 0){
                startCover.remove();
                startLabel.remove();
                setumei.remove();
                setGame();
                startCD -= 1;
            }

            if(missTime > time + 3 && missFlag == true){
                startCover.remove();
                missFlag = false;
            }

            if(startCD < 0){
                if (time <= 0) {
                    scene.onUpdate.remove(updateHandler); // カウントダウンを止めるためにこのイベントハンドラを削除します
                    //game.vars.gameState.score = score;
                }
                // カウントダウン処理
                time -= 1 / g.game.fps;
                timeLabel.text = "TIME: " + Math.ceil(time);
                timeLabel.invalidate();
            }
        };
        scene.onUpdate.add(updateHandler);
    });
    game.pushScene(scene);

    

    
  };