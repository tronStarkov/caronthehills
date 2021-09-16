var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

var okLeft = false		
var okRight = false

var myCar = new Image()
myCar.src = "myCar.png"

var noise = []
var arrHills = []

// create noise
for (let i = 0; i < 11; i++){
	var tmp = Math.floor(Math.random() * 200) + 200
	noise.push(tmp)
}

// smoothing noise
var smoothNoise = []

for (let i = 0; i < 11; i++){
	if (noise[i] < noise[i+1] || noise[i] === noise[i+1] || noise[i+1] === undefined){
		smoothNoise.push(noise[i])
	}else{
		smoothNoise.push(noise[i+1])
	}
}

// interpolating
var interpol = function(a, b, mid){
    
	ft = mid * Math.PI
	f = (1 - Math.cos(ft)) * 0.5
	return  a*(1-f) + b*f
}

for (let i = 0; i < 10; i++){
	var mid = 0
	
	for (let k = 0; k < 40; k++){
		var midY = interpol(smoothNoise[i], smoothNoise[i+1], mid)
		
		arrHills.push(midY)
		
		mid += 0.025
	}
}

// draw Hills
var drawBack = function(){
	ctx.fillStyle = "skyblue"
	ctx.fillRect(0, 0, 400, 500)
}

var drawHills = function(){	
	for (let i = 0; i < 400; i++){
		ctx.strokeStyle = "green"
		ctx.lineWidth = 3
		ctx.beginPath()
		ctx.moveTo(i, arrHills[i])
		ctx.lineTo(i, arrHills[i] + 10)
		ctx.stroke()
		
		ctx.strokeStyle = "chocolate"		
		ctx.beginPath()
		ctx.moveTo(i, arrHills[i] + 10)
		ctx.lineTo(i, 500)
		ctx.stroke()
	}
}

class Car{
	constructor(x){
		this.x = x
	}
	
	drawCar(){
		if (okLeft === true && this.x > 0){this.x -=2}
		
		if (okRight === true && this.x < 390){this.x +=2}
		
		var tan = (arrHills[this.x +1] - arrHills[this.x]) / 1
		
		var angle = Math.atan(tan)
		
		ctx.save()
		ctx.translate(this.x, arrHills[this.x])
		ctx.rotate(angle)
		ctx.translate(-this.x, -arrHills[this.x])	
		
		ctx.drawImage(myCar, this.x - 30, arrHills[this.x] - 40)
		
		ctx.restore()
	}
}

var car = new Car(60)

var animate = function(){    
	drawBack()
	drawHills()	
	car.drawCar()
	
	requestAnimationFrame(animate)
}
animate()

addEventListener("keydown", function(event){
	if (event.keyCode === 37){
		okLeft = true
	}
	
	if (event.keyCode === 39){
		okRight = true
	}
})

addEventListener("keyup", function(event){
	if (event.keyCode === 37){
		okLeft = false
	}
	
	if (event.keyCode === 39){
		okRight = false
	}
})
