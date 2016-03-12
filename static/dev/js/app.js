"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, Redirect} from 'react-router'
import {useBasename, createHistory} from 'history/lib';
import Firebase from 'firebase';

class Base {
    static get config() {
        return {
            app_name: "EatLearnBet",
            base_url: "/eatlearngrow",
            firebase_uri: "https://fiery-heat-2689.firebaseio.com/apps/eatlearnbet/db"
        };
    };
    static get history() {
        return useBasename(createHistory)({
            basename: Base.config.base_url
        });
    }
    static get fn() {
        return {
            getObjectFieldValue: (obj, ...fields) => {
                for (var i = 0; i < fields.length; i++) {
                    if (!obj || obj[fields[i]] == null) {
                        return null;
                    }
                    obj = obj[fields[i]];
                }
                return obj;
            },
            getArrayOfObjects: (data) => {
                let array = [];
                for(let key in data) {
                    if (data.hasOwnProperty(key)) {
                        array.push(data[key]);
                    }
                }
                return array;
            }
        }
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        puzzle: []
    };
    render() {
        return this.props.children;
    }
}

class Home extends App {
    render = () => {
       return (
           <div>
               <div className="main-button">
                   <Link to="eat" className="phat-button tall right ui-audio zoomInUp animated">
                       <em><i className="icon icon-eat">
                           <i className="fa fa-cutlery"></i>
                       </i>Eat</em>
                   </Link>
                   <Link to="play" className="phat-button tall right ui-audio zoomInLeft animated">
                       <em><i className="icon"></i>Play</em>
                   </Link>
                   <Link to="learn" className="phat-button tall right ui-audio zoomInDown animated">
                       <em><i className="icon icon-edu">
                           <i className="fa fa-graduation-cap"></i>
                       </i>Learn</em>
                   </Link>
               </div>
               <div id="logo">
                   <img src="static/css/img/logo.svg" width="190" className="bounceInDown animated" />
                   <div>
                       <span className="logo-content">
                           <span className="logo-play">Eat</span>
                           <span className="logo-play">Play</span>
                           <span className="logo-play">Learn</span>
                       </span>
                   </div>
               </div>
           </div>
       )
    }
}

class Play extends App {
    render = () => {
        return this.props.children;
    }
}

class Puzzle extends App {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        this.init();
    };

    puzzle_level = 4;
    puzzle_hover_tinit_color = '#009900';
    _img;

    _canvas;
    _stage;
    _pieces;
    _puzzleWidth;
    _puzzleHeight;
    _pieceWidth;
    _pieceHeight;
    _currentPiece;
    _currentDropPiece;

    _mouse;

    init = () => {
        this._img = new Image();
        this._img.addEventListener('load',this.onImage,false);
        this._img.src = "http://cdn.tutsplus.com/active/uploads/legacy/tuts/403_html5TileSwapPuzzle/demo/mke.jpg";
    };

    onImage = (e) => {
        this._pieceWidth = Math.floor(this._img.width / this.puzzle_level);
        this._pieceHeight = Math.floor(this._img.height / this.puzzle_level);
        this._puzzleWidth = this._pieceWidth * this.puzzle_level;
        this._puzzleHeight = this._pieceHeight * this.puzzle_level;
        this.setCanvas();
        this.initPuzzle();
    };

    setCanvas(){
        this._canvas = this.refs.canvas;
        this._stage = this._canvas.getContext('2d');
        this._canvas.width = this._puzzleWidth;
        this._canvas.height = this._puzzleHeight;
        this._canvas.style.border = "1px solid black";
    }

    initPuzzle = () => {
        this._pieces = [];
        this._mouse = {x:0,y:0};
        this._currentPiece = null;
        this._currentDropPiece = null;
        this._stage.drawImage(this._img, 0, 0, this._puzzleWidth, this._puzzleHeight, 0, 0, this._puzzleWidth, this._puzzleHeight);
        this.createTitle("Click to Start Puzzle");
        this.buildPieces();
    };

    createTitle = (msg) => {
        this._stage.fillStyle = "#000000";
        this._stage.globalAlpha = .4;
        this._stage.fillRect(100,this._puzzleHeight - 40,this._puzzleWidth - 200,40);
        this._stage.fillStyle = "#FFFFFF";
        this._stage.globalAlpha = 1;
        this._stage.textAlign = "center";
        this._stage.textBaseline = "middle";
        this._stage.font = "20px Arial";
        this._stage.fillText(msg,this._puzzleWidth / 2,this._puzzleHeight - 20);
    };

    buildPieces = () => {
        let i;
        let piece;
        let xPos = 0;
        let yPos = 0;
        for(i = 0;i < this.puzzle_level * this.puzzle_level;i++){
            piece = {};
            piece.sx = xPos;
            piece.sy = yPos;
            this._pieces.push(piece);
            xPos += this._pieceWidth;
            if(xPos >= this._puzzleWidth){
                xPos = 0;
                yPos += this._pieceHeight;
            }
        }
        document.onmousedown = this.shufflePuzzle;
    };

    shufflePuzzle = () => {
        this._pieces = this.shuffleArray(this._pieces);
        this._stage.clearRect(0,0,this._puzzleWidth,this._puzzleHeight);
        var i;
        var piece;
        var xPos = 0;
        var yPos = 0;
        for(i = 0;i < this._pieces.length;i++){
            piece = this._pieces[i];
            piece.xPos = xPos;
            piece.yPos = yPos;
            this._stage.drawImage(this._img, piece.sx, piece.sy, this._pieceWidth, this._pieceHeight, xPos, yPos, this._pieceWidth, this._pieceHeight);
            this._stage.strokeRect(xPos, yPos, this._pieceWidth, this._pieceHeight);
            xPos += this._pieceWidth;
            if(xPos >= this._puzzleWidth){
                xPos = 0;
                yPos += this._pieceHeight;
            }
        }
        document.onmousedown = this.onPuzzleClick;
    };

    // TODO: replace shuffleArray algorithm
    shuffleArray = (o) => {
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    onPuzzleClick = (e) => {
        if(e.layerX || e.layerX == 0){
            this._mouse.x = e.layerX - this._canvas.offsetLeft;
            this._mouse.y = e.layerY - this._canvas.offsetTop;
        }
        else if(e.offsetX || e.offsetX == 0){
            this._mouse.x = e.offsetX - this._canvas.offsetLeft;
            this._mouse.y = e.offsetY - this._canvas.offsetTop;
        }
        this._currentPiece = this.checkPieceClicked();
        if(this._currentPiece != null){
            this._stage.clearRect(this._currentPiece.xPos,this._currentPiece.yPos,this._pieceWidth,this._pieceHeight);
            this._stage.save();
            this._stage.globalAlpha = .9;
            this._stage.drawImage(this._img, this._currentPiece.sx, this._currentPiece.sy, this._pieceWidth, this._pieceHeight, this._mouse.x - (this._pieceWidth / 2), this._mouse.y - (this._pieceHeight / 2), this._pieceWidth, this._pieceHeight);
            this._stage.restore();
            document.onmousemove = this.updatePuzzle;
            document.onmouseup = this.pieceDropped;
        }
    };
    checkPieceClicked = () => {
        var i;
        var piece;
        for(i = 0;i < this._pieces.length;i++){
            piece = this._pieces[i];
            if(this._mouse.x < piece.xPos || this._mouse.x > (piece.xPos + this._pieceWidth) || this._mouse.y < piece.yPos || this._mouse.y > (piece.yPos + this._pieceHeight)){
                //PIECE NOT clicked
            }
            else{
                return piece;
            }
        }
        return null;
    };

    updatePuzzle = (e) => {
        this._currentDropPiece = null;
        if(e.layerX || e.layerX == 0){
            this._mouse.x = e.layerX - this._canvas.offsetLeft;
            this._mouse.y = e.layerY - this._canvas.offsetTop;
        }
        else if(e.offsetX || e.offsetX == 0){
            this._mouse.x = e.offsetX - this._canvas.offsetLeft;
            this._mouse.y = e.offsetY - this._canvas.offsetTop;
        }
        this._stage.clearRect(0,0,this._puzzleWidth,this._puzzleHeight);
        var i;
        var piece;
        for(i = 0;i < this._pieces.length;i++){
            piece = this._pieces[i];
            if(piece == this._currentPiece){
                continue;
            }
            this._stage.drawImage(this._img, piece.sx, piece.sy, this._pieceWidth, this._pieceHeight, piece.xPos, piece.yPos, this._pieceWidth, this._pieceHeight);
            this._stage.strokeRect(piece.xPos, piece.yPos, this._pieceWidth,this._pieceHeight);
            if(this._currentDropPiece == null){
                if(this._mouse.x < piece.xPos || this._mouse.x > (piece.xPos + this._pieceWidth) || this._mouse.y < piece.yPos || this._mouse.y > (piece.yPos + this._pieceHeight)){
                    //NOT OVER
                }
                else {
                    this._currentDropPiece = piece;
                    this._stage.save();
                    this._stage.globalAlpha = .4;
                    this._stage.fillStyle = this.puzzle_hover_tinit_color;
                    this._stage.fillRect(this._currentDropPiece.xPos,this._currentDropPiece.yPos,this._pieceWidth, this._pieceHeight);
                    this._stage.restore();
                }
            }
        }
        this._stage.save();
        this._stage.globalAlpha = .6;
        this._stage.drawImage(this._img, this._currentPiece.sx, this._currentPiece.sy, this._pieceWidth, this._pieceHeight, this._mouse.x - (this._pieceWidth / 2), this._mouse.y - (this._pieceHeight / 2), this._pieceWidth, this._pieceHeight);
        this._stage.restore();
        this._stage.strokeRect( this._mouse.x - (this._pieceWidth / 2), this._mouse.y - (this._pieceHeight / 2), this._pieceWidth,this._pieceHeight);
    };

    pieceDropped = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        if(this._currentDropPiece != null){
            var tmp = {xPos:this._currentPiece.xPos,yPos:this._currentPiece.yPos};
            this._currentPiece.xPos = this._currentDropPiece.xPos;
            this._currentPiece.yPos = this._currentDropPiece.yPos;
            this._currentDropPiece.xPos = tmp.xPos;
            this._currentDropPiece.yPos = tmp.yPos;
        }
        this.resetPuzzleAndCheckWin();
    };

    resetPuzzleAndCheckWin = () => {
        this._stage.clearRect(0,0, this._puzzleWidth, this._puzzleHeight);
        var gameWin = true;
        var i;
        var piece;
        for(i = 0;i < this._pieces.length;i++){
            piece = this._pieces[i];
            this._stage.drawImage(this._img, piece.sx, piece.sy, this._pieceWidth, this._pieceHeight, piece.xPos, piece.yPos, this._pieceWidth, this._pieceHeight);
            this._stage.strokeRect(piece.xPos, piece.yPos, this._pieceWidth, this._pieceHeight);
            if(piece.xPos != piece.sx || piece.yPos != piece.sy){
                gameWin = false;
            }
        }
        if(gameWin){
            setTimeout(this.gameOver,500);
        }
    };

    gameOver = () => {
        document.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
        this.initPuzzle();
    };



    render = () => {
        return (
            <div>
                <canvas ref="canvas" id="canvas" />
            </div>
        );
    };
}

ReactDOM.render(
    <Router history={Base.history}>

        <Route path='/' component={App}>

            <IndexRoute component={Home}/>


            <Redirect from="play" to="play/puzzle" />
            <Route path="play" component={Play}>

                <Route path="puzzle" component={Puzzle} />

            </Route>

        </Route>

    </Router>, document.getElementById('app')
);
