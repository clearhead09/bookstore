import os
import threading
from subprocess import call
from pyngrok import ngrok

def start_ngrok():
    # Start ngrok tunnel
    public_url = ngrok.connect(5001)
    print(f"\n * Starting ngrok tunnel \"{public_url}\" -> \"http://")

def open_app():
    # Open the main app file to run Flask
    call(["python", "app.py"])



if __name__ == "__main__":
    # Start the database server

    # Start ngrok in a separate thread
    ngrok_thread = threading.Thread(target=start_ngrok, daemon=True)
    ngrok_thread.start()

    # Open the app
    open_app()