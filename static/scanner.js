function onScanSuccess(decodedText, decodedResult) {
  // // Toggle a class (adds if missing, removes if present)

  console.log("ISBN:", decodedText);

  // document.getElementById("result").innerHTML = "ISBN: " + decodedText;
  document.getElementById("result").innerHTML =
    "<a class='scan-again' href='#' onclick='window.location.reload(); return false;'>Scan another book</a>";
  document.getElementById("scanbook").innerHTML = "";
  // Stop scanning after first successful scan
  html5QrCode.stop();

  // Send ISBN to Python backend
  fetch("/scan", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      isbn: decodedText,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      let cover;
      let price;
      let author;
      if (data.cover == "") {
        cover = "";
      } else {
        cover = "<img class='cover-img' src='/static/img/" + data.cover + "'>";
      }
      if (data.price == "") {
        price = "";
      } else {
        price = "$" + data.price;
      }
      if (data.author == "") {
        author = "";
      } else {
        author = data.author;
      }
      document.getElementById("book").innerHTML =
        "<div>" +
        cover +
        "</div><div class='author'><a href='#' class='title-link'>" +
        data.title +
        "</a><br /><div class='second'>" +
        author +
        "<br /> " +
        price +
        "</div></div>";
    });

  const element = document.querySelector(".endresult");
  element.classList.toggle("active");
}

const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
  { facingMode: "environment" },

  {
    fps: 10,
    qrbox: 250,
  },

  onScanSuccess,
);
