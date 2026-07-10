from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

books = {
    "9780241816271": {
        "author": "Matt Dinniman",
        "title": "Dungeon Crawler Carl",
        "cover": "cover.jpg",
        "price": 20
    },
    "9780007161904": {
        "author": "Mark Mills",
        "title": "Amagansett",
        "cover": "amagansett.jpg",
        "price": 12
    }
}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/scan", methods=["POST"])
def scan():

    data = request.json
    isbn = data["isbn"]

    print("Scanned:", isbn)

    if isbn in books:
        return jsonify(books[isbn])

    return jsonify({
        "title": "Book not found",
        "author": "",
        "cover": "",
        "price": ""
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )