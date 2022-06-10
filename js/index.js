$(document).ready(function() {
	let game = {
		elem_index: 0,
		boxLeft: 0,
		st: {
			game_width: 800,
			game_height: 600,
			ball_width: 50,
			ball_height: 50,
			box_width: 100,
			box_height: 50,
			ball_speed: 1,
			game_speed: 1000
		},
		result: {
			got: 0,
			lost: 0
		},
		elements: {},
		countBols: 50
	}
	let poused = false;
	let functions = {
		setConfig: function() {
			$('.area').css({
				width: game.st.game_width,
				height: game.st.game_height
			});
			$('.box').css({
				width: game.st.box_width,
				height: game.st.box_height
			});
		},
		setResults: function() {
			$('.lost span:last-child').text(game.result.lost);
			$('.got span:last-child').text(game.result.got);
			functions.checkResult()
			if(game.result.lost + game.result.got === game.countBols) {
				if(game.result.lost > game.result.got) {
					alert("You lost");
					location.reload();
				} else {
					alert('You win!!! Congrats ');
					location.reload();
				}
			}
		},
		checkResult: function() {
			if(game.result.got === 10) {
				game.st.ball_speed = 30
			}
			if(game.result.got === 15) {
				game.st.box_width = 80
				game.st.box_height = 25
				game.st.ball_width = game.st.ball_height = 25
				game.st.ball_speed = 50
				functions.setConfig();
			}
		},
		mouse: function() {
			($("body")).on({
				mousemove: function(e) {
					let parentOffset = $(".area").offset();
					let relX = game.boxLeft = e.pageX - parentOffset.left - game.st.box_width / 2;
					if(relX >= game.st.game_width - game.st.box_width) {
						game.boxLeft = game.st.game_width - game.st.box_width;
					} else if(relX <= 0) {
						game.boxLeft = 0;
					} else {
						game.boxLeft = relX
					}
					// if(  event.pageX - parentOffset.left -  game.st.box_width/2 < 0 
					// 	|| event.pageX - parentOffset.left -  game.st.box_width/2 > 700){
					// 	poused = true
					// } else {
					// 	poused = false
					// }
					$('.box').css({
						left: game.boxLeft
					})
				}
			})
		},
		interval_1: null,
		interval_2: null,
		
		moveElements: function() {
			if(Object.entries(game.elements)) {
				for(const [key, value] of Object.entries(game.elements)) {
					let elem_top = $(game.elements[key]).position().top;
					let elem_left = $(game.elements[key]).position().left;
					if(elem_top + game.st.ball_height >= game.st.game_height - game.st.box_height) {
						if(elem_left + game.st.ball_width >= game.boxLeft && elem_left <= game.boxLeft + game.st.box_width) {
							$(game.elements[key].remove());
							delete game.elements[key];
							game.result.got++;
							functions.setResults();
						}
					}
					if(elem_top + game.st.ball_height >= game.st.game_height) {
						$(game.elements[key].remove());
						delete game.elements[key];
						game.result.lost++;
						functions.setResults();
					} else {
						elem_top++;
						$(game.elements[key]).css({
							top: elem_top
						});
					}
					if(Object.keys(game.elements).length == 0) {
						clearInterval(functions.interval_2);
					}
				}
			}
		},
		generateElemets: function() {
			if(game.elem_index === game.countBols) {
				clearInterval(functions.interval_1)
			} else if(!poused) {
				let rand = Math.floor((Math.random() * game.st.game_height) + 1);
				game.elem_index++;
				let elem_id = `elem${game.elem_index}`;
				game.elements[elem_id] = $(`<div id="${elem_id}" class="bol"></div>`);
				$(game.elements[elem_id]).css({
					left: rand,
					width: game.st.ball_width,
					height: game.st.ball_height
				})
				$('.area').append(game.elements[elem_id]);
			}
		},
	}
	functions.setConfig();

	function myGame() {
		functions.interval_2 = setInterval(functions.moveElements, game.st.ball_speed);
		functions.interval_1 = setInterval(functions.generateElemets, game.st.game_speed);
		// functions.generateElemets();
		// functions.moveElements();
		functions.mouse();
	}
	($('.buttons')).on({
		click: function(event) {
			let parentOffset = $(".area").offset();
			if(event.target.className === 'start') {
				$('.start').attr('disabled', true);
				functions.setConfig()
				myGame()
			}
			if(event.target.className === 'end') {
				location.reload();
			}
			if(event.target.className === 'pouse') {
				(poused = !poused) ? event.target.innerHTML = 'Play': event.target.innerHTML = 'Pouse'
				if(poused){
					clearInterval(functions.interval_2)
					clearInterval(functions.interval_1)
				} else {
					myGame()
				}
				
			}
		}
	})
})