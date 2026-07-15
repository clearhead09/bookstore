function onScanSuccess(decodedText, decodedResult) {
  // // Toggle a class (adds if missing, removes if present)

  console.log("ISBN:", decodedText);

  
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
      let bookNotFound = false;
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
        bookNotFound = true;
      } else {
        author = data.author;
      }
      if(bookNotFound){
        document.getElementById("book").innerHTML = `
        <div class='not-found'>
        <h2 class="centered">Book not found</h2>
        <div class="spacer"></div>
        <form action="/addbook" method="post" class"add_book_form">
        Title: <input type="text" name="title" class="add_book_text_field"><br />
        Author: <input type="text" name="author" class="add_book_text_field"><br />
        Price: <input type="text" name="price" class="add_book_text_field"><br />
        Cover: <input type="text" name="cover" class="add_book_text_field"><br />
        ISBN: <input type="text" name="isbn" value="${decodedText}" readonly class="add_book_text_field"><br />
        <div class="spacer"></div>
        <input type="submit" value="Add Book" class="add_book_btn">
        </form>
        </div>`;
        
      } else {
        
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
      }
    });
    // document.getElementById("result").innerHTML = "ISBN: " + decodedText;
  document.getElementById("result").innerHTML = ""
    
  document.getElementById("anotherbook").innerHTML = "<a class='scan-again' href='#' onclick='window.location.reload(); return false;'>Scan another book</a>";
  
  
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
