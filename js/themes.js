(function(){
  let now = Date.now();
  function normalize(date) {
    let conversion = {
      jan: 1,
      january: 1,
      feb: 2,
      february: 2,
      march: 3,
      mar: 3,
      april: 4,
      apr: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      aug: 8,
      sept: 9,
      september: 9,
      oct: 10,
      october: 10,
      nov: 11,
      november: 11,
      dec: 12,
      december: 12
    }
    let [month, day, yearOffset] = date.split(' ');
    let output =  Date.parse(`${conversion[month.toLowerCase()]}-${day}-${new Date(now).getFullYear() + Number(yearOffset || '0')}`);

    return output
  }
  function between(dateA, dateB) {
    return normalize(dateA) <= now && normalize(dateB) >= now
  }
  function apply(sheetName) {
    // Apply css style sheet based on url!!!!!!!!!
    sheetName = encodeURIComponent(sheetName);
    if (sheetName === '..') {
      sheetName = ''
    }
    if (location.hostname === "2-2048.jamirror.repl.co") {
      sheetName = `/style/${sheetName}.css`
    } else {
      sheetName = `/2-2048/style/${sheetName}.css`
    }
    let sheets = document.styleSheets;
    let sheetIndex = sheets.length;
    let sheetLink = document.createElement('link');
    sheetLink.setAttribute('rel', 'stylesheet');
    sheetLink.setAttribute('type', 'text/css');
    sheetLink.setAttribute('href', sheetName);
    document.head.appendChild(sheetLink);
    return sheetIndex;
  }
  if (localStorage.theme !== undefined) {
    return apply(localStorage.theme)
  }

  if (between('Oct 1', 'Nov 1')) { // Themes for Halloween
    apply('halloween');
  } else if (between('Dec 1', 'Jan 1 1')) { // Themes for Christmas
    apply('christmas');
  }
})()