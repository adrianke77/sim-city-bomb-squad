console.log("javascript running");

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded");

});
wireColorArr = ["blue", "green", "red", "white", "yellow"]
wireStatus = [0, 0, 0, 0, 0]
  // 0 for blow-up-when-touched, 1 for disarmer, 2 for cut disarmer
millisecondsDisplay = 0
bombStatus = "on" // "on" for running, "off" for disarmed

// main code starts here

restart() //restore wires, setup disarm/blowup array, start timer

function restart() {
  if (typeof t != "undefined") clearInterval(t)
  if (typeof b != "undefined") clearInterval(b)
  wireColorArr.forEach(function(ele, ind, arr) {
    $("." + ele).empty()
    $("." + ele).append("<img src =./img/uncut-" + ele + "-wire.png>")
  })
  $(".resetButton").empty().removeClass("white").addClass("grey")
  setupWireStatus()
  makeListeners()
  setupTimer() //starts immediately
  bombStatus = "on"
  $(".bombTimer, .bomb, .wirebox").removeClass("hidden")
  $(".bgImgCont img").replaceWith("<img src ='./img/simcity.jpg'>")
  $(".bombTimer").removeClass("greentext").addClass("redtext")
}

function setupTimer() {
  var d = new Date()
  var startTime = d.getTime()
  t = setInterval(function() { //t intentionally declared globally
    updateTimer(startTime)
  }, 27)
}

function updateTimer(startTime) {
  var d = new Date()
  timeLeft = 30000 - (d.getTime() - startTime) // 30 seconds minus time elapsed
  timeLeftString = timeLeft.toString()
  switch (timeLeftString.length) { //padding to front for short strings
    case 4:
      timeLeftString = "0" + timeLeftString
      break
    case 3:
      timeLeftString = "00" + timeLeftString
      break
    case 2:
      timeLeftString = "000" + timeLeftString
      break
    case 1:
      timeLeftString = "0000" + timeLeftString
      break
  }
  if (timeLeft <= 0) {
    timeLeftString = "00000"
    kaboom()
  }
  timerDisplayString = "0:00:" + timeLeftString
  timerDisplayString = timerDisplayString.slice(0, -3) + ":" + timerDisplayString.slice(-3)
  $(".bombTimer").text(timerDisplayString)
}

function setupWireStatus() {
  wireStatus = [0, 0, 0, 0, 0]
  wireStatus.forEach(function(ele, ind, arr) {
    if (Math.random() > 0.5) arr[ind] = 1
  })
  console.log("Wirestatus array is " + wireStatus)
  if ((wireStatus.indexOf(0) === -1) || (wireStatus.indexOf(1) === -1)) {
    setupWireStatus() //redo if the board is either all bombs or all safe
  }
}

function makeListeners() {
  wireColorArr.forEach(function(ele, ind, arr) {
    $("." + ele).on("click", function() {
      wireClick(ele)
    })
  })
}

function wireClick(wireColor) {
  wireIndex = wireColorArr.indexOf(wireColor)
  drawBrokenWire(wireColor)
  if (wireStatus[wireIndex] === 0) {
    console.log("wire starts explosion timer")
    b = setTimeout(kaboom, 750)
    return
  }
  if (wireStatus[wireIndex] === 1) {
    wireStatus[wireIndex] = 2
    if (wireStatus.indexOf(1) === -1) {
      disarmed()
      return
    }
  }
}

function drawBrokenWire(wireColor) {
  $("." + wireColor + " img").replaceWith("<img src =./img/cut-" + wireColor + "-wire.png>")
}

function kaboom() {
  if (typeof b != "undefined") clearInterval(b)
  if (bombStatus === "on") {
    hideBomb()
    clearInterval(t)
    $(".bgImgCont img").replaceWith("<img src ='./img/explosion.jpg'>")
    makeResetButton()
  }
}

function hideBomb() {
  $(".bombTimer, .bomb, .wirebox").addClass("hidden")
}

function disarmed() {
  if (typeof b != "undefined") clearInterval(b)
  clearInterval(t)
  $(".bombTimer").removeClass("redtext").addClass("greentext")
  bombStatus = "off"
  wireColorArr.forEach(function(ele, ind, arr) {
    $("." + ele).off("click")
  })
  makeResetButton()

}

function makeResetButton() {
  $(".resetButton").text("Reset").removeClass("grey").addClass("white")
  $(".resetButton").on("click", restart)
}