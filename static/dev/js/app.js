"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, Redirect} from 'react-router'
import {useBasename, createHistory} from 'history/lib';
import Firebase from 'firebase';

const badges = [
    "http://s3.amazonaws.com/commendablekids.com.prod/badges/1/large.png?1391041012",
    "http://s3.amazonaws.com/commendablekids.com.prod/badges/53/large.png?1391052881",
    "http://s3.amazonaws.com/commendablekids.com.prod/badges/119/large.png?1391041564",
    "http://s3.amazonaws.com/commendablekids.com.prod/badges/89/large.png?1391042418",
    "http://s3.amazonaws.com/commendablekids.com.prod/badges/85/large.png?1391046988",
    "http://s3.amazonaws.com/commendablekids.com.prod/badges/23/large.png?1391042382",
    "http://s3.amazonaws.com/commendablekids.com.prod/badges/56/large.png?1391053131"
];
const badge_slogans = [
    "You are academics",
    "Great job",
    "Hard work",
    "Cool stuff",
    "Thumbs up"
];


class Base {
    static get config() {
        return {
            app_name: config.app_name,
            base_url: config.base_url,
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
            getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
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

class Model {
    static firebase_root_ref = new Firebase(Base.config.firebase_uri);
}

//STATELESS REACT COMPONENTS

let Loader = (props) => {
    let className = props.show == true ? "loading-container" : "loading-container fadeOut animated";
    let zIndex = props.show == true ? 9999 : 0;
    return (<div className={className} style={{zIndex: zIndex}}>
        <div className="loader">
            <div className="loader--dot" />
            <div className="loader--dot" />
            <div className="loader--dot" />
            <div className="loader--dot" />
            <div className="loader--dot" />
            <div className="loader--dot" />
            <div className="loader--text" />
        </div>
    </div>);
};

let BackHomeButton = () => {
    return (
        <Link to="/" className="back-home phat-button">
            <i className="fa fa-home" />Home
        </Link>
    );
};

let InnerHtml = (props) => {
    return (<div dangerouslySetInnerHTML={{__html: props.html}} />);
};

// END OF STATELESS REACT COMPONENTS


class App extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        show_loader: true,

        puzzles: {},
        current_puzzle_index: -1,
        current_puzzle: null,
        current_tip_index: -1,
        current_puzzle_tips: [],
        show_next_tip_interval: 3,
        current_interval: 0,
        badge_url: null,
        badge_slogan: null
    };

    render() {
        return this.props.children;
    }
}

class Home extends App {

    componentDidMount = () => {
        setTimeout(() => {
            this.setState({
                show_loader: false
            });
        }, 3300);
    };

    render = () => {
       return this.state.show_loader == true ? (
           <div>
               <Loader show={this.state.show_loader} />
           </div>
       ) : (
           <div>
               <div>
                   <Loader show={this.state.show_loader} />
               </div>

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

class Eat extends App {
    componentDidMount = () => {
        this.getAllRecipes();
        setTimeout(() => {
            this.setState({
                show_loader: false
            });
        }, 1400);
    };
    getAllRecipes = () => {
        let self = this;
        Model.firebase_root_ref.child('recipes').on('value', (ss) => {
            self.setState({
                recipes: Base.fn.getArrayOfObjects(ss.val())
            });
        })
    };
    state = {
        recipes: [],
        current_recipe_index: null,
        show_loader: true
    };
    showRecipe = (index) => {
        this.setState({
            current_recipe_index: index
        });
    };
    closeRecipe = () => {
        this.setState({
            current_recipe_index: null
        });
    };
    render = () => {
        let recipeList = this.state.recipes.map((el, i) => {
            return (
                <div key={i} className="recipe-list fadeIn animated">
                    <div className="phat-button" onClick={this.showRecipe.bind(this, i)}>{el.title}</div>
                </div>
            );
        });
        return (
            <div>
                <Loader show={this.state.show_loader} />
                <BackHomeButton />
                <div className="mid-menu recipe-mid-menu">
                    {recipeList}

                    {(() => {
                        if(this.state.current_recipe_index !== null) {
                            return (
                                <div>
                                    <div className="overlay-bg" onClick={this.closeRecipe} />
                                    <div className="badge zoomIn animated">
                                        <div className="badge-bg">
                                            <div className="slogan">{this.state.recipes[this.state.current_recipe_index].title}</div>
                                            <InnerHtml html={this.state.recipes[this.state.current_recipe_index].html} />
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })()}

                </div>
            </div>
        );
    }
}


class Learn extends App {
    componentDidMount = () => {
        this.getAllRecipes();
    };
    getAllRecipes = () => {
        let self = this;
        Model.firebase_root_ref.child('learn').on('value', (ss) => {
            self.setState({
                learn: Base.fn.getArrayOfObjects(ss.val())
            });
        })
    };
    state = {
        learn: [],
        current_learn_index: null
    };
    showRecipe = (index) => {
        this.setState({
            current_learn_index: index
        });
    };
    closeRecipe = () => {
        this.setState({
            current_learn_index: null
        });
    };
    render = () => {
        let recipeList = this.state.learn.map((el, i) => {
            return (
                <div key={i} className="recipe-list fadeIn animated">
                    <div className="phat-button" onClick={this.showRecipe.bind(this, i)}>{el.title}</div>
                </div>
            );
        });
        return (
            <div>
                <BackHomeButton />
                <div className="mid-menu recipe-mid-menu">
                    {recipeList}

                    {(() => {
                        if(this.state.current_learn_index !== null) {
                            return (
                                <div>
                                    <div className="overlay-bg" onClick={this.closeRecipe} />
                                    <div className="badge zoomIn animated">
                                        <div className="badge-bg">
                                            <div className="slogan">{this.state.learn[this.state.current_learn_index].title}</div>
                                            <div className="entry-content">
                                                <InnerHtml html={this.state.learn[this.state.current_learn_index].html} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })()}

                </div>
            </div>
        );
    }
}

class Play extends App {
    render = () => {
        return (
            <div>
                <BackHomeButton />
                <div className="mid-menu">
                    <Link to="/puzzle" className="phat-button zoomInRight animated">Puzzle</Link>
                    <Link to="/quiz" className="phat-button zoomInDown animated">Quiz</Link>
                </div>
            </div>
        );
    }
}

class Quiz extends App {

    question_area;
    answer_area;
    checker;
    current = 0;
    correct_answer_count = 0;
    all_questions = {
        'Which fruit does Snow White eat, causing her to fall into a deep sleep?' : [' A strawberry', 'An apple', 'A fig', 1],

        'Which gourd magically transforms into a carriage for Cinderella?' : [' A melon', 'A pumpkin' , ' A butternut squash', 1],

        'In the fairy tale Hansel and Gretel, what do the children leave behind to help them find their way out of the woods?' : ['Gingerbread cookies', 'Berries', 'Breadcrumbs', 2],
        'Which of these is Winnie-the-Pooh\'s favorite treat?' : ['Maple syrup','Honey','Peanut butter',1]
    };

    loadQuestion = (curr) => {
        this.question_area.innerHTML = '';
        this.question_area.innerHTML = Object.keys(this.all_questions)[curr];
    };
    loadAnswers = (curr) => {
        let answers = this.all_questions[Object.keys(this.all_questions)[curr]];
        this.answer_area.innerHTML = '';
        for (var i = 0; i < answers.length -1; i += 1) {
            var createDiv = document.createElement('div'),
                text = document.createTextNode(answers[i]);
            createDiv.appendChild(text);
            createDiv.addEventListener("click", this.checkAnswer(i, answers));
            this.answer_area.appendChild(createDiv);
        }
    };
    checkAnswer = (i, arr) => {
        let self = this;
        return function () {
            var correctAnswer = arr[arr.length-1];

            if (i === correctAnswer) {
                self.addChecker(true);
            } else {
                self.addChecker(false);
            }

            if (self.current < Object.keys(self.all_questions).length -1) {
                self.current++;
                self.loadQuestion(self.current);
                self.loadAnswers(self.current);
            } else {
                if(self.correct_answer_count > Object.keys(self.all_questions).length - 2)
                    self.setState({
                        badge_slogan: badge_slogans[Base.fn.getRandomInt(0, badge_slogans.length - 1)],
                        badge_url: badges[Base.fn.getRandomInt(0, badges.length - 1)]
                    });
                self.question_area.innerHTML = 'Done!';
                self.answer_area.innerHTML = '';
            }

        };
    };

    addChecker = (bool) => {
        // This function adds a div element to the page
        // Used to see if it was correct or false

        var createDiv = document.createElement('div'),
            txt       = document.createTextNode((this.current + 1).toString());

        createDiv.appendChild(txt);

        if (bool) {
            createDiv.className += 'correct';
            this.checker.appendChild(createDiv);
            this.correct_answer_count++;
        } else {
            createDiv.className += 'false';
            this.checker.appendChild(createDiv);
        }
    };


    componentDidMount = () => {
        this.question_area = this.refs.question_area;
        this.answer_area = this.refs.answer_area;
        this.checker = this.refs.checker;
        this.loadQuestion(this.current);
        this.loadAnswers(this.current);
    };

    render = () => {
        let badgeHTML = null;
        if(this.state.badge_url) {
            badgeHTML = (
                <div>
                    <div className="overlay-bg" />
                    <div className="badge zoomIn animated">
                        <div className="badge-bg">
                            <div className="slogan">{this.state.badge_slogan}</div>
                            <img src={this.state.badge_url} />
                            <Link to="/puzzle" className="next phat-button tall">Go to puzzle</Link>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div>
                {badgeHTML}
                <BackHomeButton />
                <div id="quiz">
                    <p className="questions" ref="question_area" />
                    <div className="answers" ref="answer_area" />
                    <div className="checkAnswers">
                        <h3>Correct?</h3>
                        <div className="checker" ref="checker" />
                    </div>
                </div>
            </div>
        )
    };
}

class Puzzle extends App {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        let self = this;
        document.addEventListener('keyup', (e) => {
            if (e.ctrlKey && e.keyCode == 85)
                self.showBadge()
        }, false);

        self.getPuzzles();
        setTimeout(() => {
            self.setState({
                show_loader: false
            });
        }, 1600);
    };

    puzzle_level = 4;
    puzzle_hover_tint_color = '#009900';
    _img;

    _canvas;
    _context;
    _pieces;
    _puzzleWidth;
    _puzzleHeight;
    _pieceWidth;
    _pieceHeight;
    _currentPiece;
    _currentDropPiece;

    _mouse;

    getPuzzles = () => {
        Model.firebase_root_ref.child('puzzles').on('value', (ss) => {
            this.state.puzzles = ss.val();
            this.getNextPuzzle();
        });
    };

    getNextPuzzle = () => {
        this.state.current_puzzle_tips = [];
        this.state.current_tip_index = -1;
        this.state.current_puzzle_index++;
        this.state.current_puzzle = this.state.puzzles[Object.keys(this.state.puzzles)[this.state.current_puzzle_index]];
        this.state.current_puzzle.tips = Base.fn.getArrayOfObjects(this.state.current_puzzle.tips);

        this.init();
    };

    getNextTip = () => {
        this.state.current_interval++;

        if(this.state.current_interval == this.state.show_next_tip_interval) {
            this.state.current_interval = 0;
            this.state.show_next_tip_interval = Base.fn.getRandomInt(3,9);
            this.state.current_tip_index++;

            if(this.state.current_puzzle.tips[this.state.current_tip_index]) {
                this.state.current_puzzle_tips.push(this.state.current_puzzle.tips[this.state.current_tip_index]);
                this.setState({
                    current_puzzle_tips: this.state.current_puzzle_tips
                });
            }
        }
    };

    init = () => {
        this._img = new Image();
        this._img.addEventListener('load',this.onImage,false);
        this._img.src = `${Base.config.base_url}${this.state.current_puzzle.img_url}`;
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
        this._context = this._canvas.getContext('2d');
        this._canvas.width = this._puzzleWidth;
        this._canvas.height = this._puzzleHeight;
        this._canvas.style.border = "2px solid #05A4CA";
        this._canvas.style.borderRadius = "10px";
        this._canvas.style.opacity = 0.91;
    }

    initPuzzle = () => {
        this._pieces = [];
        this._mouse = {x:0,y:0};
        this._currentPiece = null;
        this._currentDropPiece = null;
        this._context.drawImage(this._img, 0, 0,
            this._puzzleWidth, this._puzzleHeight, 0, 0, this._puzzleWidth, this._puzzleHeight);
        this.createTitle("Click to Start Puzzle");
        this.buildPieces();
    };

    createTitle = (msg) => {
        this._context.fillStyle = "#000000";
        this._context.globalAlpha = .4;
        this._context.fillRect(100,this._puzzleHeight - 40,this._puzzleWidth - 200,40);
        this._context.fillStyle = "#FFFFFF";
        this._context.globalAlpha = 1;
        this._context.textAlign = "center";
        this._context.textBaseline = "middle";
        this._context.font = "20px Arial";
        this._context.fillText(msg,this._puzzleWidth / 2,this._puzzleHeight - 20);
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
        this._context.clearRect(0,0,this._puzzleWidth,this._puzzleHeight);
        var i;
        var piece;
        var xPos = 0;
        var yPos = 0;
        for(i = 0;i < this._pieces.length;i++){
            piece = this._pieces[i];
            piece.xPos = xPos;
            piece.yPos = yPos;
            this._context.strokeStyle = "#05A4CA";
            this._context.drawImage(this._img, piece.sx, piece.sy, this._pieceWidth,
                this._pieceHeight, xPos, yPos, this._pieceWidth, this._pieceHeight);
            this._context.strokeRect(xPos, yPos, this._pieceWidth, this._pieceHeight);
            xPos += this._pieceWidth;
            if(xPos >= this._puzzleWidth){
                xPos = 0;
                yPos += this._pieceHeight;
            }
        }
        document.onmousedown = this.onPuzzleClick;
    };

    // TODO: replace shuffleArray
    shuffleArray = (o) => {
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    onPuzzleClick = (e) => {

        // console.log(this._canvas.offsetLeft, this._canvas.offsetTop);

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
            this._context.clearRect(this._currentPiece.xPos,this._currentPiece.yPos,this._pieceWidth,this._pieceHeight);
            this._context.save();
            this._context.globalAlpha = .9;
            this._context.drawImage(this._img, this._currentPiece.sx,
                this._currentPiece.sy, this._pieceWidth, this._pieceHeight, this._mouse.x - (this._pieceWidth / 2),
                this._mouse.y - (this._pieceHeight / 2), this._pieceWidth, this._pieceHeight);
            this._context.restore();
            document.onmousemove = this.updatePuzzle;
            document.onmouseup = this.pieceDropped;
        }
    };
    checkPieceClicked = () => {
        var i;
        var piece;
        for(i = 0;i < this._pieces.length;i++){
            piece = this._pieces[i];
            if(this._mouse.x < piece.xPos || this._mouse.x > (piece.xPos + this._pieceWidth) ||
                this._mouse.y < piece.yPos ||
                this._mouse.y > (piece.yPos + this._pieceHeight)){
                //console.log('piece not clicked');
            }
            else{
                return piece;
            }
        }
        return null;
    };

    updatePuzzle = (e) => {

        // console.log(this._canvas.offsetLeft, this._canvas.offsetTop);

        this._currentDropPiece = null;
        if(e.layerX || e.layerX == 0){
            this._mouse.x = e.layerX - this._canvas.offsetLeft;
            this._mouse.y = e.layerY - this._canvas.offsetTop;
        }
        else if(e.offsetX || e.offsetX == 0){
            this._mouse.x = e.offsetX - this._canvas.offsetLeft;
            this._mouse.y = e.offsetY - this._canvas.offsetTop;
        }
        this._context.clearRect(0,0,this._puzzleWidth,this._puzzleHeight);
        var i;
        var piece;
        for(i = 0;i < this._pieces.length;i++){
            piece = this._pieces[i];
            if(piece == this._currentPiece){
                continue;
            }
            this._context.drawImage(this._img, piece.sx, piece.sy, this._pieceWidth, this._pieceHeight, piece.xPos, piece.yPos,
                this._pieceWidth, this._pieceHeight);
            this._context.strokeRect(piece.xPos, piece.yPos, this._pieceWidth,this._pieceHeight);
            if(this._currentDropPiece == null){
                if(this._mouse.x < piece.xPos || this._mouse.x > (piece.xPos + this._pieceWidth) || this._mouse.y < piece.yPos ||
                    this._mouse.y > (piece.yPos + this._pieceHeight)){
                    //NOT OVER
                }
                else {
                    this._currentDropPiece = piece;
                    this._context.save();
                    this._context.globalAlpha = .4;
                    this._context.fillStyle = this.puzzle_hover_tint_color;
                    this._context.fillRect(this._currentDropPiece.xPos,this._currentDropPiece.yPos,this._pieceWidth,
                        this._pieceHeight);
                    this._context.restore();
                }
            }
        }
        this._context.save();
        this._context.globalAlpha = .6;
        this._context.drawImage(this._img, this._currentPiece.sx, this._currentPiece.sy, this._pieceWidth, this._pieceHeight,
            this._mouse.x - (this._pieceWidth / 2), this._mouse.y - (this._pieceHeight / 2),
            this._pieceWidth, this._pieceHeight);
        this._context.restore();
        this._context.strokeRect( this._mouse.x - (this._pieceWidth / 2), this._mouse.y - (this._pieceHeight / 2),
            this._pieceWidth,this._pieceHeight);
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
        this.checkAndReset();
    };

    checkAndReset = () => {
        this.getNextTip();
        this._context.clearRect(0,0, this._puzzleWidth, this._puzzleHeight);
        var gameWin = true;
        var i;
        var piece;
        for(i = 0;i < this._pieces.length;i++){
            piece = this._pieces[i];
            this._context.drawImage(this._img, piece.sx, piece.sy, this._pieceWidth, this._pieceHeight, piece.xPos, piece.yPos,
                this._pieceWidth, this._pieceHeight);
            this._context.strokeRect(piece.xPos, piece.yPos, this._pieceWidth, this._pieceHeight);
            if(piece.xPos != piece.sx || piece.yPos != piece.sy){
                gameWin = false;
            }
        }
        if(gameWin){
            this.gameOver();
        }
    };

    gameOver = () => {
        document.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
        this.showBadge();
    };

    showBadge = () => {
        this.setState({
            badge_slogan: badge_slogans[Base.fn.getRandomInt(0, badge_slogans.length - 1)],
            badge_url: badges[Base.fn.getRandomInt(0, badges.length - 1)]
        });
    };

    _goToNextPuzzle = () => {
        this.setState({
            badge_slogan: null,
            badge_url: null
        }, () => {
            this.getNextPuzzle();
        });
    };

    render = () => {
        let badgeHTML = null;
        if(this.state.badge_url) {
            badgeHTML = (
                <div>
                    <div className="overlay-bg" />
                    <div className="badge zoomIn animated">
                        <div className="badge-bg">
                            <div className="slogan">{this.state.badge_slogan}</div>
                            <img src={this.state.badge_url} />
                            <div className="next phat-button tall" onClick={this._goToNextPuzzle}>Next puzzle</div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <BackHomeButton />
                <Loader show={this.state.show_loader} />
                <div className="puzzle-box">
                    <canvas ref="canvas" id="canvas" />
                    <div className="tip-box">
                        {(() => {
                            return this.state.current_puzzle_tips.map((el, i) => {
                                return (<div key={i} className="tip">
                                    <div className="right-arrow" />
                                    <span>{el}</span>
                                </div>);
                            });
                        })()}
                    </div>
                    {badgeHTML}
                </div>
            </div>
        );
    };
}

ReactDOM.render(
    <Router history={Base.history}>

        <Route path='/' component={App}>

            <IndexRoute component={Home}/>

            <Route path="eat" component={Eat} />
            <Route path="play" component={Play} />
            <Route path="learn" component={Learn} />

            <Route path="puzzle" component={Puzzle} />
            <Route path="quiz" component={Quiz} />

        </Route>

    </Router>, document.getElementById('app')
);
