from flask import Flask, request, jsonify, render_template
import mysql.connector
from mysql.connector import Error
from subprocess import call

app = Flask(__name__)

books = {}

def start_db_server():
    # Start the MySQL server
    call(["sudo", "systemctl", "start", "mysqld"])

def run_mysql_query():
    connection = None
    cursor = None

    try:
        # Connect to the MySQL database
        connection = mysql.connector.connect(
            host='localhost',
            database='books',
            user='root',
            password=''
        )

        if connection.is_connected():
            print("Connected to MySQL database")

            # Create a cursor to execute queries
            cursor = connection.cursor(dictionary=True)

            # Execute a sample query (you can modify this as needed)
            cursor.execute("SELECT isbn, author, title, cover, price FROM stock")
            result = cursor.fetchall()

            

            # Print the results
            
            global books
            books = {
                row['isbn']: {
                    "author": row['author'],
                    "title": row['title'],
                    "cover": row['cover'],
                    "price": row['price']
                }
                for row in result
            }
        for isbn, book in books.items():
           print(isbn, book)

      
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
    finally:
        # Close the database connection
        if cursor is not None:
            cursor.close()
        if connection is not None and connection.is_connected():
            connection.close()
            print("MySQL connection is closed")


    


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/scan", methods=["POST"])
def scan():

    data = request.json
    isbn = data["isbn"]

    print("Scanned:", isbn)
    print(type(isbn), isbn)
    isbn = int(isbn)  # Convert the scanned ISBN to an integer

    if isbn in books:
        return jsonify(books[isbn])

    return jsonify({
        "title": "Book not found",
        "author": "",
        "cover": "",
        "price": ""
    })


if __name__ == "__main__":
    start_db_server()
    run_mysql_query()

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )
    
    