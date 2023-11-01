console.log("Happy holidays!!")
// Make .title letters cycle through christmas lights colors

const titleElem = document.querySelector('.title');
const colors = ['green', 'blue', 'yellow', 'white']; // Add more colors if needed

let currentIndex = 0;

setInterval(() => {
  titleElem.style.color = colors[currentIndex];
  currentIndex = (currentIndex + 1) % colors.length;
}, 700); // Change the duration (in milliseconds) to adjust the speed of cycling

titleElem.style.color = 'white'